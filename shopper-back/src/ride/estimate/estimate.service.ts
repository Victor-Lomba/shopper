import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IEstimatePayload } from './estimate.controller';
import { PrismaService } from 'src/prisma/prisma.service';

function throwParameterError(message: string) {
  throw new HttpException(
    {
      error_code: 'INVALID_DATA',
      error_description: message,
    },
    HttpStatus.BAD_REQUEST,
  );
}

async function getCoordinates(address: string) {
  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const location = data.results[0].geometry.location;
    return { latitude: location.lat, longitude: location.lng };
  } catch (err) {
    console.error(err);
    throw new HttpException('Invalid location', HttpStatus.BAD_REQUEST);
  }
}

@Injectable()
export class EstimateService {
  constructor(private readonly prisma: PrismaService) {}

  async postEstimate(payload: IEstimatePayload): Promise<string> {
    if (!payload.customer_id) throwParameterError('Missing customer_id field');
    if (!payload.origin) throwParameterError('Missing origin field');
    if (!payload.destination) throwParameterError('Missing destination field');
    if (payload.origin == payload.destination)
      throwParameterError('Origin and Destination cannot be the same');

    try {
      const origin = await getCoordinates(payload.origin);
      const destination = await getCoordinates(payload.destination);

      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
          body: JSON.stringify({
            origin: {
              address: payload.origin,
            },
            destination: {
              address: payload.destination,
            },
            travelMode: 'DRIVE',
          }),
        },
      );

      const data = await response.json();

      const { duration, distanceMeters } = data.routes[0];

      const drivers = await this.prisma.driver.findMany({
        where: {
          minDistance: {
            lte: distanceMeters,
          },
        },
        select: {
          id: true,
          car: true,
          name: true,
          description: true,
          comments: true,
          rate: true,
        },
      });

      const responseJson = {
        origin,
        destination,
        distance: distanceMeters,
        duration: duration,
        options: drivers.map((driver) => {
          const value = (driver.rate * distanceMeters) / 1000;
          return {
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.car,
            value,
            review: {
              rating: driver.comments[0].score,
              comment: driver.comments[0].comment,
            },
          };
        }),
        routeResponse: data,
      };

      return JSON.stringify(responseJson);
    } catch (err) {
      console.error(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IConfirmPayload } from './confirm.controller';

function throwParameterError(message: string) {
  throw new HttpException(
    {
      error_code: 'INVALID_DATA',
      error_description: message,
    },
    HttpStatus.BAD_REQUEST,
  );
}

@Injectable()
export class ConfirmService {
  constructor(private readonly prisma: PrismaService) {}

  async patchConfirm(payload: IConfirmPayload): Promise<string> {
    if (!payload.customer_id) throwParameterError('Missing customer_id field');
    if (!payload.destination) throwParameterError('Missing destination field');
    if (!payload.origin) throwParameterError('Missing destination field');
    if (!payload.distance) throwParameterError('Missing distance field');
    if (!payload.value) throwParameterError('Missing value field');
    if (!payload.duration) throwParameterError('Missing duration field');
    if (!payload.driver) throwParameterError('Missing driver field');
    if (!payload.driver.id) throwParameterError('Missing driver id field');
    if (!payload.driver.name) throwParameterError('Missing driver name field');

    if (payload.origin == payload.destination)
      throwParameterError('Origin and Destination cannot be the same');

    const driver = await this.prisma.driver.findFirst({
      where: {
        id: {
          equals: payload.driver.id,
        },
        name: {
          equals: payload.driver.name,
        },
      },
    });

    if (!driver)
      throw new HttpException(
        {
          error_code: 'DRIVER_NOT_FOUND',
          error_description: 'Motorista não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );

    if (driver.minDistance > payload.distance)
      throw new HttpException(
        {
          error_code: 'INVALID_DISTANCE',
          error_description: 'Distancia invalida para o motorista especificado',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );

    const { destination, distance, customer_id, duration, origin, value } =
      payload;

    await this.prisma.ride.create({
      data: {
        date: new Date(Date.now()),
        destination,
        distance,
        duration,
        origin,
        userId: parseInt(customer_id, 10),
        driverid: driver.id,
        value,
      },
    });

    return JSON.stringify({ success: true });
  }
}

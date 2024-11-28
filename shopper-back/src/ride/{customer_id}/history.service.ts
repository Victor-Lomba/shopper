import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

function throwError(code: string, message: string, status: HttpStatus) {
  throw new HttpException(
    {
      error_code: code,
      error_description: message,
    },
    status,
  );
}

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistoryById(customer_id: string, driver_id?: string) {
    if (driver_id) {
      const driverId = parseInt(driver_id, 10);
      const customerId = parseInt(customer_id, 10);

      const driver = await this.prisma.driver.findFirst({
        where: {
          id: {
            equals: driverId,
          },
        },
      });

      if (!driver)
        return throwError(
          'INVALID_DRIVER',
          'Driver not found',
          HttpStatus.NOT_FOUND,
        );

      const data = await this.prisma.ride.findMany({
        where: {
          driverid: {
            equals: driverId,
          },
          userId: {
            equals: customerId,
          },
        },
      });

      if (data.length <= 0)
        return throwError(
          'NO_RIDES_FOUND',
          'Rides not found',
          HttpStatus.NOT_FOUND,
        );

      const formatedData = {
        customer_id: data[0].userId.toString(),
        rides: data.map(
          ({ id, date, origin, destination, distance, duration, value }) => {
            return {
              id,
              date,
              origin,
              destination,
              distance,
              duration,
              value,
              driver: {
                name: driver.name,
                id: driver.id,
              },
            };
          },
        ),
      };

      return formatedData;
    } else {
      const customerId = parseInt(customer_id, 10);

      const data = await this.prisma.ride.findMany({
        where: {
          userId: {
            equals: customerId,
          },
        },
      });

      if (data.length <= 0)
        return throwError(
          'NO_RIDES_FOUND',
          'Rides not found',
          HttpStatus.NOT_FOUND,
        );

      const formatedData = {
        customer_id: data[0].userId.toString(),
        rides: await Promise.all(
          data.map(
            async ({
              id,
              date,
              origin,
              destination,
              distance,
              duration,
              driverid,
              value,
            }) => {
              const driver = await this.prisma.driver.findFirst({
                where: { id: { equals: driverid } },
              });

              return {
                id,
                date,
                origin,
                destination,
                distance,
                duration,
                value,
                driver: {
                  name: driver.name,
                  id: driver.id,
                },
              };
            },
          ),
        ),
      };

      return formatedData;
    }
  }
}

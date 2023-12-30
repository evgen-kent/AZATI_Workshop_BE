import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * DTO Validation Pipe.
 * Converts incoming data into an instance of the DTO class, utilizing specified DTO fields only.
 * Filters out unnecessary fields and performs validation based on DTO-defined rules.
 * @param value Incoming request data.
 * @param {Type<any>} metatype Request metadata including DTO type (if specified).
 * @returns {Promise<any>} Validated data or original data if DTO is not specified or incoming data cannot be transformed.
 */
@Injectable()
export class ValidateDtoPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    value = plainToInstance(metatype, value);
    await validate(value, { whitelist: true });

    return value;
  }
}

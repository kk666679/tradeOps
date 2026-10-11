import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown, _meta: ArgumentMetadata) {
    const r = this.schema.safeParse(value);
    if (!r.success) throw new BadRequestException(r.error.flatten());
    return r.data;
  }
}

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid id format');
    }
    return value;
  }
}

import {
  IsNotEmpty,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/validation-messages.js';
import { TodoStatusEnum } from '../enums/todo-status.enum.js';

export class CreateTodoDto {
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.isNotEmpty })
  @MinLength(3, { message: VALIDATION_MESSAGES.minLength })
  @MaxLength(10, { message: VALIDATION_MESSAGES.maxLength })
  name: string;

  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.isNotEmpty })
  @MinLength(10, { message: VALIDATION_MESSAGES.minLength })
  description: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(TodoStatusEnum, { message: VALIDATION_MESSAGES.isEnum })
  status?: TodoStatusEnum;
}

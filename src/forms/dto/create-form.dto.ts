import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFieldDto } from './create-field.dto';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}

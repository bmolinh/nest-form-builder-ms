import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Form } from './form.entity';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  ValidateIf,
  Validate,
  ValidationArguments,
} from 'class-validator';

class IsValuesArrayValid {
  validate(values: string[], args: ValidationArguments) {
    const object = args.object as Field;
    return (
      object.type !== 'select' || (Array.isArray(values) && values.length > 0)
    );
  }

  defaultMessage() {
    return 'Values must be a non-empty array when type is select';
  }
}

class IsDefaultValueValid {
  validate(defaultValue: string, args: ValidationArguments) {
    const object = args.object as Field;
    return object.type !== 'select' || object.values.includes(defaultValue);
  }

  defaultMessage() {
    return 'Default value must be one of the values in the values array when type is select';
  }
}

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  label: string;

  @Column()
  @IsNotEmpty()
  @IsIn(['text', 'email', 'date', 'textarea', 'select'])
  type: string;

  @Column({ default: false })
  @IsBoolean()
  required: boolean;

  @Column('simple-array', { nullable: true })
  @ValidateIf((o) => o.type === 'select')
  @Validate(IsValuesArrayValid)
  values: string[];

  @Column({ nullable: true })
  @ValidateIf((o) => o.type === 'select')
  @Validate(IsDefaultValueValid)
  @IsOptional()
  @IsString()
  defaultValue: string;

  @ManyToOne(() => Form, (form) => form.fields)
  form: Form;
}

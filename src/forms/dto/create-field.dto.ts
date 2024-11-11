import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsIn,
  ValidateIf,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValuesArrayValid', async: false })
class IsValuesArrayValid implements ValidatorConstraintInterface {
  validate(values: string[], args: ValidationArguments) {
    const object = args.object as CreateFieldDto;
    return (
      object.type !== 'select' || (Array.isArray(values) && values.length > 0)
    );
  }

  defaultMessage() {
    return 'Values must be a non-empty array when type is select';
  }
}

@ValidatorConstraint({ name: 'isDefaultValueValid', async: false })
class IsDefaultValueValid implements ValidatorConstraintInterface {
  validate(defaultValue: string, args: ValidationArguments) {
    const object = args.object as CreateFieldDto;
    return object.type !== 'select' || object.values.includes(defaultValue);
  }

  defaultMessage() {
    return 'Default value must be one of the values in the values array when type is select';
  }
}

export class CreateFieldDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsIn(['text', 'email', 'date', 'textarea', 'select'])
  type: string;

  @IsBoolean()
  required: boolean;

  @ValidateIf((o) => o.type === 'select')
  @Validate(IsValuesArrayValid)
  values?: string[];

  @ValidateIf((o) => o.type === 'select')
  @Validate(IsDefaultValueValid)
  @IsOptional()
  @IsString()
  defaultValue?: string;
}

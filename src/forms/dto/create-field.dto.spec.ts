import { validate } from 'class-validator';
import { CreateFieldDto } from './create-field.dto';

describe('CreateFieldDto', () => {
  it('should validate all required fields', async () => {
    const dto = new CreateFieldDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((e) => e.property)).toEqual(
      expect.arrayContaining(['name', 'label', 'type', 'required']),
    );
  });

  it('should validate type to be one of the allowed values', async () => {
    const dto = new CreateFieldDto();
    dto.name = 'Test Field';
    dto.label = 'Test Label';
    dto.type = 'invalid';
    dto.required = true;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isIn).toBeDefined();
  });

  it('should validate values array when type is select', async () => {
    const dto = new CreateFieldDto();
    dto.name = 'Test Field';
    dto.label = 'Test Label';
    dto.type = 'select';
    dto.required = true;
    dto.values = [];
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isValuesArrayValid).toBeDefined();
  });

  it('should validate defaultValue to be one of the values in the values array when type is select', async () => {
    const dto = new CreateFieldDto();
    dto.name = 'Test Field';
    dto.label = 'Test Label';
    dto.type = 'select';
    dto.required = true;
    dto.values = ['option1', 'option2'];
    dto.defaultValue = 'invalid';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isDefaultValueValid).toBeDefined();
  });

  it('should pass validation when all fields are valid', async () => {
    const dto = new CreateFieldDto();
    dto.name = 'Test Field';
    dto.label = 'Test Label';
    dto.type = 'select';
    dto.required = true;
    dto.values = ['option1', 'option2'];
    dto.defaultValue = 'option1';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});

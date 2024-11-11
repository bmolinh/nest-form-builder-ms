import { validate } from 'class-validator';
import { Field } from './field.entity';

describe('Field Entity', () => {
  it('should validate a valid Field entity', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'text';
    field.required = true;

    const errors = await validate(field);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is empty', async () => {
    const field = new Field();
    field.name = '';
    field.label = 'Test Label';
    field.type = 'text';
    field.required = true;

    const errors = await validate(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation if type is not in allowed values', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'invalid';
    field.required = true;

    const errors = await validate(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isIn).toBeDefined();
  });

  it('should validate values array when type is select', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'select';
    field.required = true;
    field.values = ['Option 1', 'Option 2'];

    const errors = await validate(field);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if values array is empty when type is select', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'select';
    field.required = true;
    field.values = [];

    const errors = await validate(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isValuesArrayValid).toBeDefined();
  });

  it('should validate defaultValue when type is select', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'select';
    field.required = true;
    field.values = ['Option 1', 'Option 2'];
    field.defaultValue = 'Option 1';

    const errors = await validate(field);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if defaultValue is not in values array when type is select', async () => {
    const field = new Field();
    field.name = 'Test Field';
    field.label = 'Test Label';
    field.type = 'select';
    field.required = true;
    field.values = ['Option 1', 'Option 2'];
    field.defaultValue = 'Invalid Option';

    const errors = await validate(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isDefaultValueValid).toBeDefined();
  });
});

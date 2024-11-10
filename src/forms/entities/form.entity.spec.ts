import { validate } from 'class-validator';
import { Form } from './form.entity';
import { Field } from './field.entity';

describe('Form Entity', () => {
  it('should validate a valid form', async () => {
    const field = new Field();
    field.name = 'Field 1';
    field.label = 'Label 1';
    field.type = 'text';
    field.required = true;

    const form = new Form();
    form.name = 'Test Form';
    form.description = 'This is a test form';
    form.fields = [field];

    const errors = await validate(form);
    expect(errors.length).toBe(0);
  });

  it('should not validate a form without a name', async () => {
    const form = new Form();
    form.description = 'This is a test form';

    const errors = await validate(form);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should not validate a form without a description', async () => {
    const form = new Form();
    form.name = 'Test Form';

    const errors = await validate(form);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should not validate a form with an empty name', async () => {
    const form = new Form();
    form.name = '';
    form.description = 'This is a test form';

    const errors = await validate(form);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should not validate a form with an empty description', async () => {
    const form = new Form();
    form.name = 'Test Form';
    form.description = '';

    const errors = await validate(form);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should validate a form with multiple fields', async () => {
    const field1 = new Field();
    field1.name = 'Field 1';
    field1.label = 'Label 1';
    field1.type = 'text';
    field1.required = true;

    const field2 = new Field();
    field2.name = 'Field 2';
    field2.label = 'Label 2';
    field2.type = 'email';
    field2.required = false;

    const form = new Form();
    form.name = 'Test Form';
    form.description = 'This is a test form';
    form.fields = [field1, field2];

    const errors = await validate(form);
    expect(errors.length).toBe(0);
    expect(form.fields.length).toBe(2);
    expect(form.fields[0].name).toBe('Field 1');
    expect(form.fields[1].name).toBe('Field 2');
  });
});

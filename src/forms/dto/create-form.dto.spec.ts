import 'reflect-metadata';
import { validate } from 'class-validator';
import { CreateFormDto } from './create-form.dto';
import { CreateFieldDto } from './create-field.dto';

describe('CreateFormDto', () => {
  it('should validate successfully with correct data', async () => {
    const createFieldDto = new CreateFieldDto();
    createFieldDto.name = 'Field Name';
    createFieldDto.type = 'text';
    createFieldDto.label = 'Field Label';
    createFieldDto.required = true;

    const createFormDto = new CreateFormDto();
    createFormDto.name = 'Form Name';
    createFormDto.description = 'Form Description';
    createFormDto.fields = [createFieldDto];

    const errors = await validate(createFormDto);
    console.log(errors);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when name is empty', async () => {
    const createFieldDto = new CreateFieldDto();
    createFieldDto.name = 'Field Name';
    createFieldDto.type = 'text';

    const createFormDto = new CreateFormDto();
    createFormDto.name = '';
    createFormDto.description = 'Form Description';
    createFormDto.fields = [createFieldDto];

    const errors = await validate(createFormDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation when description is empty', async () => {
    const createFieldDto = new CreateFieldDto();
    createFieldDto.name = 'Field Name';
    createFieldDto.type = 'text';

    const createFormDto = new CreateFormDto();
    createFormDto.name = 'Form Name';
    createFormDto.description = '';
    createFormDto.fields = [createFieldDto];

    const errors = await validate(createFormDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation when fields array is empty', async () => {
    const createFormDto = new CreateFormDto();
    createFormDto.name = 'Form Name';
    createFormDto.description = 'Form Description';
    createFormDto.fields = [];

    const errors = await validate(createFormDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('fields');
  });

  it('should fail validation when fields array contains invalid field', async () => {
    const createFieldDto = new CreateFieldDto();
    createFieldDto.name = '';
    createFieldDto.type = 'text';

    const createFormDto = new CreateFormDto();
    createFormDto.name = 'Form Name';
    createFormDto.description = 'Form Description';
    createFormDto.fields = [createFieldDto];

    const errors = await validate(createFormDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('fields');
  });
});

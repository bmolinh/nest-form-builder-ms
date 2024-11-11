import { validate } from 'class-validator';
import { Answer } from './answer.entity';

describe('Answer Entity', () => {
  it('should validate a valid Answer entity', async () => {
    const field = new Answer();
    field.value = 'Test Answer';

    const errors = await validate(field);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if value is empty', async () => {
    const field = new Answer();
    field.value = '';

    const errors = await validate(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isNotEmpty).toBeDefined();
  });
});

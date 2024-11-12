import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';
import { Field } from './entities/field.entity';
import { Answer } from './entities/answer.entity';
import { SubmitAnswerDto } from './dto/submit-form.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formsRepository: Repository<Form>,
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formsRepository.create(createFormDto);
    return this.formsRepository.save(form);
  }

  async submit(id: number, answersDto: SubmitAnswerDto[]): Promise<Form> {
    const form = await this.findOne(id);

    if (!form) throw new NotFoundException(`Form with ID ${id} not found`);

    const submission = new Submission();
    submission.form = form;

    const answers: Answer[] = [];
    const answerFieldIds = new Set(answersDto.map((answer) => answer.fieldId));

    for (const field of form.fields) {
      if (field.required && !answerFieldIds.has(field.id)) {
        throw new BadRequestException(
          `Required field with ID ${field.id} in form with ID ${id} is missing an answer`,
        );
      }

      const answerDto = answersDto.find(
        (answer) => answer.fieldId === field.id,
      );

      if (answerDto) {
        const answer = new Answer();
        answer.field = field;
        answer.value = answerDto.value;
        answer.submission = submission;
        answers.push(answer);
      }
    }

    await this.submissionsRepository.save(submission);
    await this.answersRepository.save(answers);

    return form;
  }

  findAll(): Promise<Form[]> {
    return this.formsRepository.find({
      relations: [
        'fields',
        'submissions',
        'submissions.answers',
        'submissions.answers.field',
      ],
    });
  }

  findOne(id: number): Promise<Form> {
    return this.formsRepository.findOne({
      where: { id },
      relations: ['fields'],
    });
  }

  async update(id: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id);

    if (!form) throw new NotFoundException(`Form with ID ${id} not found`);

    if (updateFormDto.fields) {
      form.fields = updateFormDto.fields.map((fieldDto) => {
        const existingField = form.fields.find((f) => f.id === fieldDto.id);

        if (existingField) {
          return { ...existingField, ...fieldDto };
        }

        const newField = new Field();
        Object.assign(newField, fieldDto);
        newField.form = form;

        return newField;
      });
    }

    Object.assign(form, updateFormDto);
    return this.formsRepository.save(form);
  }

  async remove(id: number): Promise<void> {
    await this.formsRepository.delete(id);
  }
}

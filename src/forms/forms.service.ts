import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';
import { Field } from './entities/field.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formsRepository: Repository<Form>,
  ) {}

  create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formsRepository.create(createFormDto);
    return this.formsRepository.save(form);
  }

  findAll(): Promise<Form[]> {
    return this.formsRepository.find({ relations: ['fields'] });
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

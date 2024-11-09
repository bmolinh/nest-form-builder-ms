import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';

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
    await this.formsRepository.update(id, updateFormDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.formsRepository.delete(id);
  }
}

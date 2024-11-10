import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Form } from './entities/form.entity';

@Controller('forms')
export class FormsController {
  private readonly logger = new Logger(FormsController.name);

  constructor(private readonly formsService: FormsService) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto): Promise<Form> {
    this.logger.log(`Creating a form with name: ${createFormDto.name}`);
    const form = await this.formsService.create(createFormDto);
    this.logger.log(`Form created with ID: ${form.id}`);
    return form;
  }

  @Get()
  async findAll(): Promise<Form[]> {
    this.logger.log('Fetching all forms');
    const forms = await this.formsService.findAll();
    this.logger.log(`Fetched ${forms.length} forms`);
    return forms;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Form> {
    this.logger.log(`Fetching form with ID: ${id}`);
    const form = await this.formsService.findOne(+id);

    if (!form) {
      this.logger.warn(`Form not found with ID: ${id}`);
      return null;
    }

    this.logger.log(`Form found with ID: ${id}`);
    return form;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<Form> {
    this.logger.log(`Updating form with ID: ${id}`);
    const form = await this.formsService.update(+id, updateFormDto);
    this.logger.log(`Form updated with ID: ${id}`);
    return form;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removing form with ID: ${id}`);
    await this.formsService.remove(+id);
    this.logger.log(`Form removed with ID: ${id}`);
  }
}

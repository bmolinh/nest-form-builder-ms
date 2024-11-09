import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from './entities/form.entity';
import { Field } from './entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Field])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}

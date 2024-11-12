import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form } from './entities/form.entity';
import { Field } from './entities/field.entity';
import { Answer } from './entities/answer.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Field, Answer, Submission])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}

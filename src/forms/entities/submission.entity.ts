import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Answer } from './answer.entity';
import { Form } from './form.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Form, (form) => form.submissions)
  form: Form;

  @OneToMany(() => Answer, (answer) => answer.submission, { cascade: true })
  answers: Answer[];
}

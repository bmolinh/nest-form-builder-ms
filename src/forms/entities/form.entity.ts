import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field } from './field.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Submission } from './submission.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @OneToMany(() => Field, (field) => field.form, { cascade: true })
  fields: Field[];

  @OneToMany(() => Submission, (submission) => submission.form, {
    cascade: true,
  })
  submissions: Submission[];
}

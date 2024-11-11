import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field } from './field.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  value: string;

  @ManyToOne(() => Field, (field) => field.answers)
  field: Field;
}

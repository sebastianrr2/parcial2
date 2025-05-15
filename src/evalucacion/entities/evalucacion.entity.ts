/* eslint-disable prettier/prettier */
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
import { Profesor } from '../../profesor/entities/profesor.entity';

@Entity()
export class Evalucacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.evaluaciones, { eager: true })
  proyecto: Proyecto;

  @ManyToOne(() => Profesor, (profesor) => profesor.evaluaciones, { eager: true })
  evaluador: Profesor;
}



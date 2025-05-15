/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
import { Evalucacion } from '../../evalucacion/entities/evalucacion.entity';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  cedula: number;

  @Column()
  departamento: string;

  @Column({ length: 5 })
  extension: string;

  @Column()
  esParEvaluador: boolean;
  
  @OneToMany(() => Proyecto, (proyecto) => proyecto.mentor)
  proyectosMentor: Proyecto[];

  @OneToMany(() => Evalucacion, (evalucacion) => evalucacion.evaluador)
  evaluaciones: Evalucacion[];
}

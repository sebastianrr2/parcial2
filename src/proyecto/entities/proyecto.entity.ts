/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Evalucacion } from '../../evalucacion/entities/evalucacion.entity';
import { Profesor } from '../../profesor/entities/profesor.entity';


@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column('decimal', { precision: 10, scale: 2 })
  presupuesto: number;

  @Column({ default: 0 })
  estado: number;

  @Column({ default: 0 })
  notaFinal: number;

  @Column()
  fechaInicio: string;

  @Column()
  fechaFin: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.proyectos, { eager: true })
  lider: Estudiante;

  @ManyToOne(() => Profesor, (profesor) => profesor.proyectosMentor, {eager: true })
  mentor: Profesor;

  @OneToMany(() => Evalucacion, (evalucacion) => evalucacion.proyecto, { cascade: true })
  evaluaciones: Evalucacion[];
  estudiantes: never[];
}


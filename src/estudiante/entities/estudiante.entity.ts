/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  semestre: number;

  @Column('real')
  promedio: number;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.lider)
  proyectos: Proyecto[];
}





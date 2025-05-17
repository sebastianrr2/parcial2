/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Evalucacion } from 'src/evalucacion/entities/evalucacion.entity';
import { Profesor } from 'src/profesor/entities/profesor.entity';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [Estudiante, Profesor, Proyecto, Evalucacion],
   synchronize: true,
 }),
 TypeOrmModule.forFeature([Estudiante, Profesor, Proyecto, Evalucacion]),
];
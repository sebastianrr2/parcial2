/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Evalucacion } from '../../evalucacion/entities/evalucacion.entity';
import { Profesor } from '../../profesor/entities/profesor.entity';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';


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
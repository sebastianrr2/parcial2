/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Evalucacion } from './entities/evalucacion.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { EvalucacionService } from './evalucacion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evalucacion, Profesor, Proyecto]), // <-- esto es CLAVE
  ],
  providers: [EvalucacionService],
  exports: [EvalucacionService],
})
export class EvalucacionModule {}


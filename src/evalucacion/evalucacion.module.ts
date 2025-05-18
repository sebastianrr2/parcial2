/* eslint-disable prettier/prettier */
// evalucacion.module.ts
import { Module } from '@nestjs/common';
import { EvalucacionService } from './evalucacion.service';
import { EvalucacionController } from './evalucacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evalucacion } from './entities/evalucacion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Profesor } from '../profesor/entities/profesor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evalucacion, Proyecto, Profesor]), // Agregar Profesor
  ],
  controllers: [EvalucacionController],
  providers: [EvalucacionService],
})
export class EvalucacionModule {}



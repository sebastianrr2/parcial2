/* eslint-disable prettier/prettier */
// profesor.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from './entities/profesor.entity';
import { Evalucacion } from '../evalucacion/entities/evalucacion.entity';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profesor, Evalucacion]), // <- necesario
  ],
  controllers: [ProfesorController],
  providers: [ProfesorService],
  exports: [ProfesorService],
})
export class ProfesorModule {}


/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';



import { ProfesorController } from './profesor.controller';
import { ProfesorService } from './profesor.service';
import { Profesor } from './entities/profesor.entity';






@Module({
  imports: [TypeOrmModule.forFeature([Profesor])], // <-- ESTO REGISTRA ProyectoRepository
  controllers: [ProfesorController],
  providers: [ProfesorService],
  exports: [ProfesorService], // opcional si otro módulo lo necesita
// opcional si otro módulo lo necesita
})
export class ProfesorModule {}

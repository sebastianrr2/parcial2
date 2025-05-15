/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './entities/estudiante.entity'; // <-- IMPORTANTE

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])], // <-- ESTO ES CLAVE
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService], // opcional si lo vas a usar fuera
})
export class EstudianteModule {}

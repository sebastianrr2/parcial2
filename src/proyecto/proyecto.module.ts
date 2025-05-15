/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])], // <-- ESTO REGISTRA ProyectoRepository
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService], // opcional si otro módulo lo necesita
})
export class ProyectoModule {}


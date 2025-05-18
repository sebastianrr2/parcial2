/* eslint-disable prettier/prettier */

import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './entities/proyecto.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<Proyecto> {
    return this.proyectoService.crearProyecto(dto);
  }

  @Post(':id/avanzar')
  async avanzarProyecto(@Param('id', ParseIntPipe) id: number): Promise<Proyecto> {
    return this.proyectoService.avanzarProyecto(id);
  }

  
  @Get(':id/estudiantes') // Cambiar a plural
    async obtenerEstudiantesPorProyecto(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<Estudiante[]> { // Cambiar a array
      return this.proyectoService.findEstudiantesPorProyecto(id); // Cambiar nombre del método
    }
}



/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crear(@Body() createEstudianteDto: CreateEstudianteDto) {
    return await this.estudianteService.crearEstudiante(createEstudianteDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number) {
    return await this.estudianteService.eliminarEstudiante(id);
  }
}


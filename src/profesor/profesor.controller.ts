/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';


@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async crearProfesor(@Body() createProfesorDto: CreateProfesorDto) {
    return await this.profesorService.crearProfesor(createProfesorDto);
  }

  @Post('asignar-evaluador')
  async asignarEvaluador(
    @Body() body: { proyectoId: number; evaluadorId: number; calificacion: number }
  ) {
    const { proyectoId, evaluadorId, calificacion } = body;
    return await this.profesorService.asignarEvaluador(proyectoId, evaluadorId, calificacion);
  }
}



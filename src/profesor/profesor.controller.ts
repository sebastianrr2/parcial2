/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { CreateEvalucacionDto } from 'src/evalucacion/dto/create-evalucacion.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { CreateProfesorDto } from './dto/create-profesor.dto';


@Controller('profesores')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearProfesor(@Body() createProfesorDto: CreateProfesorDto) {
    return await this.profesorService.crearProfesor(createProfesorDto);
  }

  @Post('asignar-evaluador')
  @HttpCode(HttpStatus.CREATED)
  async asignarEvaluador(
    @Body() body: { evaluacionDto: CreateEvalucacionDto; profesorDto: UpdateProfesorDto }
  ) {
    const { evaluacionDto, profesorDto } = body;
    return await this.profesorService.asignarEvaluador(evaluacionDto, profesorDto);
  }
}



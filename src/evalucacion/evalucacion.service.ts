/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evalucacion } from './entities/evalucacion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';
import { ProfesorService } from '../profesor/profesor.service';
import { UpdateProfesorDto } from '../profesor/dto/update-profesor.dto';

@Injectable()
export class EvalucacionService {
  constructor(
    @InjectRepository(Evalucacion)
    private evaluacionRepo: Repository<Evalucacion>,

    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,

    private readonly profesorService: ProfesorService,
  ) {}

  async crearEvaluacion(dto: CreateEvalucacionDto, profesorDTO: UpdateProfesorDto): Promise<Evalucacion> {
    // Buscar el proyecto con su mentor
    const proyecto = await this.proyectoRepo.findOne({
      where: { id: dto.proyecto.id },
      relations: ['mentor'],
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Validar que el profesor no sea el mentor del proyecto
    if (proyecto.mentor.id === profesorDTO.id) {
      throw new BadRequestException('El evaluador no puede ser el mismo que el mentor del proyecto');
    }

    // Validar calificación
    if (dto.calificacion < 0 || dto.calificacion > 5) {
      throw new BadRequestException('La calificación debe estar entre 0 y 5');
    }

    // Reutilizamos la lógica de ProfesorService
    const evaluacion = await this.profesorService.asignarEvaluador(dto, profesorDTO);

    return evaluacion;
  }
}



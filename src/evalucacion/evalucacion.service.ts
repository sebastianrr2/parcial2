/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evalucacion } from './entities/evalucacion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';

@Injectable()
export class EvalucacionService {
  constructor(
    @InjectRepository(Evalucacion)
    private evaluacionRepo: Repository<Evalucacion>,

    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,

    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,
  ) {}

  async crearEvaluacion(dto: CreateEvalucacionDto): Promise<Evalucacion> {
    // Buscar el proyecto con su mentor
    const proyecto = await this.proyectoRepo.findOne({
      where: { id: dto.proyectoId },
      relations: ['mentor'],
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Buscar el evaluador
    const evaluador = await this.profesorRepo.findOne({
      where: { id: dto.evaluadorId },
    });

    if (!evaluador) {
      throw new NotFoundException('Evaluador no encontrado');
    }

    // Validar que el evaluador sea par evaluador
    if (!evaluador.esParEvaluador) {
      throw new BadRequestException('El profesor debe ser par evaluador');
    }

    // Validar que el profesor no sea el mentor del proyecto
    if (proyecto.mentor && proyecto.mentor.id === evaluador.id) {
      throw new BadRequestException('El evaluador no puede ser el mismo que el mentor del proyecto');
    }

    // Validar calificación
    if (dto.calificacion < 0 || dto.calificacion > 5) {
      throw new BadRequestException('La calificación debe estar entre 0 y 5');
    }

    // Verificar si ya existe una evaluación del mismo evaluador para este proyecto
    const evaluacionExistente = await this.evaluacionRepo.findOne({
      where: {
        proyecto: { id: dto.proyectoId },
        evaluador: { id: dto.evaluadorId }
      }
    });

    if (evaluacionExistente) {
      throw new BadRequestException('Ya existe una evaluación de este evaluador para este proyecto');
    }

    // Crear y guardar la evaluación
    const evaluacion = this.evaluacionRepo.create({
      calificacion: dto.calificacion,
      proyecto: proyecto,
      evaluador: evaluador,
    });

    return await this.evaluacionRepo.save(evaluacion);
  }
}


/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evalucacion } from './entities/evalucacion.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';

@Injectable()
export class EvalucacionService {
  constructor(
    @InjectRepository(Evalucacion)
    private evaluacionRepo: Repository<Evalucacion>,

    @InjectRepository(Profesor)
    private profesorRepo: Repository<Profesor>,

    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async crearEvaluacion(dto: CreateEvalucacionDto, evaluadorId: number): Promise<Evalucacion> {
    // Buscar al profesor evaluador
    const evaluador = await this.profesorRepo.findOne({ where: { id: evaluadorId } });
    if (!evaluador) {
      throw new NotFoundException('Evaluador no encontrado');
    }

    // Buscar el proyecto con su mentor
    const proyecto = await this.proyectoRepo.findOne({
      where: { id: dto.proyecto.id },
      relations: ['mentor'],
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Validar que el evaluador no sea el mentor del proyecto
    if (proyecto.mentor.id === evaluador.id) {
      throw new BadRequestException('El evaluador no puede ser el mismo que el mentor del proyecto');
    }

    // Validar que la calificación esté entre 0 y 5
    if (dto.calificacion < 0 || dto.calificacion > 5) {
      throw new BadRequestException('La calificación debe estar entre 0 y 5');
    }

     // Crear y guardar la evaluación
    const evaluacion = this.evaluacionRepo.create({
      proyecto,
      evaluador,
      calificacion: dto.calificacion,
    });

    return this.evaluacionRepo.save(evaluacion);
  }
}


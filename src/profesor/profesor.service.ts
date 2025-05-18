/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { Evalucacion } from '../evalucacion/entities/evalucacion.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';

@Injectable()
export class ProfesorService {

    constructor(
        @InjectRepository(Profesor)
        private profesorRepo: Repository<Profesor>,

        @InjectRepository(Evalucacion)
        private evaluacionRepo: Repository<Evalucacion>,
    ) {}

    async crearProfesor(dto: CreateProfesorDto): Promise<Profesor> {
        if (dto.extension.length !== 5) {
            throw new BadRequestException('La extensión debe tener exactamente 5 caracteres');
        }

        const nuevo = this.profesorRepo.create(dto);
        return await this.profesorRepo.save(nuevo);
    }

    async asignarEvaluador(proyectoId: number, evaluadorId: number, calificacion: number): Promise<Evalucacion> {
        const profesor = await this.profesorRepo.findOne({ 
            where: { id: evaluadorId },
            relations: ['evaluaciones']
        });
        
        if (!profesor) {
            throw new NotFoundException('Profesor no encontrado');
        }

        if (profesor.evaluaciones.length >= 3) {
            throw new BadRequestException('El profesor ya tiene 3 evaluaciones activas');
        }

        const evaluacion = this.evaluacionRepo.create({
            calificacion: calificacion,
            proyecto: { id: proyectoId },
            evaluador: profesor,
        });

        return await this.evaluacionRepo.save(evaluacion);
    }
}


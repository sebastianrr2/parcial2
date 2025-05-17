/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';
import { Evalucacion } from 'src/evalucacion/entities/evalucacion.entity';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { CreateEvalucacionDto } from 'src/evalucacion/dto/create-evalucacion.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Injectable()
export class ProfesorService {

    constructor(
        @InjectRepository(Profesor)
        private profesorRepo: Repository<Profesor>,

        @InjectRepository(Evalucacion)
        private evaluacionRepo: Repository<Evalucacion>,
    ) {}

    async crearProfesor(dto: CreateProfesorDto): Promise<Profesor> {
        if (dto.extencion.length < 5) {
            throw new BadRequestException('La extensión debe tener al menos 5 caracteres');
        }

        const nuevo = this.profesorRepo.create(dto);
        return await this.profesorRepo.save(nuevo);
    }

    async asignarEvaluador(evaluacionDto: CreateEvalucacionDto, profesorDTO: UpdateProfesorDto): Promise<Evalucacion> {
        const profesor = await this.profesorRepo.findOne({ where: { id: profesorDTO.id } });
        if (!profesor) {
            throw new NotFoundException('Profesor no encontrado');
        }

        if (profesorDTO.evalucaciones.length >= 3) {
            throw new BadRequestException('El profesor ya tiene 3 evaluaciones activas');
        }

        const evaluacion = this.evaluacionRepo.create({
        ...evaluacionDto,
        evaluador: profesor, // profesor obtenido por ID
        });

        return await this.evaluacionRepo.save(evaluacion);
    }
}


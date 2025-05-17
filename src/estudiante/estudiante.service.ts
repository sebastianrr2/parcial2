/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
  ) {}

  async crearEstudiante(dto: CreateEstudianteDto): Promise<Estudiante> {
    if (dto.promedio < 3.2 || dto.semestre < 4) {
      throw new BadRequestException('Solo se permiten estudiantes con promedio ≥ 3.2 y semestre ≥ 4');
    }

    const nuevo = this.estudianteRepo.create(dto);
    return await this.estudianteRepo.save(nuevo);
  }

  async eliminarEstudiante(id: number): Promise<string> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id },
      relations: ['proyectos'], // asegúrate de tener esta relación definida
    });

    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');

    if (estudiante.proyectos && estudiante.proyectos.length > 0) {
      throw new BadRequestException('No se puede eliminar un estudiante con proyectos activos');
    }

    await this.estudianteRepo.remove(estudiante);
    return 'Estudiante eliminado correctamente';
  }
}


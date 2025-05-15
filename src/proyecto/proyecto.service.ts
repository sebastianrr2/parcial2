/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async crearProyecto(dto: CreateProyectoDto): Promise<Proyecto> {
    if (dto.presupuesto <= 0) {
      throw new BadRequestException('El presupuesto debe ser mayor a 0');
    }

    if (!dto.titulo || dto.titulo.length <= 15) {
      throw new BadRequestException('El título debe tener más de 15 caracteres');
    }

    const nuevo = this.proyectoRepo.create(dto);
    return await this.proyectoRepo.save(nuevo);
  }

  async avanzarProyecto(id: number): Promise<Proyecto> {
    const proyecto = await this.proyectoRepo.findOne({ where: { id } });

    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    if (proyecto.estado >= 4) {
      throw new BadRequestException('El proyecto ya está en su estado máximo (4)');
    }

    proyecto.estado += 1;
    return await this.proyectoRepo.save(proyecto);
  }

  async findAllEstudiantes(id: number): Promise<Estudiante[]> {
    const proyecto = await this.proyectoRepo.findOne({
      where: { id },
      relations: ['estudiantes'], // asegúrate de que esta relación exista si usas muchos estudiantes
    });

    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    return proyecto.estudiantes || [];
  }
}


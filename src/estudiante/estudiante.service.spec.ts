/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from './entities/estudiante.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<Estudiante>;
  let proyectoRepository: Repository<Proyecto>;
  let profesorRepository: Repository<Profesor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    profesorRepository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student with valid data', async () => {
    const createEstudianteDto = {
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    };

    const result = await service.crearEstudiante(createEstudianteDto);
    
    expect(result).toBeDefined();
    expect(result.nombre).toBe(createEstudianteDto.nombre);
    expect(result.cedula).toBe(createEstudianteDto.cedula);
    expect(result.semestre).toBe(createEstudianteDto.semestre);
    expect(result.promedio).toBe(createEstudianteDto.promedio);
  });

  it('should not create a student with low average', async () => {
    const createEstudianteDto = {
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 3.0 // Promedio menor a 3.2
    };

    await expect(service.crearEstudiante(createEstudianteDto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should not create a student with low semester', async () => {
    const createEstudianteDto = {
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 3, // Semestre menor a 4
      promedio: 4.0
    };

    await expect(service.crearEstudiante(createEstudianteDto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should delete a student without projects', async () => {
    // Crear estudiante
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    // Eliminar estudiante
    const result = await service.eliminarEstudiante(savedEstudiante.id);
    
    expect(result).toBe('Estudiante eliminado correctamente');
    
    // Verificar que fue eliminado
    const deletedEstudiante = await estudianteRepository.findOne({
      where: { id: savedEstudiante.id }
    });
    expect(deletedEstudiante).toBeNull();
  });

  it('should not delete a estudiante because it has projects', async () => {
    // 1. Crear profesor (mentor)
    const profesor = profesorRepository.create({
      nombre: 'Dr. María García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear estudiante
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    // 3. Crear proyecto asociado al estudiante
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto de Investigación',
      area: 'Tecnología',
      presupuesto: 5000.00,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedProfesor
    });
    await proyectoRepository.save(proyecto);

    // 4. Intentar eliminar el estudiante (debe fallar)
    await expect(service.eliminarEstudiante(savedEstudiante.id))
      .rejects
      .toThrow(BadRequestException);
    
    // 5. Verificar que el estudiante aún existe
    const estudianteExists = await estudianteRepository.findOne({
      where: { id: savedEstudiante.id }
    });
    expect(estudianteExists).toBeDefined();
  });

  it('should throw NotFoundException when trying to delete non-existent student', async () => {
    const nonExistentId = 999999;
    
    await expect(service.eliminarEstudiante(nonExistentId))
      .rejects
      .toThrow(NotFoundException);
  });

  // Cleanup después de cada prueba para evitar conflictos
  afterEach(async () => {
    await proyectoRepository.clear();
    await estudianteRepository.clear();
    await profesorRepository.clear();
  });
});
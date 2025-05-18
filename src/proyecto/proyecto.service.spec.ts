/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './entities/proyecto.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let proyectoRepository: Repository<Proyecto>;
  let estudianteRepository: Repository<Estudiante>;
  let profesorRepository: Repository<Profesor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProyectoService],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    profesorRepository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Pruebas para crearProyecto
  it('should create a project with valid data', async () => {
    // 1. Crear estudiante y profesor necesarios
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear DTO con IDs válidos
    const createProyectoDto: CreateProyectoDto = {
      titulo: 'Este es un título válido con más de 15 caracteres',
      area: 'Tecnología',
      presupuesto: 10000,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      idLider: savedEstudiante.id,
      idMentor: savedProfesor.id
    };

    const result = await service.crearProyecto(createProyectoDto);

    expect(result).toBeDefined();
    expect(result.titulo).toBe(createProyectoDto.titulo);
    expect(result.area).toBe(createProyectoDto.area);
    expect(result.presupuesto).toBe(createProyectoDto.presupuesto);
    expect(result.fechaInicio).toBe(createProyectoDto.fechaInicio);
    expect(result.fechaFin).toBe(createProyectoDto.fechaFin);
  });

  it('should not create a project with invalid budget', async () => {
    // 1. Crear entidades necesarias
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. DTO con presupuesto inválido
    const createProyectoDto: CreateProyectoDto = {
      titulo: 'Este es un título válido con más de 15 caracteres',
      area: 'Tecnología',
      presupuesto: 0, // Presupuesto inválido
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      idLider: savedEstudiante.id,
      idMentor: savedProfesor.id
    };

    await expect(service.crearProyecto(createProyectoDto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should not create a project with short title', async () => {
    // 1. Crear entidades necesarias
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. DTO con título inválido
    const createProyectoDto: CreateProyectoDto = {
      titulo: 'Título corto', // Solo 13 caracteres (inválido)
      area: 'Tecnología',
      presupuesto: 10000,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      idLider: savedEstudiante.id,
      idMentor: savedProfesor.id
    };

    await expect(service.crearProyecto(createProyectoDto))
      .rejects
      .toThrow(BadRequestException);
  });

  // Pruebas para avanzarProyecto
  it('should advance project state successfully', async () => {
    // 1. Crear entidades necesarias
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear proyecto
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto para avanzar con título válido',
      area: 'Test',
      presupuesto: 10000,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedProfesor
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 3. Avanzar proyecto
    const result = await service.avanzarProyecto(savedProyecto.id);

    // 4. Verificar
    expect(result).toBeDefined();
    expect(result.estado).toBe(2); // Debería haber avanzado de 1 a 2
  });

  it('should not advance project when state is already 4', async () => {
    // 1. Crear entidades necesarias
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear proyecto en estado máximo
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto en estado máximo con título válido',
      area: 'Test',
      presupuesto: 10000,
      estado: 4, // Estado máximo
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedProfesor
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 3. Intentar avanzar (debe fallar)
    await expect(service.avanzarProyecto(savedProyecto.id))
      .rejects
      .toThrow(BadRequestException);
  });

  // Pruebas para findEstudiantesPorProyecto
  it('should return project leader as list', async () => {
    // 1. Crear entidades necesarias
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear proyecto con líder
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto con líder y título válido largo',
      area: 'Test',
      presupuesto: 10000,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedProfesor
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 3. Obtener estudiantes del proyecto
    const result = await service.findEstudiantesPorProyecto(savedProyecto.id);

    // 4. Verificar
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(savedEstudiante.id);
  });

  it('should throw NotFoundException when project has no leader', async () => {
    // 1. Crear entidades necesarias
    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 2. Crear proyecto sin líder
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto sin líder pero con título válido largo',
      area: 'Test',
      presupuesto: 10000,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      mentor: savedProfesor
      // Sin lider
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 3. Intentar obtener estudiantes (debe fallar)
    await expect(service.findEstudiantesPorProyecto(savedProyecto.id))
      .rejects
      .toThrow(NotFoundException);
  });

  // Cleanup
  afterEach(async () => {
    await proyectoRepository.clear();
    await estudianteRepository.clear();
    await profesorRepository.clear();
  });
});
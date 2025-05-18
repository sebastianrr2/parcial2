/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EvalucacionService } from './evalucacion.service';
import { Evalucacion } from './entities/evalucacion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';

describe('EvalucacionService', () => {
  let service: EvalucacionService;
  let evaluacionRepository: Repository<Evalucacion>;
  let proyectoRepository: Repository<Proyecto>;
  let profesorRepository: Repository<Profesor>;
  let estudianteRepository: Repository<Estudiante>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EvalucacionService],
    }).compile();

    service = module.get<EvalucacionService>(EvalucacionService);
    evaluacionRepository = module.get<Repository<Evalucacion>>(getRepositoryToken(Evalucacion));
    proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    profesorRepository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an evaluation successfully', async () => {
    // 1. Crear estudiante
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    // 2. Crear mentor
    const mentor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedMentor = await profesorRepository.save(mentor);

    // 3. Crear evaluador (diferente al mentor)
    const evaluador = profesorRepository.create({
      nombre: 'Dra. Ana López',
      cedula: 555666777,
      departamento: 'Matemáticas',
      extension: '54321',
      esParEvaluador: true
    });
    const savedEvaluador = await profesorRepository.save(evaluador);

    // 4. Crear proyecto
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto de IA',
      area: 'Inteligencia Artificial',
      presupuesto: 10000.00,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedMentor
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 5. Crear evaluación
    const evaluacionDto: CreateEvalucacionDto = {
      calificacion: 4.5,
      proyectoId: savedProyecto.id,
      evaluadorId: savedEvaluador.id
    };

    const result = await service.crearEvaluacion(evaluacionDto);

    // 6. Verificar resultado
    expect(result).toBeDefined();
    expect(result.calificacion).toBe(4.5);
    expect(result.proyecto.id).toBe(savedProyecto.id);
    expect(result.evaluador.id).toBe(savedEvaluador.id);
  });

  it('should not create evaluation when evaluator is the same as mentor', async () => {
    // 1. Crear estudiante
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    // 2. Crear profesor que será mentor y evaluador
    const profesor = profesorRepository.create({
      nombre: 'Dr. Carlos García',
      cedula: 987654321,
      departamento: 'Ingeniería',
      extension: '12345',
      esParEvaluador: true
    });
    const savedProfesor = await profesorRepository.save(profesor);

    // 3. Crear proyecto con el profesor como mentor
    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto de IA',
      area: 'Inteligencia Artificial',
      presupuesto: 10000.00,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedProfesor
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 4. Intentar crear evaluación con el mismo profesor como evaluador
    const evaluacionDto: CreateEvalucacionDto = {
      calificacion: 4.5,
      proyectoId: savedProyecto.id,
      evaluadorId: savedProfesor.id // Mismo ID que el mentor
    };

    // 5. Verificar que lanza excepción
    await expect(service.crearEvaluacion(evaluacionDto))
      .rejects
      .toThrow(BadRequestException);
  });

  // Cleanup
  afterEach(async () => {
    await evaluacionRepository.clear();
    await proyectoRepository.clear();
    await estudianteRepository.clear();
    await profesorRepository.clear();
  });
});
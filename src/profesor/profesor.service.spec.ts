/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProfesorService } from './profesor.service';
import { Profesor } from './entities/profesor.entity';
import { Evalucacion } from '../evalucacion/entities/evalucacion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { BadRequestException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesor.dto';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let profesorRepository: Repository<Profesor>;
  let evaluacionRepository: Repository<Evalucacion>;
  let proyectoRepository: Repository<Proyecto>;
  let estudianteRepository: Repository<Estudiante>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProfesorService],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    profesorRepository = module.get<Repository<Profesor>>(getRepositoryToken(Profesor));
    evaluacionRepository = module.get<Repository<Evalucacion>>(getRepositoryToken(Evalucacion));
    proyectoRepository = module.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Pruebas para crearProfesor
  it('should create a professor with valid extension', async () => {
    const createProfesorDto: CreateProfesorDto = {
      nombre: 'Dr. Juan Carlos',
      cedula: 12345678,
      departamento: 'Ingeniería',
      extension: '12345', // Exactamente 5 caracteres
      esParEvaluador: true
    };

    const result = await service.crearProfesor(createProfesorDto);

    expect(result).toBeDefined();
    expect(result.nombre).toBe(createProfesorDto.nombre);
    expect(result.extension).toBe(createProfesorDto.extension);
  });

  it('should not create a professor with invalid extension length', async () => {
    const createProfesorDto: CreateProfesorDto = {
      nombre: 'Dr. Juan Carlos',
      cedula: 12345678,
      departamento: 'Ingeniería',
      extension: '123', // Solo 3 caracteres (inválido)
      esParEvaluador: true
    };

    await expect(service.crearProfesor(createProfesorDto))
      .rejects
      .toThrow(BadRequestException);
  });

  // Pruebas para asignarEvaluador
  it('should assign evaluator successfully', async () => {
    // 1. Crear evaluador
    const evaluador = profesorRepository.create({
      nombre: 'Dra. Ana López',
      cedula: 555666777,
      departamento: 'Matemáticas',
      extension: '54321',
      esParEvaluador: true
    });
    const savedEvaluador = await profesorRepository.save(evaluador);

    // 2. Crear estudiante y proyecto (simplificado para la prueba)
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    const proyecto = proyectoRepository.create({
      titulo: 'Proyecto Test',
      area: 'Test',
      presupuesto: 10000.00,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedEvaluador // Usar el mismo profesor como mentor temporalmente para simplificar
    });
    const savedProyecto = await proyectoRepository.save(proyecto);

    // 3. Asignar evaluador
    const result = await service.asignarEvaluador(
      savedProyecto.id,
      savedEvaluador.id,
      4.5
    );

    // 4. Verificar resultado
    expect(result).toBeDefined();
    expect(result.calificacion).toBe(4.5);
    expect(result.evaluador.id).toBe(savedEvaluador.id);
  });

  it('should not assign evaluator when professor already has 3 evaluations', async () => {
    // 1. Crear evaluador
    const evaluador = profesorRepository.create({
      nombre: 'Dra. Ana López',
      cedula: 555666777,
      departamento: 'Matemáticas',
      extension: '54321',
      esParEvaluador: true
    });
    const savedEvaluador = await profesorRepository.save(evaluador);

    // 2. Crear estudiante base
    const estudiante = estudianteRepository.create({
      cedula: 123456789,
      nombre: 'Juan Pérez',
      semestre: 6,
      promedio: 4.0
    });
    const savedEstudiante = await estudianteRepository.save(estudiante);

    // 3. Crear 3 evaluaciones para el evaluador
    for (let i = 0; i < 3; i++) {
      const proyecto = proyectoRepository.create({
        titulo: `Proyecto ${i + 1}`,
        area: 'Test',
        presupuesto: 10000.00,
        estado: 1,
        notaFinal: 0,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        lider: savedEstudiante,
        mentor: savedEvaluador
      });
      const savedProyecto = await proyectoRepository.save(proyecto);

      const evaluacion = evaluacionRepository.create({
        calificacion: 4.0,
        proyecto: savedProyecto,
        evaluador: savedEvaluador
      });
      await evaluacionRepository.save(evaluacion);
    }

    // 4. Crear un cuarto proyecto
    const nuevoProyecto = proyectoRepository.create({
      titulo: 'Proyecto 4',
      area: 'Test',
      presupuesto: 10000.00,
      estado: 1,
      notaFinal: 0,
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      lider: savedEstudiante,
      mentor: savedEvaluador
    });
    const savedNuevoProyecto = await proyectoRepository.save(nuevoProyecto);

    // 5. Intentar asignar la cuarta evaluación (debe fallar)
    await expect(service.asignarEvaluador(
      savedNuevoProyecto.id,
      savedEvaluador.id,
      4.5
    )).rejects.toThrow(BadRequestException);
  });

  // Cleanup
  afterEach(async () => {
    await evaluacionRepository.clear();
    await proyectoRepository.clear();
    await estudianteRepository.clear();
    await profesorRepository.clear();
  });
});
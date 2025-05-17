/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body} from '@nestjs/common';
import { EvalucacionService } from './evalucacion.service';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';
import { UpdateProfesorDto } from 'src/profesor/dto/update-profesor.dto';

@Controller('evaluaciones')
export class EvalucacionController {
  constructor(private readonly evalucacionService: EvalucacionService) {}

  @Post()
  async crearEvaluacion(
    @Body() body: { evaluacion: CreateEvalucacionDto; profesor: UpdateProfesorDto },
  ) {
    const { evaluacion, profesor } = body;
    return this.evalucacionService.crearEvaluacion(evaluacion, profesor);
  }
}



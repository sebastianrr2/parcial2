/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body} from '@nestjs/common';
import { EvalucacionService } from './evalucacion.service';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';

@Controller('evaluaciones')
export class EvalucacionController {
  constructor(private readonly evalucacionService: EvalucacionService) {}

@Post()
async crearEvaluacion(@Body() createEvalucacionDto: CreateEvalucacionDto) {
  return await this.evalucacionService.crearEvaluacion(createEvalucacionDto);
}
}



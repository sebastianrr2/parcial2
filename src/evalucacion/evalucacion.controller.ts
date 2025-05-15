import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvalucacionService } from './evalucacion.service';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';
import { UpdateEvalucacionDto } from './dto/update-evalucacion.dto';

@Controller('evalucacion')
export class EvalucacionController {
  constructor(private readonly evalucacionService: EvalucacionService) {}

  @Post()
  create(@Body() createEvalucacionDto: CreateEvalucacionDto) {
    return this.evalucacionService.create(createEvalucacionDto);
  }

  @Get()
  findAll() {
    return this.evalucacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evalucacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvalucacionDto: UpdateEvalucacionDto) {
    return this.evalucacionService.update(+id, updateEvalucacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evalucacionService.remove(+id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateEvalucacionDto } from './dto/create-evalucacion.dto';
import { UpdateEvalucacionDto } from './dto/update-evalucacion.dto';

@Injectable()
export class EvalucacionService {
  create(createEvalucacionDto: CreateEvalucacionDto) {
    return 'This action adds a new evalucacion';
  }

  findAll() {
    return `This action returns all evalucacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evalucacion`;
  }

  update(id: number, updateEvalucacionDto: UpdateEvalucacionDto) {
    return `This action updates a #${id} evalucacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} evalucacion`;
  }
}

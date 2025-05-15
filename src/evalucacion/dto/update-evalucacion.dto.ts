import { PartialType } from '@nestjs/mapped-types';
import { CreateEvalucacionDto } from './create-evalucacion.dto';

export class UpdateEvalucacionDto extends PartialType(CreateEvalucacionDto) {}

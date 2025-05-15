import { Module } from '@nestjs/common';
import { EvalucacionService } from './evalucacion.service';
import { EvalucacionController } from './evalucacion.controller';

@Module({
  controllers: [EvalucacionController],
  providers: [EvalucacionService],
})
export class EvalucacionModule {}

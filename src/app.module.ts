/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { ProfesorModule } from './profesor/profesor.module';
import { EvalucacionModule } from './evalucacion/evalucacion.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
 imports: [EstudianteModule, ProyectoModule, ProfesorModule, EvalucacionModule,
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'sebas',
     database: 'parcial2',
     entities: [EstudianteModule, ProyectoModule, ProfesorModule, EvalucacionModule],
     dropSchema: true,
     synchronize: true,
   }),
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}

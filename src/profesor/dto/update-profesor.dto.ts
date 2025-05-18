/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesor.dto';
import { Evalucacion } from "src/evalucacion/entities/evalucacion.entity";

export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {
    
    id: number;
    nombre: string;
    cedula: number;
    departamento: string;
    extension: string;
    esParEvaluador: boolean;
    evalucaciones: Evalucacion[];
}

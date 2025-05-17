/* eslint-disable prettier/prettier */
import { Evalucacion } from "src/evalucacion/entities/evalucacion.entity";

export class CreateProfesorDto {
    nombre: string;
    cedula: number;
    departamento: string;
    extencion: string;
    esParEvaluador: boolean;
    evalucaciones: Evalucacion[]; // Cambia el tipo según la entidad Evalucacion
}

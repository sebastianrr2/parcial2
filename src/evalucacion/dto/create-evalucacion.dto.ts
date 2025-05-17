/* eslint-disable prettier/prettier */
import { Profesor } from "src/profesor/entities/profesor.entity";
import { Proyecto } from "src/proyecto/entities/proyecto.entity";

export class CreateEvalucacionDto {
    
    calificacion: GLfloat;
    proyecto : Proyecto
    evaluador: Profesor// Cambia el tipo según la entidad Proyecto
}

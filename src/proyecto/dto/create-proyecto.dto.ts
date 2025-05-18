/* eslint-disable prettier/prettier */
export class CreateProyectoDto {
  titulo: string;
  area: string;
  presupuesto: number;
  fechaInicio: string;
  fechaFin: string;
  idLider: number;
  idMentor: number; // Ahora es obligatorio
}


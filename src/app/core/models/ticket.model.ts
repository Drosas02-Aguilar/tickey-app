export interface Ticket{

    id: number;
    titulo: string;
    descripcion: string;
    prioridad: 'ALTA' | 'MEDIA'| 'BAJA';
    estadoticket:'ABIERTO'| 'PROGRESO'| 'CERRADO';
    fechacreacion?: string;
    creador?: string;
    asignado?: string;
}   
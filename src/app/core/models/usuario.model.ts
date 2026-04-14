export interface Usuario {
  id: number;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno: string;
  correo: string;
  username: string;
  activo: boolean;
  fechacreacion?: string;
  roles?: Set<String>;
}

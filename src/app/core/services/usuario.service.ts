import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceResult } from '../models/service-result.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ServiceResult<Usuario>> {
    return this.http.get<ServiceResult<Usuario>>(this.url);
  }

  obtenerPorId(id: number): Observable<ServiceResult<Usuario>> {
    return this.http.get<ServiceResult<Usuario>>(`${this.url}/${id}`);
  }

  crear(usuario: any): Observable<ServiceResult<Usuario>> {
    return this.http.post<ServiceResult<Usuario>>(this.url, usuario);
  }

  actualizar(id: number, usuario: Partial<Usuario>): Observable<ServiceResult<Usuario>> {
    return this.http.put<ServiceResult<Usuario>>(`${this.url}/${id}`, usuario);
  }

  desactivar(id: number): Observable<ServiceResult<Usuario>> {
    return this.http.patch<ServiceResult<Usuario>>(`${this.url}/desactivar/${id}`, {});
  }

  activar(id: number): Observable<ServiceResult<Usuario>> {
    return this.http.patch<ServiceResult<Usuario>>(`${this.url}/activar/${id}`, {});
  }
}

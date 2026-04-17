import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificacionService {

  private url = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) {}

  obtenerPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/usuario/${usuarioId}`);
  }

  contarPendientes(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/pendientes/${usuarioId}`);
  }

  marcarComoLeida(id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/leer/${id}`, {});
  }

  marcarTodas(usuarioId: number): Observable<any> {
    return this.http.put<any>(`${this.url}/leer-todas/${usuarioId}`, {});
  }
}
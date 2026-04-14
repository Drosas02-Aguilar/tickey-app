import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';
import { ServiceResult } from '../models/service-result.model';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private url = `${environment.apiUrl}/comentarios`;

  constructor(private http: HttpClient) {}

  listarPorTicket(ticketId: number): Observable<ServiceResult<Comentario>> {
    return this.http.get<ServiceResult<Comentario>>(`${this.url}/ticket/${ticketId}`, {});
  }

  agregar(ticketsid: number, mensaje: string): Observable<ServiceResult<Comentario>> {
    return this.http.post<ServiceResult<Comentario>>(`${this.url}/ticket/${ticketsid}`, {
      mensaje,
    });
  }
}

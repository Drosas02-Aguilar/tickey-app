import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket } from '../models/ticket.model';
import { ServiceResult } from '../models/service-result.model';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private url = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ServiceResult<Ticket>> {
    return this.http.get<ServiceResult<Ticket>>(this.url);
  }

  obtenerPorId(id: number): Observable<ServiceResult<Ticket>> {
    return this.http.get<ServiceResult<Ticket>>(`${this.url}/${id}`);
  }

  crear(ticket: Partial<Ticket>): Observable<ServiceResult<Ticket>> {
    return this.http.post<ServiceResult<Ticket>>(this.url, ticket);
  }

  asignar(ticketId: number, agenteId: number): Observable<ServiceResult<Ticket>> {
    return this.http.put<ServiceResult<Ticket>>(`${this.url}/${ticketId}/asignar/${agenteId}`, {});
  }

  cambiarEstado(ticketId: number, estado: string): Observable<ServiceResult<Ticket>> {
    return this.http.patch<ServiceResult<Ticket>>(
      `${this.url}/${ticketId}/estado?estado=${estado}`,
      {},
    );
  }
}

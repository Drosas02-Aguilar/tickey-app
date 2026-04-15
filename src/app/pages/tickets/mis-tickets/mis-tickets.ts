import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-mis-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-tickets.html',
  styleUrl: './mis-tickets.css'
})
export class MisTickets implements OnInit {

  tickets: Ticket[] = [];
  cargando: boolean = false;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisTickets();
  }

  cargarMisTickets(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.tickets = [];

    this.ticketService.misTickets().subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.tickets = res.Objects;
        } else {
          this.errorMessage = res.ErrorMessage || 'No tienes tickets creados';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.cargando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getBadgePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'ALTA': return 'badge bg-danger';
      case 'MEDIA': return 'badge bg-warning text-dark';
      case 'BAJA': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getBadgeEstado(estado: string): string {
    switch (estado) {
      case 'ABIERTO': return 'badge bg-primary';
      case 'PROCESO': return 'badge bg-warning text-dark';
      case 'RESUELTO': return 'badge bg-success';
      case 'CERRADO': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }
}
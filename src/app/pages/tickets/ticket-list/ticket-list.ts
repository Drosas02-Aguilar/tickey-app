import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList implements OnInit {

  tickets: Ticket[] = [];
  cargando: boolean = false;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.cargando = true;
    this.errorMessage = '';
    this.tickets = [];

    this.ticketService.listar().subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.tickets = res.Objects;
        } else {
          this.errorMessage = res.ErrorMessage || 'Error al cargar tickets';
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

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  esAdminOAgente(): boolean {
    return this.authService.tieneRol('ADMIN') ||
           this.authService.tieneRol('AGENTE');
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
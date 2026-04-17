import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-tickets-asignados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tickets-asignados.html',
  styleUrl: './tickets-asignados.css'
})
export class TicketsAsignados implements OnInit {

  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];
  filtroActivo: string = 'TODOS';
  cargando: boolean = false;
  error: string = '';

  constructor(private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarTickets();
  }

  cargarTickets() {
    this.cargando = true;
    this.error = '';
    this.ticketService.asignadoAmi().subscribe({
      next: (res) => {
        if (res.correct) {
          this.tickets = res.Objects ?? [];
          this.ticketsFiltrados = [...this.tickets];
        } else {
          this.error = res.ErrorMessage ?? 'No tienes tickets asignados';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar los tickets';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(filtro: string) {
    this.filtroActivo = filtro;
    if (filtro === 'TODOS') {
      this.ticketsFiltrados = [...this.tickets];
    } else if (filtro === 'ALTA') {
      this.ticketsFiltrados = this.tickets.filter(t => t.prioridad === 'ALTA');
    } else {
      this.ticketsFiltrados = this.tickets.filter(t => t.estadoticket === filtro);
    }
  }

  contarPorPrioridad(prioridad: string): number {
    return this.tickets.filter(t => t.prioridad === prioridad).length;
  }

  contarPorEstado(estado: string): number {
    return this.tickets.filter(t => t.estadoticket === estado).length;
  }
}
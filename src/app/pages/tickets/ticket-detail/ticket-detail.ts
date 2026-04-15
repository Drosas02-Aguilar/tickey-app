import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Ticket } from '../../../core/models/ticket.model';
import { Comentario } from '../../../core/models/comentario.model';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { ComentarioService } from '../../../core/services/comentario.service';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  ticket: Ticket | null = null;
  comentarios: Comentario[] = [];
  usuarios: Usuario[] = [];

  nuevoComentario: string = '';
  agenteSeleccionado: number | null = null;
  estadoSeleccionado: string = '';

  cargando: boolean = false;
  cargandoComentarios: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  estados: string[] = ['ABIERTO', 'PROCESO', 'RESUELTO', 'CERRADO'];

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private comentarioService: ComentarioService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.cargarTicket(Number(id));
      this.cargarComentarios(Number(id));
    }
    if (this.esAdminOAgente()) {
      this.cargarUsuarios();
    }
  }

  cargarTicket(id: number): void {
    this.cargando = true;
    this.ticketService.obtenerPorId(id).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.ticket = res.object;
          this.estadoSeleccionado = res.object.estadoticket;
        } else {
          this.errorMessage = res.ErrorMessage || 'Error al cargar el ticket';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar el ticket';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarComentarios(ticketId: number): void {
    this.cargandoComentarios = true;
    this.comentarioService.listarPorTicket(ticketId).subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.comentarios = res.Objects;
        }
        this.cargandoComentarios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoComentarios = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.usuarios = res.Objects;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  agregarComentario(): void {
    if (!this.nuevoComentario.trim() || !this.ticket) return;

    this.comentarioService.agregar(this.ticket.id, this.nuevoComentario).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.nuevoComentario = '';
          this.successMessage = 'Comentario agregado correctamente';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.cargarComentarios(this.ticket!.id);
        }else{
          this.errorMessage = res.ErrorMessage || 'Error al agregar comentario';

        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al agregar comentario';
        this.cdr.detectChanges();
      },
    });
  }

  cambiarEstado(): void {
    if (!this.estadoSeleccionado || !this.ticket) return;

    this.ticketService.cambiarEstado(this.ticket.id, this.estadoSeleccionado).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.ticket = res.object;
          this.successMessage = 'Estado actualizado correctamente';
          setTimeout(() => (this.successMessage = ''), 3000);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar estado';
        this.cdr.detectChanges();
      },
    });
  }

  asignarTicket(): void {
    if (!this.agenteSeleccionado || !this.ticket) return;

    this.ticketService.asignar(this.ticket.id, this.agenteSeleccionado).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          this.ticket = res.object;
          this.successMessage = 'Ticket asignado correctamente';
          setTimeout(() => (this.successMessage = ''), 3000);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al asignar ticket';
        this.cdr.detectChanges();
      },
    });
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

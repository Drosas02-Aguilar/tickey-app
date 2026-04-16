import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TicketService } from "../../../core/services/ticket.service";
import { AuthService } from "../../../core/services/auth.service";
import { Router, RouterLink } from "@angular/router";

export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],

  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm implements OnInit {

  titulo: string = '';
  descripcion: string = '';
  prioridad: Prioridad | undefined = undefined;

  prioridades: Prioridad[] = ['ALTA', 'MEDIA', 'BAJA'];

  cargando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  crearTicket(): void {
    if (!this.titulo.trim() || !this.descripcion.trim() || !this.prioridad) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.cargando = true;
    this.errorMessage = '';

    const ticket = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      prioridad: this.prioridad
    };

    this.ticketService.crear(ticket).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.correct && res.object) {
          this.successMessage = 'Ticket creado correctamente';
          this.cdr.detectChanges();
          setTimeout(() => {
            if (this.authService.tieneRol('ADMIN') || this.authService.tieneRol('AGENTE')) {
              this.router.navigate(['/tickets']);
            } else {
              this.router.navigate(['/mis-tickets']);
            }
          }, 1500);
        } else {
          this.errorMessage = res.ErrorMessage || 'Error al crear el ticket';
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.cargando = false;
        this.errorMessage = 'Error al conectar con el servidor';
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(): void {
    this.titulo = '';
    this.descripcion = '';
    this.prioridad = undefined;
    this.errorMessage = '';
    this.successMessage = '';
  }
}

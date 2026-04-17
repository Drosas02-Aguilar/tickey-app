import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { filter } from 'rxjs/operators';
import { interval } from 'rxjs';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  notificaciones: any[] = [];
  notificacionesPendientes = 0;
  tituloActual = '';
  usuarioId: number | null = null;

  notificacionesAbierto = false;
  usuarioAbierto = false;

  constructor(
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private usuarioService: UsuarioService,
    private router: Router,
    private websocketService: WebsocketService,
  ) {}

  ngOnInit(): void {
    this.resolverUsuarioId();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.tituloActual = this.obtenerTituloPagina();
    });
  }

  resolverUsuarioId(): void {
    const idGuardado = this.authService.obtenerUsuarioId();

    if (idGuardado) {
      this.usuarioId = idGuardado;
      this.iniciarConexionWS();
      this.cargarNotificaciones();
      return;
    }

    const username = this.authService.obtenerUsername();
    if (!username) return;

    this.usuarioService.listar().subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          const usuario = res.Objects.find((u: any) => u.username === username);

          if (usuario) {
            this.usuarioId = usuario.id;
            this.authService.guardarUsuarioId(usuario.id);

            this.iniciarConexionWS();
            this.cargarNotificaciones();
          }
        }
      },
    });
  }

  cargarNotificaciones(): void {
    if (!this.usuarioId) return;

    this.notificacionService.obtenerPorUsuario(this.usuarioId).subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.notificaciones = res.Objects;

          this.notificacionesPendientes = this.notificaciones.filter((n) => n.leida === 0).length;
        } else {
          this.notificaciones = [];
          this.notificacionesPendientes = 0;
        }
      },
      error: () => {
        this.notificaciones = [];
        this.notificacionesPendientes = 0;
      },
    });
  }

  leerNotificacion(n: any): void {
    const id = n.notificacionid;

    if (!id) return;

    this.notificacionService.marcarComoLeida(id).subscribe({
      next: () => {
        this.cargarNotificaciones();

        if (n.referenciaid) {
          this.router.navigate(['/tickets', n.referenciaid]);
        }
      },
    });
  }

  leerTodas(): void {
    if (!this.usuarioId) return;

    this.notificacionService.marcarTodas(this.usuarioId).subscribe({
      next: () => this.cargarNotificaciones(),
    });
  }

  get username(): string | null {
    return this.authService.obtenerUsername();
  }

  get roles(): string[] {
    return this.authService.ObtenerRoles();
  }

  rolesFormateados(): string[] {
    const rolesMap: Record<string, string> = {
      ADMIN: 'Admin',
      AGENTE: 'Agente',
      USER: 'Usuario',
    };

    return this.roles.map((rol) => rolesMap[rol] || rol);
  }

  iniciarConexionWS(): void {
    if (!this.usuarioId) return;

    this.websocketService.connect(this.usuarioId);

    this.websocketService.notifications$.subscribe((n) => {
      this.notificaciones.unshift(n);

      if (n.leida === 0) {
        this.notificacionesPendientes++;
      }

      // 🔔 mostrar alerta
      this.mostrarToast(n.mensaje);
    });
  }

  mostrarToast(mensaje: string) {
    alert('🔔 ' + mensaje);
  }

  obtenerTituloPagina(): string {
    const url = this.router.url;

    if (url.includes('/tickets/nuevo')) return 'Nuevo Ticket';
    if (url.includes('/tickets/') && !url.includes('/nuevo')) return 'Detalle de Ticket';
    if (url.includes('/mis-tickets')) return 'Mis Tickets';
    if (url.includes('/tickets')) return 'Tickets';
    if (url.includes('/usuarios/nuevo')) return 'Nuevo Usuario';
    if (url.includes('/usuarios/') && url.includes('/editar')) return 'Editar Usuario';
    if (url.includes('/usuarios')) return 'Usuarios';

    return 'Dashboard';
  }

  toggleNotificaciones(): void {
    this.notificacionesAbierto = !this.notificacionesAbierto;
    if (this.notificacionesAbierto) {
      this.usuarioAbierto = false;
    }
  }

  toggleUsuario(): void {
    this.usuarioAbierto = !this.usuarioAbierto;
    if (this.usuarioAbierto) {
      this.notificacionesAbierto = false;
    }
  }

  CerrarSesion(): void {
    this.websocketService.disconnect();
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  notificacionesPendientes = 0;
  tituloActual = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Actualizar título cuando cambie la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.tituloActual = this.obtenerTituloPagina();
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
      'ADMIN': 'Admin',
      'AGENTE': 'Agente',
      'USER': 'Usuario'
    };
    return this.roles.map(rol => rolesMap[rol] || rol);
  }

  obtenerTituloPagina(): string {
    const url = this.router.url;
    
    if (url.includes('/tickets/nuevo')) return 'Nuevo Ticket';
    if (url.includes('/tickets/') && !url.includes('/nuevo')) return 'Detalle de Ticket';
    if (url.includes('/tickets')) return 'Tickets';
    if (url.includes('/usuarios/nuevo')) return 'Nuevo Usuario';
    if (url.includes('/usuarios/') && url.includes('/editar')) return 'Editar Usuario';
    if (url.includes('/usuarios')) return 'Usuarios';
    if (url.includes('/perfil')) return 'Mi Perfil';
    if (url.includes('/configuracion')) return 'Configuración';
    
    return 'Dashboard';
  }

  CerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
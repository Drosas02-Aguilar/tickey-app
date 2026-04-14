import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sin-acceso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sin-acceso.html',
  styleUrls: ['./sin-acceso.css']
})
export class SinAcceso implements OnInit {
  usuarioActual: any = null;
  rolesUsuario: string[] = [];
  mensajePersonalizado: string = '';
  mostrarBotonLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cargarInformacionUsuario();
    this.determinarMensaje();
  }

  cargarInformacionUsuario(): void {
    const username = this.authService.obtenerUsername();
    const roles = this.authService.ObtenerRoles();
    
    if (username) {
      this.usuarioActual = { username };
      this.rolesUsuario = roles;
      this.mostrarBotonLogin = false;
    } else {
      this.mostrarBotonLogin = true;
    }
  }

  determinarMensaje(): void {
    // Puedes personalizar el mensaje según la ruta intentada
    const urlActual = this.router.url;
    
    if (urlActual.includes('/admin')) {
      this.mensajePersonalizado = 'El área de administración requiere permisos especiales.';
    } else if (urlActual.includes('/usuarios')) {
      this.mensajePersonalizado = 'Solo los administradores pueden gestionar usuarios.';
    } else if (urlActual.includes('/tickets') && this.rolesUsuario.length === 0) {
      this.mensajePersonalizado = 'Necesitas iniciar sesión para ver los tickets.';
    }
  }

  getIniciales(nombre: string): string {
    if (!nombre) return '?';
    return nombre.substring(0, 2).toUpperCase();
  }

  formatearRol(rol: string): string {
    const rolesFormateados: Record<string, string> = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_AGENTE': 'Agente',
      'ROLE_USER': 'Usuario'
    };
    return rolesFormateados[rol] || rol;
  }

  volverAtras(): void {
    this.location.back();
  }

  irAlLogin(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
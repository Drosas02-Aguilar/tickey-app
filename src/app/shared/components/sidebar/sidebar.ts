import { CommonModule } from '@angular/common';
import { Component, NgZone, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    private authService: AuthService,
    public router: Router,  // Hacerlo público para usarlo en el template
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {}

  get username(): string | null {
    return this.authService.obtenerUsername();
  }

  get rolFormateado(): string {
    const roles = this.authService.ObtenerRoles();
    if (roles.includes('ADMIN')) return 'Administrador';
    if (roles.includes('AGENTE')) return 'Agente';
    return 'Usuario';
  }

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  esAdminOAgente(): boolean {
    return this.authService.tieneRol('ADMIN') || this.authService.tieneRol('AGENTE');
  }

  navegarA(ruta: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Si ya estamos en esa ruta exacta, forzar recarga
    if (this.router.url === ruta) {
      this.recargarRutaActual();
      return;
    }

    // Navegar dentro de NgZone para asegurar que Angular detecte los cambios
    this.ngZone.run(() => {
      this.router.navigate([ruta]).then((success) => {
        if (success) {
          // Forzar actualización de la vista
          setTimeout(() => {
            this.appRef.tick();
          }, 10);
        }
      });
    });
  }

  private recargarRutaActual(): void {
    this.ngZone.run(() => {
      const currentUrl = this.router.url;
      
      // Truco: navegar a una ruta temporal y luego volver
      this.router.navigateByUrl('/dummy', { skipLocationChange: true })
        .then(() => {
          return this.router.navigateByUrl(currentUrl);
        })
        .then(() => {
          setTimeout(() => {
            this.appRef.tick();
          }, 10);
        });
    });
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get username(): string | null {
    return this.authService.obtenerUsername();
  }

  get roles(): string[] {
    return this.authService.ObtenerRoles();
  }

  CerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);

  }
}

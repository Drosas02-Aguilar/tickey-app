import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
 templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
constructor(private authService: AuthService) {}

  esAdmin(): boolean {
    return this.authService.tieneRol('ROLE_ADMIN');
  }

  esAdminOAgente(): boolean {
    return this.authService.tieneRol('ROLE_ADMIN') || 
           this.authService.tieneRol('ROLE_AGENTE');
  }



}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
})
export class UsuarioList implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.usuarioService.listar().subscribe({
      next: (res) => {
        if (res.correct && res.Objects) {
          this.usuarios = res.Objects;
        } else {
          this.errorMessage = res.ErrorMessage || 'Error al cargar usuarios';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  activar(id: number): void {
    this.usuarioService.activar(id).subscribe({
      next: (res) => {
        if (res.correct) {
          this.successMessage = 'Usuario activado correctamente';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.cargarUsuarios();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.cdr.detectChanges();
      },
    });
  }

  desactivar(id: number): void {
    this.usuarioService.desactivar(id).subscribe({
      next: (res) => {
        if (res.correct) {
          this.successMessage = 'Usuario desactivado correctamente';
          setTimeout(() => (this.successMessage = ''), 3000);
          this.cargarUsuarios();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.cdr.detectChanges();
      },
    });
  }

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  esAdminOAgente(): boolean {
    return this.authService.tieneRol('ADMIN') || this.authService.tieneRol('AGW');
  }
}

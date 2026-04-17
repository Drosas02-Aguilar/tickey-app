import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  login(): void {
    this.errorMessage = '';
    this.cargando = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.cargando = false;

        if (res.correct && res.object) {
          this.authService.guardarToken(res.object.token);
          this.authService.guardarRoles(res.object.roles);
          this.authService.guardarUsername(res.object.username);

          this.usuarioService.listar().subscribe({
              next: (resUsuarios) => {
                if (resUsuarios.correct && resUsuarios.Objects) {
                  const usuario = resUsuarios.Objects.find(
                    u => u.username === res.object!.username
                  );
                  if (usuario) {
                    this.authService.guardarUsuarioId(usuario.id);
                  }
                }
              },
              error: () => {}
            });



          const roles = res.object.roles;

          if (roles.includes('ADMIN') || roles.includes('AGENTE')) {
            this.router.navigate(['/tickets']);
          } else {
            this.router.navigate(['/mis-tickets']);
          }
        } else {
          this.errorMessage = res.ErrorMessage || 'Credenciales incorrectas';
        }
      },
      error: (err) => {
        this.cargando = false;
        this.errorMessage = 'Error al conectar con el servidor';
      },
    });
  }
}

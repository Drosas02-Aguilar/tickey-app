import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.cargando = true;

    this.authService.login({username: this.username, password: this.password})
      .subscribe({
        next: (res) => {
          this.cargando = false;

          if(res.correct && res.object){
            this.authService.guardarToken(res.object.token);
            this.authService.guardarRoles(res.object.roles);
            this.authService.guardarUsername(res.object.username);
            this.router.navigate(['/tickets']);
          }else{
            this.errorMessage = res.errorMessage || 'Credenciales incorrectas'; 

          }

        },
        error: (err) => {
          this.cargando = false;
          this.errorMessage = 'Error al conectar con el servidor';
        }
      });
    }
  }
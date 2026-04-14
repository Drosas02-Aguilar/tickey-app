import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { ServiceResult } from '../models/service-result.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}


  getUsuarioActual(): any {
  const username = this.obtenerUsername();
  const roles = this.ObtenerRoles();
  const token = this.obtenerToken();
  
  if (!username || !token) return null;
  
  return {
    username,
    roles,
    token
  };
}

  login(request: LoginRequest): Observable<ServiceResult<LoginResponse>> {
  return this.http.post<ServiceResult<LoginResponse>>(`${this.url}/login`, request)
    .pipe(
      tap(response => {
        if (response.correct && response.object) {
          console.log('Login exitoso:', response.object);
          this.guardarToken(response.object.token);
          this.guardarRoles(response.object.roles);
          this.guardarUsername(response.object.username);
        }
      })
    );
}

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  guardarRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  ObtenerRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  guardarUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  obtenerUsername(): string | null {
    return localStorage.getItem('username');
  }

  cerrarSesion(): void {
    localStorage.clear();
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  tieneRol(rol: string): boolean {
    return this.ObtenerRoles().includes(rol);
  }



}

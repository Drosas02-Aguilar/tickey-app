import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Observable } from 'rxjs';
import { ServiceResult } from '../models/service-result.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<ServiceResult<LoginResponse>> {
    return this.http.post<ServiceResult<LoginResponse>>(`${this.url}/login`, request);
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { filter } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

interface Toast {
  id: number;
  type: 'success' | 'danger' | 'warning' | 'info';
  icon: string;
  title: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit, OnDestroy {
  sidebarAbierto = false;
  cargando = false;
  tiempoSesion = '';
  toasts: Toast[] = [];
  private toastCounter = 0;
  private sessionTimerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configurarLoaderGlobal();
    this.iniciarTemporizadorSesion();
    this.escucharEventosSidebar();
  }

  ngOnDestroy(): void {
    if (this.sessionTimerSubscription) {
      this.sessionTimerSubscription.unsubscribe();
    }
  }

  private configurarLoaderGlobal(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cargando = true;
      }
      if (event instanceof NavigationEnd || 
          event instanceof NavigationCancel || 
          event instanceof NavigationError) {
        setTimeout(() => {
          this.cargando = false;
        }, 300);
      }
    });
  }

  private iniciarTemporizadorSesion(): void {
    this.sessionTimerSubscription = interval(1000).subscribe(() => {
      this.actualizarTiempoSesion();
    });
  }

  private actualizarTiempoSesion(): void {
    const token = this.authService.obtenerToken();
    if (!token) {
      this.tiempoSesion = 'No autenticado';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiracion = payload.exp * 1000;
      const ahora = Date.now();
      const tiempoRestante = expiracion - ahora;

      if (tiempoRestante <= 0) {
        this.tiempoSesion = 'Expirada';
        this.mostrarToast({
          type: 'warning',
          icon: 'clock-history',
          title: 'Sesión expirada',
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        });
        setTimeout(() => this.confirmarLogout(), 3000);
      } else {
        const horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
        const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        this.tiempoSesion = `${horas}h ${minutos}m`;
      }
    } catch (error) {
      this.tiempoSesion = '--:--';
    }
  }

  private escucharEventosSidebar(): void {
    // Escuchar cambios de tamaño de pantalla
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        this.sidebarAbierto = false;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
    
    // Bloquear scroll del body cuando el sidebar está abierto en móvil
    if (window.innerWidth <= 992) {
      document.body.style.overflow = this.sidebarAbierto ? 'hidden' : '';
    }
  }

  confirmarLogout(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
    this.mostrarToast({
      type: 'info',
      icon: 'info-circle',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión exitosamente.'
    });
  }

  mostrarToast(toast: Omit<Toast, 'id' | 'time'>): void {
    const id = ++this.toastCounter;
    const nuevoToast: Toast = {
      ...toast,
      id,
      time: new Date().toLocaleTimeString()
    };

    this.toasts.push(nuevoToast);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.cerrarToast(id);
    }, 5000);
  }

  cerrarToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  // Método para obtener el año actual
  get anioActual(): number {
    return new Date().getFullYear();
  }
}
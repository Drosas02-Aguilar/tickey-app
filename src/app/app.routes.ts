import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Login } from './pages/login/login';
import { SinAcceso } from './pages/sin-acceso/sin-acceso';
import { UsuarioForm } from './pages/usuarios/usuario-form/usuario-form';
import { UsuarioList } from './pages/usuarios/usuario-list/usuario-list';
import { TicketDetail } from './pages/tickets/ticket-detail/ticket-detail';
import { TicketForm } from './pages/tickets/ticket-form/ticket-form';
import { TicketList } from './pages/tickets/ticket-list/ticket-list';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'tickets',
        component: TicketList,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE'] }
      },
      {
        path: 'tickets/nuevo',
        component: TicketForm,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE', 'ROLE_USER'] }
      },
      {
        path: 'tickets/:id',
        component: TicketDetail,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE', 'ROLE_USER'] }
      },
      {
        path: 'usuarios',
        component: UsuarioList,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_AGENTE'] }
      },
      {
        path: 'usuarios/nuevo',
        component: UsuarioForm,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'usuarios/:id/editar',
        component: UsuarioForm,
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'sin-acceso',
    component: SinAcceso
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
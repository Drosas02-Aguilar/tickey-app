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
import { MisTickets } from './pages/tickets/mis-tickets/mis-tickets';
import { TicketsAsignados } from './pages/tickets/tickets-asignados/tickets-asignados';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
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
        data: { roles: ['ADMIN', 'AGENTE'] },
      },
      {
        path: 'tickets/nuevo',
        component: TicketForm,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'AGENTE', 'USER'] },
      },
      {
        path: 'tickets/:id',
        component: TicketDetail,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'AGENTE', 'USER'] },
      },
      {
        path: 'mis-tickets',
        component: MisTickets,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'AGENTE', 'USER'] },
      },
      {
        path: 'usuarios',
        component: UsuarioList,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'AGENTE'] },
      },
      {
        path: 'usuarios/nuevo',
        component: UsuarioForm,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'usuarios/:id/editar',
        component: UsuarioForm,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'tickets-asignados',
        component: TicketsAsignados,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'AGENTE', 'USER'] },
      },
    ],
  },
  {
    path: 'sin-acceso',
    component: SinAcceso,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

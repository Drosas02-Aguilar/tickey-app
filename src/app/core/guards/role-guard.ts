import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos: string[] = route.data['roles'] ?? [];
  
  if (rolesPermitidos.length === 0) {
    return true;
  }

  const rolesUsuario = authService.ObtenerRoles();
  
  console.log('Roles permitidos:', rolesPermitidos);
  console.log('Roles del usuario:', rolesUsuario);
  console.log('URL intentada:', state.url);

  const tieneAcceso = rolesPermitidos.some((rol) => rolesUsuario.includes(rol));

  if (tieneAcceso) {
    return true;
  }

  router.navigate(['/sin-acceso']);
  return false;
};
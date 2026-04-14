import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos: string[] = route.data['roles'] ?? [];
  const rolesUsuario = authService.ObtenerRoles();

  const tieneAcceso = rolesPermitidos.some((rol) => rolesUsuario.includes(rol));


if(tieneAcceso){
  return true;

}

router.navigate(['/sin-acceso']);

  return false;
};

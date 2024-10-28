import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuardGuard: CanActivateFn = async (route) => {
  const authService= inject(AuthService);
  const router= inject(Router);

  const user=  await authService.getCurrentUser();

  if(!user){
    router.navigate(['/home'])
    return false;
  }

  const userRole= await authService.getUserRole(user.uid);
  const routerPath= route.routeConfig?.path;

  /* Si el usuario entra a clientes y no es admin, lo redirige a Home*/
  if(routerPath === 'clientes' && await userRole !== 'admin'){
    router.navigate(['/home']);
    console.log('Acceso denegado');
    return false;
  }

  /* El admin no es usuario, no requiere solicitar turno. Es redirigido a Home */
  if(routerPath === 'solicitar-turno' && await userRole !== 'user'){
    router.navigate(['/home']);
    return false;
  }

  return true;
};

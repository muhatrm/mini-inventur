import { CanActivateFn, Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import {inject} from '@angular/core';
import { session } from '../utils/session'
export const authGuard: CanActivateFn =
  (route,
   state: RouterStateSnapshot,
  ) => {
  const router:Router = inject(Router);
  const protectedRoutes: string[] = ['/home'];
  return protectedRoutes.includes(state.url) && !session
    ? router.navigate(['/login'])
    : router.navigate(['/']);
};

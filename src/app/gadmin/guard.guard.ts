import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  if(sessionStorage.getItem('level')==="admin"){
    return true;

  }else{
    const router = inject(Router);
    router.navigate(['main']);
    return false;
  }

};

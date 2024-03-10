import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChildFn, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { StaticDataService } from '../services/static.service';


export const canActivateAuth: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userService = inject(UserService);
    const spinnerService = inject(SpinnerService);
    const router = inject(Router);
    const StaticData = inject(StaticDataService);
    spinnerService.globalSpinnerSubject.next(true)
    return userService.isAuthenticated().pipe(
        map((response: any) => {
            debugger;
            spinnerService.globalSpinnerSubject.next(false)
            if (response.user) {
                userService.user = response.user
                StaticData.setStaticData(response)
                return true;
            } else {
                router.navigateByUrl('/login');
                return false;
            }
        }));
};

export const canActivateChildAuth: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const userService = inject(UserService);
    const spinnerService = inject(SpinnerService);
    const router = inject(Router);
    const StaticData = inject(StaticDataService);
    spinnerService.globalSpinnerSubject.next(true)
    return userService.isAuthenticated().pipe(
        map((response: any) => {
            debugger;
            spinnerService.globalSpinnerSubject.next(false)
            if (response.user) {
                userService.user = response.user
                StaticData.setStaticData(response)
                return true;
            } else {
                router.navigateByUrl('/login');
                return false;
            }
        }));
};

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ProjectIdGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const user = localStorage.getItem('user');
        if (user) {
            return true;
        } else {
            this.router.navigate(['dashboard/project']);
            return false;
        }
    }
}

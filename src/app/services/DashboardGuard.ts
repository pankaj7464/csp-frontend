import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { AuthorizationService, Role } from './authorization.service'; // Import AuthorizationService and Role

@Injectable({
    providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
    constructor(private authService: AuthService, private authorizationService: AuthorizationService, private router: Router) { }


    canActivate(): Observable<boolean> {

        return this.authService.isAuthenticated$.subscribe(auth =>{
            
        }
    }
  }

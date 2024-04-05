import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizationService, Role } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationService, private router: Router) {}

  canActivate(): boolean {
    console.log("Must be Admin to access this page")
    const userRole = this.authorizationService.getCurrentUser()?.role;
    if(userRole === Role.Admin){
        console.log("Admin access granted");
            return true;
    }
    else {
        this.router.navigate(["dashboard/project"])
        return false;
    }
  }
}

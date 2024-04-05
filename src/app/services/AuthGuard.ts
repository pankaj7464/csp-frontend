import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log("Must be authenticated")
    return this.authService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          // User is authenticated, redirect to dashboard
          console.log(isAuthenticated)
          this.router.navigate(['/dashboard']);
          return false; // Return false to prevent access to the route
        } else {
          // User is not authenticated, allow access to the route
          console.log("Must be authenticated")
          return true;
        }
      })
    );
  }
}

import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
constructor(private authService: AuthService) {
 
 }

 Logout() {
  localStorage.removeItem("user"  )
  this.authService.logout({
    logoutParams: {
      returnTo: `${environment.clientURL}/login`
    }
  });
 }
}

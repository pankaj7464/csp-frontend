
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from '../services/api.service';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  users: any
  error = '';
  @ViewChild('tabGroup')
  tabGroup!: MatTabGroup;

  changeTab(index: number) {
    this.tabGroup.selectedIndex = index;
  }
  constructor(private authorizationService: AuthorizationService, private apiService: ApiService, private fb: FormBuilder, private auth: AuthService, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });


    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      name: ['', Validators.required],
    });
    this.auth.isAuthenticated$.subscribe(auth => {
      if (auth) {
        // User is authenticated, perform login
        this.router.navigate(['dashboard/project']);
      } else {
        // User is not authenticated, perform login
        this.auth.loginWithRedirect();
      }
    });

  }
 

 

}
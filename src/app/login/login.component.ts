
import { Component,  ViewChild } from '@angular/core';
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
      email: ['', [Validators.required,Validators.email]],
    });

    
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      name: ['', Validators.required],
    });
    this.auth.isAuthenticated$.subscribe(auth => {
   
      this.auth.getAccessTokenSilently().subscribe(data => {console.log(data)})
      if (auth) {
        this.router.navigate(['dashboard/project']);
      }
    })

  }
  ngOnInit() {
    this.auth.loginWithRedirect()
  }
  Login() {
    this.auth.loginWithRedirect()
  }

  // Function to handle login form submission
  ManualLogin() {
    console.log('Login Form Submitted!', this.loginForm.value);
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(data => {
        data = JSON.parse(data)
        console.log(data);
        if (data.isSuccess) {
          this.apiService.showSuccessToast(data.message)
            this.router.navigate(['dashboard/project']);
        }
        else {
          this.apiService.showSuccessToast(data.message)
        }

     
      },
        error => {
          this.apiService.showSuccessToast(" There was an error")
        }
      )
    } else {
      // Form is invalid, display error or take appropriate action
    }
  }

}
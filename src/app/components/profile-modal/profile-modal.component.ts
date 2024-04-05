import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
})
export class ProfileModalComponent {

  userData: any;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(res => {
      this.userData = res;
      console.log(this.userData);
    });
  }

  isLoggedIn(): boolean {
    // Implement your logic to check if the user is logged in
    // For example, you might check if there is a token stored in local storage
    return localStorage.getItem('token') !== null;
  }




//   userData:any = {};
//  constructor(private apiService: ApiService){
//    this.apiService.userProfile().subscribe(res => {
//      this.userData = res;
//      console.log(this.userData);
//    });
//  }

}

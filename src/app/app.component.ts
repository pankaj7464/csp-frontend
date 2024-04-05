import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading: boolean;
  constructor( public apiService: ApiService,private authService: AuthService) {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.apiService.isLoading().subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

}

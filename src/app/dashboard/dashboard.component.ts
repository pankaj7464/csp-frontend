import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NavigationEnd, Router } from '@angular/router';
import 'jspdf-autotable';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../components/profile-modal/profile-modal.component';
import { AuthorizationService, Role } from '../services/authorization.service';

import { environment } from '../../environments/environment.development';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userDetail!: any
  isLoading: boolean;
  roles: string[] = [];

  userSubscription!: Subscription;

  currentUrl: string;
  constructor(public dialog: MatDialog,
    public router: Router,
    public apiService: ApiService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) public document: Document,
    public authService: AuthService,
    public authorizationService: AuthorizationService) {

    this.currentUrl = router.url;

    this.authService.idTokenClaims$.subscribe(data => {
      this.apiService.exchangeToken(data?.__raw).subscribe(
        data => {
          localStorage.setItem("user", JSON.stringify(data));
          this.roles = this.authorizationService.getCurrentUser()?.roles;
          this.authorizationService.updateUser(data);
        },
        error => {
          console.error("Error exchanging token:", error);
          this.router.navigate(['/error-page']); 
        }
      );
    });

    this.isLoading = false;
  }


  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.userSubscription = this.authorizationService.user$.subscribe((user: any) => {
      this.roles = user.data.roles;
      this.userDetail = user.data;
      console.log(this.userDetail)
    });
    this.apiService.isLoading().subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
      }
    });
  }
  Navigations = [
    { path: 'dashboard/project', displayName: 'Project' },
    { path: 'dashboard/user-management', displayName: 'User Management' },
    { path: 'dashboard/role-management', displayName: 'Role Management' },
  ];

  isUserManagementPage() {
    return this.currentUrl !== "/dashboard/user-management";
  }

  isProjectPage() {
    return this.currentUrl !== "/dashboard/project";
  }

  isRolePage() {
    return this.currentUrl !== "/dashboard/role-management";
  }

  shouldShowTabs() {
    return this.isUserManagementPage() && this.isProjectPage() && this.isRolePage();
  }


  ngAfterViewInit() {
    this.isAdmin()
  }
  logout(flag?: boolean) {
    this.authService.logout({
      logoutParams: {
        returnTo: flag ? `${environment.clientURL}/login` : `${environment.clientURL}/not-verified`
      }
    });
  }
  navigateTo(path: string) {
    // throw new Error('Method not implemented.');
    this.router.navigate([path])
  }


  isAdmin(): boolean {
    console.log(this.authorizationService.hasRoles("admin"))
    return this.authorizationService.hasRoles("admin") || this.authorizationService.getCurrentUser()?.roles.includes("admin");
  }
  openDialog() {
    this.dialog.open(ProfileModalComponent);
  }

}

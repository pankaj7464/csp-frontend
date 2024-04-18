import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild, viewChild } from '@angular/core';
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
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userDetail!: any
  isLoading: boolean;
  roles: string[] = [];
  @ViewChild('drawer') drawer!: MatDrawer;
  userSubscription!: Subscription;
  isSidebarOpen: boolean = true;
  currentUrl: string;
  constructor(public dialog: MatDialog,
    public router: Router,
    public apiService: ApiService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) public document: Document,
    public authService: AuthService,
    public authorizationService: AuthorizationService) {

    this.currentUrl = router.url;
    this.authService.getAccessTokenSilently().subscribe(token => {
      console.log(token);
    });

    this.authService.getAccessTokenSilently().subscribe(token => {
      this.apiService.exchangeToken(token).subscribe(
        data => {
          localStorage.setItem("user", JSON.stringify(data));
          console.log(data)
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
      
      console.log(user,"subscribed");
      this.roles = user?.user?.roles;
      this.userDetail = user?.user;
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



  toggleSidebar() {

    this.isSidebarOpen = !this.isSidebarOpen;
    this.drawer.toggle();
  }

  logout(flag?: boolean) {
    localStorage.removeItem("user")
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

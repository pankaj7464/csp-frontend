import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface User {
  id: string;
  name: string;
  email: string;
  role: string[];
}

export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Auditor = 'auditor',
  Client = 'client',
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  roles!: any[];
  private userSubject = new Subject<string[]>();

  user$ = this.userSubject.asObservable();




  constructor() {
    const user = localStorage.getItem('user');
    if (user) {
      this.updateUser(JSON.parse(user));
    }

  }

  // Method to update user role
  updateUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user)); // Update localStorage
    this.userSubject.next(user); // Notify subscribers
    this.roles = user?.data?.roles;
  }


  hasRoles(r: string): boolean {
    return this.roles.includes(r);
  }

  // getAllUsers(): User[] {
  //   return this.users;
  // }
  getCurrentUser(): any {
    let user = localStorage.getItem('user') as any;
    user = JSON.parse(user as any);
    console.log(user?.data.roles);
    return user?.data;
  }
}

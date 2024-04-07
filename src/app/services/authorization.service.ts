import { Injectable } from '@angular/core';
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
  constructor() {
    this.roles = JSON.parse(localStorage.getItem('user') as any)?.data?.roles;
    console.log(this.roles);
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

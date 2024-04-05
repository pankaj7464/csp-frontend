import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RoleEditModalComponent } from '../../components/role-edit-modal/role-edit-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  dataSource: any[]
  displayedColumns = ["Name", "Email", "Role", "status", "Actions"]
  constructor(private apiService: ApiService, public dialog: MatDialog,) {
  this.getAllUser()
    this.dataSource = [];
  }


  getAllUser(){
    this.apiService.getAllUsers().subscribe(users => {
      console.log(users);
      this.dataSource = JSON.parse(users);
      console.log(this.dataSource);
    });
  }
  onSlideToggleChange(checked: boolean, element: any) {
    // Call your function here with the checked value and element data
    this.apiService.toggleUserActiveStatus(element.id, checked).subscribe(res => {
      console.log(res);
      this.getAllUser()
      this.apiService.showSuccessToast("Account Status Changed")
    });
    console.log("Element data:", element);

  }
  openRoleEdit(user: any) {
    const dialogRef = this.dialog.open(RoleEditModalComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllUser()
    });
  }
}

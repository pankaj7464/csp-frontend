import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RoleEditModalComponent } from '../../components/role-edit-modal/role-edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  dataSource: any[]
  displayedColumns = ["Name", "Email", "Role",  "Actions"]
  
  form: FormGroup;
  editDataId !:string
  roles: string[] = ['Role 1', 'Role 2', 'Role 3'];
  constructor(private apiService: ApiService, public dialog: MatDialog,private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      roles: [[]] 
    });
  this.getAllUser()
    this.dataSource = [];
    this.getRoles()
  }


  getAllUser(){
    this.apiService.getAllUsers().subscribe(users => {
      console.log(users);
      this.dataSource = JSON.parse(users)?.data;
      console.log(this.dataSource);
    });
  }

  getRoles() {
    this.apiService.getAllRole().subscribe((data) => {
      data = JSON.parse(data);
      this.roles = data?.data.map((r: { name: string; }) => r.name);

    });
  }

  // Method to handle form submission
  submitForm(): void {
    if (this.form.valid) {
    
      console.log('Form submitted with data:', this.form.value);
      this.apiService.createUser(this.form.value).subscribe(data => {
        console.log(data)
        this.getAllUser()
      });
    } else {
      // Form is invalid, mark all fields as touched to display validation errors
      this.form.markAllAsTouched();
    }
  }

  onDelete(arg0: any) {
    this.apiService.deleteUser(arg0).subscribe((res) => {
      this.getAllUser()
      this.apiService.showSuccessToast('Deleted Successfully');
    })
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

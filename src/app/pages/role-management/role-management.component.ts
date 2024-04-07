import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { AddRoleComponent } from '../../components/add-role/add-role.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {
  dataSource: any[]
  form: FormGroup;
  displayedColumns = ["RoleName", "RoleDesc", "Actions"]
  editDataId: any;
  constructor(private apiService: ApiService, private fb: FormBuilder,private dialog: MatDialog) {

    this.form = this.fb.group({
      name: ['', Validators.required,LowerCasePipe],
  
    });
    this.dataSource = [];
  }
  ngOnInit() {
    this.getRoles();
  }
  getRoles() {
    this.apiService.getAllRole().subscribe((data) => {
      data = JSON.parse(data);
      console.log(data)
      this.dataSource = data?.data;
    });
  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
    
    
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRoles()
    });
  }
  
  deleteItem(id: any) {
    console.log('Delete Item:', id);
    this.apiService.deleteRoles(id).subscribe(
      (res) => {
        this.getRoles();
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

}

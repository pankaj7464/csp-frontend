import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent {
  roleName!: string;
  
  constructor(private apiService: ApiService, private dialogRef: MatDialogRef<AddRoleComponent>) {
   
  }

  submitForm(): void {

    console.log('Role Name:', this.roleName); 
    if (this.roleName && this.roleName.trim() !== ''){
      // Assuming you have a service named 'apiService' to handle API requests
      this.apiService.postRole(this.roleName.toLocaleLowerCase()).subscribe(
        response => {
          this.apiService.showSuccessToast('Role Added Successfully');
          this.dialogRef.close();
        },
        error => {
          // Handle error
          console.error('API error:', error);
          // Optionally, you can handle the error here
        }
      );
    }
  }
  

}

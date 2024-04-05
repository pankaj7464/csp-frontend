import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-role-edit-modal',
  templateUrl: './role-edit-modal.component.html',
  styleUrl: './role-edit-modal.component.css'
})
export class RoleEditModalComponent {
  userRoleForm: FormGroup;
  userData: any = {};
  roles!: any[];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data.user)
    this.userData = data.user;
    this.userRoleForm = this.formBuilder.group({
      userId: [ this.userData.id || '', [Validators.required]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getAllRole()
  }


  getAllRole() {
    this.apiService.getAllRole().subscribe((res) => {
      console.log(res);
      res = JSON.parse(res);
      this.roles = res.items;
    });
  }
  onSubmit(): void {
    if (this.userRoleForm.valid) {
      const formData = this.userRoleForm.value;
      console.log('Form Data:', formData);
      this.apiService.updateUserRole(formData).subscribe(res => {
        this.getAllRole();
        this.apiService.showSuccessToast('Role Updated Successfully');
      })
     
    }
  }



}

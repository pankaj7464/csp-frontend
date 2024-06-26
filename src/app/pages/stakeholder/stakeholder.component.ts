import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stakeholder-table',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.css'],
})
export class StakeholderComponent {
  form: FormGroup;
  projects: any[] = [];
  editDataId: string = '';
  displayedColumns: string[] = ['title', 'name', 'email', 'Actions'];
  dataSource!: any[];
  projectId!: string;
  roles: any[] = [];
  users: any[] = [];  
  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
      this.getAllStakeholder(this.projectId);
    }
    this.form = this.fb.group({
      roleId: ['', Validators.required],
      userId: ['', Validators.required],
      projectId: [this.projectId, Validators.required],
    });
    this.getRoles();
    this.getAllUsers();
  }
  getRoles() {
    this.apiService.getAllRole().subscribe((data) => {
      data = JSON.parse(data);
      console.log(data)
      this.roles = data?.data;
      console.log(this.roles);
    });
  }

  getAllUsers() {
    this.apiService.getAllUser().subscribe((data) => {
      data = JSON.parse(data);
      this.users = data?.data;
      console.log(this.users);
    });
  }

  deleteItem(id: any) {
    this.apiService.deleteStakeholder(id).subscribe(
      (res) => {
        this.getAllStakeholder(this.projectId);
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

  getAllStakeholder(id: string) {
    this.apiService.getAllStakeholder(id).subscribe((res) => {
      this.dataSource = res;
      console.log(this.dataSource);
    });
  }
  editItem(data: any) {
    this.editDataId = data.id;
    this.form.patchValue(data);
  }

  submitForm(): void {
    console.log('Submit', this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.editDataId) {
        this.apiService.updateStakeholder(this.editDataId, this.form.value).subscribe((res) => {
          this.getAllStakeholder(this.projectId);
          this.apiService.showSuccessToast('Escalation Matrix Updated Successfully');
        });
      } else {
        this.apiService.postStakeholder(this.form.value).subscribe((res) => {
          this.getAllStakeholder(this.projectId);
          this.apiService.showSuccessToast('Escalation Matrix Added Successfully');
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  isManager(): boolean {
    const manager = this.authorizationService.hasRoles(Role.Manager);
    const admin = this.authorizationService.hasRoles(Role.Admin);

    return admin || manager;
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
export interface Resources {
  name: string;
  role: string;
  startDate: Date;
  endDate: Date;
  comment: string;

}
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  dataSource: Resources[] = [

  ];

  displayedColumns: string[] = ['role', 'start', 'end', 'allocationPercentage', 'action'];
  form!: FormGroup;
  roles!: any[];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.getResources(this.projectId);
    this.form = this.fb.group({
      roleId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      allocationPercentage: ['', Validators.required],
      projectId: [id || '', Validators.required],
    });
  }
  editDataId!: string;
  projectId!: string;
  ngOnInit() {
    this.getRoles();
  }
  getResources(projectId: string) {
    this.apiService.getResources(projectId).subscribe((res) => {
      this.dataSource = res;
      console.log(this.dataSource);
    });
  }


  getRoles() {
    this.apiService.getAllRole().subscribe((data) => {
      data = JSON.parse(data);
      console.log(data)
      this.roles = data?.data;
    });
  }
  submitForm() {
    console.log(this.form.value)
    if (this.form.valid) {
      // Submit the form data
      if (!this.editDataId) {
        this.apiService.postResources(this.form.value).subscribe(res => {
          this.getResources(this.projectId)
          this.apiService.showSuccessToast("Resource Added Successfully")
        });
      }
      else {
        this.apiService.updateResources(this.editDataId, this.form.value).subscribe(res => {
          this.getResources(this.projectId)
          this.apiService.showSuccessToast("Resource Updated Successfully")
        });
      }
      console.log(this.form.value);
    } else {

    }
  }

  editItem(data: any) {

    this.editDataId = data.id;

    this.form.patchValue(data);
  }
  deleteItem(id: any) {
    this.apiService.deleteEscalationMatrix(id).subscribe(
      (res) => {
        this.getResources(this.projectId)
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

  isManager(): boolean {
    const manager = this.authorizationService.hasRoles(Role.Manager);
    const admin = this.authorizationService.hasRoles(Role.Admin);

    return admin || manager;
  }
}

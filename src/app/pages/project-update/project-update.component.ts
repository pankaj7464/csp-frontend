import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
export interface ProjectUpdate {
  date: Date;
  generalUpdate: string;
}

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrl: './project-update.component.css'
})
export class ProjectUpdateComponent {
  dataSource: ProjectUpdate[] = [
  
  ];

  displayedColumns: string[] = ['date', 'generalUpdate', 'action'];
  form!: FormGroup;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.getProjectUdpate(this.projectId)
    this.form = this.fb.group({
      date: ['', Validators.required],
      generalUpdate: ['', Validators.required],
      projectId: [id ? id : '', Validators.required],
    });
  }

  editDataId!: string;
  projectId!: string;
  ngOnInit() {

  }
  getProjectUdpate(projectId: string) {
    this.apiService.getProjectUpdate(projectId).subscribe((res) => {
      this.dataSource = res;
    });
  }
  submitForm() {
    if (this.form.valid) {
      if (!this.editDataId) {
        this.apiService.postProjectUdpate(this.form.value).subscribe(res => {
          this.getProjectUdpate(this.projectId)
          this.apiService.showSuccessToast("Project Upddate Success Added");
        })
      }
      else {
        this.apiService.updateProjectUpdate(this.editDataId, this.form.value).subscribe(res => {
          this.getProjectUdpate(this.projectId)
          this.apiService.showSuccessToast("Project Upddate Successfully editted");
        })
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
    this.apiService.deleteProjectUpdate(id).subscribe(
      (res) => {
        this.getProjectUdpate(this.projectId)
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

  isManager(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Manager || userRole === Role.Admin;
  }

}

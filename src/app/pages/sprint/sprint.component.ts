import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sprint-table',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  displayedColumns: string[] = ['startDate', 'endDate', 'status', 'comments', 'goals', 'sprintNumber', 'action'];
  dataSource!: any[];
  form!: FormGroup;
  editDataId!: string
  projectId!: string;
  constructor(private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService, private route: ActivatedRoute) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.form = this.fb.group({
      projectId: [id || '', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      comments: ['', Validators.required],
      goals: ['', Validators.required],
      sprintNumber: ['', Validators.required]
    });
  }
  phaseMilestone: any = []
  statuses: string[] = this.apiService.sprintStatuses
  ngOnInit() {
    this.getAllSprint()

  }

  getAllSprint() {
    this.apiService.getAllSprint(this.projectId).subscribe(res => {
      console.log(res)
      this.dataSource = res;
    })
  }

  deleteItem(id: any) {
    this.apiService.deleteSprint(id).subscribe(
      (res) => {
        this.getAllSprint();
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }
  editItem(data: any) {
    this.editDataId = data.id
    this.form.patchValue(data);
  }

  submitForm(): void {
    if (this.form.valid) {
      if (this.editDataId) {
        this.apiService.updateSprint(this.editDataId, this.form.value).subscribe((res) => {
          this.getAllSprint();
          this.apiService.showSuccessToast("Sprint Updated Successfully");
        });
      }
      else {
        this.apiService.postSprint(this.form.value).subscribe((res) => {
          this.getAllSprint();
          this.apiService.showSuccessToast("Sprint Added Successfully");
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  isManager(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Manager || userRole === Role.Admin;
  }
}

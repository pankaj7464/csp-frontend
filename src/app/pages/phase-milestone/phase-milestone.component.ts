import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-phase-milestone-table',
  templateUrl: './phase-milestone.component.html',
  styleUrls: ['./phase-milestone.component.css'],
})
export class PhaseMilestoneComponent implements OnInit {
  form!: FormGroup;
  statuses: string[] = this.apiService.phaseMilestoneStatus

  displayedColumns: string[] = [

    'title',
    'startDate',
    'endDate',
    'description',
    'comments',
    'status'
    , "Actions"
  ];
  dataSource!: any[];
  projects: any[] = [];
  editDataId!: string
  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.form = this.fb.group({
      projectId: [id || '', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required],
    });
  }
  projectId!: string;


  ngOnInit() {
    this.getAllPhaseMilestone(this.projectId)
  
  }

  getAllPhaseMilestone(id: string) {
    this.apiService.getAllPhaseMilestone(id).subscribe((res) => {
      console.log(res);
      this.dataSource = res;
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.editDataId) {
        this.apiService.updatePhaseMilestone(this.editDataId, { ...this.form.value, sprints: [] }).subscribe((res) => {
          this.getAllPhaseMilestone(this.projectId)
          this.apiService.showSuccessToast("Phase/Milestone Updated Successfully");
        });
      }
      else {
        this.apiService.postPhaseMilestone({ ...this.form.value, sprints: [] }).subscribe((res) => {
          this.getAllPhaseMilestone(this.projectId)
          this.apiService.showSuccessToast("Phase/Milestone Added Successfully");
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  editItem(data: any) {
    this.editDataId = data.id
    this.form.patchValue(data);
  }
  deleteItem(id: any) {
    this.apiService.deletePhaseMilestone(id).subscribe(
      (res) => {
        this.getAllPhaseMilestone(this.projectId)
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

import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProjectBudget } from '../../models/project-budget';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrl: './audit-history.component.css',
})
export class AuditHistoryComponent {
  displayedColumns: string[] = [
    'dateOfAudit',
    'reviewedBy',
    'status',
    'reviewedSection',
    'commentOrQueries',
    'actionItem',
    'Actions',
  ];
  dataSource!: ProjectBudget[];
  statuses: string[] = [
    'InProgress',
    'Completed',
    'Delayed',
    'OnTrack',
    'SignOffPending',
  ];
  form!: FormGroup;

  auditors: any[] = []

  projects: any

  editDataId!: string;


  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService) {

  }

  projectId!: string;
  ngOnInit() {
    let id = localStorage.getItem('projectId')
    this.form = this.fb.group({
      dateOfAudit: ['', Validators.required],
      reviewedBy: ['', Validators.required],
      status: ['', Validators.required],
      reviewedSection: ['', Validators.required],
      commentOrQueries: ['', Validators.required],
      actionItem: ['', Validators.required],
      projectId: [id ? id : '', Validators.required],
    });
    if (id) {
      this.projectId = id
      console.log(this.projectId)
      this.getAuditData(this.projectId);
    }

    this.apiService.getAllProject().subscribe((res) => {
      this.projects = res;
    });
    this.apiService.getAllUserByRole("Auditor").subscribe((res) => {
      console.log(res,"Auditor");

      this.auditors = JSON.parse(res);
    });

  }



  getAuditData(id: string) {
    this.apiService.getAllAuditHistory(id).subscribe((res) => {
      console.log(res);
      this.dataSource = res;

      console.log(this.dataSource,"audit datasource")
    });
  }

  submitForm(): void {
    console.log(this.projectId)
    if (this.form.valid) {
      if (!this.editDataId) {
        this.apiService.postAuditHistory(this.form.value).subscribe((res) => {
          this.getAuditData(this.projectId)
          this.apiService.showSuccessToast('Audit History Added Successfully');
        });
      } else {
        this.apiService.updateAuditHistory(this.editDataId, this.form.value).subscribe((res) => {
          this.getAuditData(this.projectId)
          this.apiService.showSuccessToast('Audit History updated Successfully');
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }


  deleteItem(id: any) {
    this.apiService.deleteAuditHistory(id).subscribe(
      (res) => {
        this.getAuditData(this.projectId)
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }
  editItem(data: any) {
    this.editDataId = data.id
    console.log(data)
    this.form.patchValue(data);
  }

  isAuditorOrAdmin(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Auditor || userRole === Role.Admin;
  }
}

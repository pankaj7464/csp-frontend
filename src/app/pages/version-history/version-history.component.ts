import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-version-history-table',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css'],
})
export class VersionHistoryComponent implements OnInit {

  displayedColumns: string[] = [
    'version',
    'type',
    'change',
    'changeReason',
    'createdBy',
    'revisionDate',
    'approvalDate',
    'approvedBy',
    'Actions',
  ];
  dataSource!: any[];
  managers!: any[];
  form: FormGroup;
  editDataId!: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem("projectId")
    if (id) {
      this.projectId = id
    }

    this.form = this.fb.group({
      version: ['', Validators.required],
      type: ['', Validators.required],
      change: ['', Validators.required],
      changeReason: ['', Validators.required],
      createdBy: ['', Validators.required],
      revisionDate: ['', Validators.required],
      approvalDate: [''],
      approvedBy: [''],
      projectId: [id || '', Validators.required],
    });

  }
  projectId!: string;
  ngOnInit() {

    this.getAllVersionHistory()
    this.getAllUserByRole()
   
  }




  getAllVersionHistory() {
    this.apiService.getAllVersionHistory(this.projectId).subscribe((res) => {
      console.log(res);
      this.dataSource = res;
    });
  }
  getAllUserByRole() {
    this.apiService.getAllUserByRole("Manager").subscribe((res) => {
      console.log(res);
      this.managers = JSON.parse(res );
    });
  }

  deleteItem(id: any) {
    this.apiService.deleteVersionHistory(id).subscribe(
      (res) => {
        this.getAllVersionHistory();
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

  submitForm() {
    console.log('Submit', this.form.value)
    if (this.form.valid) {
      if (this.editDataId) {
        this.apiService.updateVersionHistory(this.editDataId, this.form.value).subscribe((res) => {
          this.getAllVersionHistory();
          this.apiService.showSuccessToast(
            'Version History Updated Successfully'
          );
        });
      }
      else {
        this.apiService.postVersionHistory(this.form.value).subscribe((res) => {
          this.getAllVersionHistory();
          this.apiService.showSuccessToast(
            'Version History Added Successfully'
          );
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

  isManager(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Manager || userRole === Role.Admin;
  }
}

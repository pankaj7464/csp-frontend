import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-escalation-matrix-table',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.css'],
})
export class EscalationMatrixComponent implements OnInit {

  displayedColumns: string[] = [
    'level',
    'responsiblePerson',
    'Actions',
  ];
  dataSourceForFinantials!: any[];
  dataSourceForTechnicals!: any[];
  dataSourceForOperationals!: any[];

  form!: FormGroup;
  editDataId!: string;

  escalationType: string[] = this.apiService.escalationType;
  levels: string[] = this.apiService.levels;
  projects: any[] = ['Project 1', 'Project 2'];
  dataSource!: any[]
  constructor(private route: ActivatedRoute, private apiService: ApiService, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.getAllEscalationMatrix(this.projectId)
    this.apiService.getAllProject().subscribe((res) => {
      this.projects = res;
    });
    this.form = this.fb.group({
      level: ['', Validators.required],
      escalationType: ['', Validators.required],
      responsiblePerson: ['', Validators.required],
      projectId: [id ? id : '', Validators.required],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      if (this.editDataId) {
        this.apiService.updateEscalationMatrix(this.editDataId, this.form.value).subscribe((res) => {
          this.getAllEscalationMatrix(this.projectId)
          this.apiService.showSuccessToast(
            'Escalation Matrix  Successfully'
          );
        });
      }
      else {
        this.apiService.postEscalationMatrix(this.form.value).subscribe((res) => {
          console.log(res);
          this.getAllEscalationMatrix(this.projectId)
          this.apiService.showSuccessToast(
            'Escalation Matrix Added Successfully'
          );
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  projectId!: string;
  ngOnInit() {

  }

  getAllEscalationMatrix(id: string) {
    this.apiService.getAllEscalationMatrix(id).subscribe((res) => {
      this.dataSource = res
      this.dataSourceForFinantials = res.filter(i => i.escalationType == 1).sort((a, b) => a.level - b.level);
      this.dataSourceForTechnicals = res.filter(i => i.escalationType == 2).sort((a, b) => a.level - b.level);
      this.dataSourceForOperationals = res.filter(i => i.escalationType == 0).sort((a, b) => a.level - b.level);
    });
  }

  editItem(data: any) {

    this.editDataId = data.id;

    this.form.patchValue(data);
  }
  deleteItem(id: any) {
    this.apiService.deleteEscalationMatrix(id).subscribe(
      (res) => {
        this.getAllEscalationMatrix(this.projectId)
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }
  isAdmin(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Admin;
  }
}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-budget-table',
  templateUrl: './project-budget.component.html',
  styleUrls: ['./project-budget.component.css'],
})
export class ProjectBudgetComponent implements OnInit {
  displayedColumns: string[] = [
    'type',
    'durationInMonths',
    'contractDuration',
    'budgetedHours',
    'budgetedCost',
    'currency',
    'Actions',
  ];
  currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'INR', name: 'Indian Ruppee' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' }
 
];

  dataSource!: any[];
  form!: FormGroup;
  projects: any[] = [];
  projectType: string[] = this.apiService.projectType;
  editDataId!: string

  constructor(private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private authorizationService: AuthorizationService) {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.projectId = id;
    }
    this.form = this.fb.group({
      type: ['', Validators.required],
      durationInMonths: ['', Validators.required],
      contractDuration: ['', Validators.required],
      budgetedHours: ['', Validators.required],
      budgetedCost: ['', Validators.required],
      currency: ['', Validators.required],
      projectId: [id ? id : '', Validators.required],
    });
  }


  projectId!: string;
  ngOnInit() {
    this.apiService.getAllProject().subscribe((res) => {
      console.log(res);
      this.projects = res;
    });
    this.getAllProjectBudget(this.projectId)
  }



  getAllProjectBudget(id: string) {
    this.apiService.getProjectBudgets(id).subscribe((res) => {
      this.dataSource = res;
    });
  }


  submitForm(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.editDataId) {
        this.apiService.updateProjectBudget(this.editDataId, this.form.value).subscribe(
          (res) => {
            this.getAllProjectBudget(this.projectId)
            this.apiService.showSuccessToast('Project Budget Updated Successfully');
          },

          (error) => {
            console.log(error);
          }
        );
      }
      else {
        this.apiService.postProjectBudget(this.form.value).subscribe(
          (res) => {
            this.getAllProjectBudget(this.projectId)
            this.apiService.showSuccessToast('Project Budget Added Successfully');
          },

          (error) => {
            console.log(error);
          }
        );
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  deleteItem(id: any) {
    console.log(id)
    this.apiService.deleteProjectBudget(id).subscribe(
      (res) => {
        this.getAllProjectBudget(this.projectId)
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

  isManager(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Manager || userRole === Role.Admin;
  }
}

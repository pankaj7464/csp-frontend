import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
export interface Project {
  name: string;
  description: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  form!: FormGroup;
  dataSource: Project[] = [

  ];
  editDataId!: string;
  displayedColumns: string[] = ['name', 'description', 'action'];
  users!: any[];
  userDetails!: any;
  constructor(private fb: FormBuilder, private authorizationService: AuthorizationService, private router: Router, private apiService: ApiService) {
    this.getProject()
    this.getAllManager()
  }


  getAllManager() {
    this.apiService.getAllUserByRole("Manager").subscribe(res => {
      console.log(res)
      this.users = JSON.parse(res);
    })
  }

  getProject() {
    let user = localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user) as any
      this.userDetails = user;
      console.log(user,"user details")
    }
      console.log(this.userDetails.id)
      this.apiService.getProject().subscribe(project => {
        console.log(project)
        this.dataSource = project.items
      });
    

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      managerId: ['', Validators.required],
    });
  }

  submitForm() {
    console.log("Submit Form");
    if (this.form.valid) {
      if (!this.editDataId) {
        this.apiService.postProject(this.form.value).subscribe(data => {
          console.log(data)
          this.getProject()
        })
      }
      else {
        this.apiService.updateProject(this.editDataId, this.form.value).subscribe(data => {
          this.apiService.showSuccessToast('Project successfully');
          this.getProject()
        });
      }
    } else {

    }
  }
  editItem(data: any) {

    this.editDataId = data.id;

    this.form.patchValue(data);
  }
  deleteItem(id: any) {
    this.apiService.deleteProject(id).subscribe(
      (res) => {
        this.getProject()
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

  isAdmin(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole == Role.Admin;
  }
  isAuditor(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Auditor || userRole === Role.Admin;
  }

  navigateTo(id: any) {
    console.log("navigateTo")
    localStorage.setItem('projectId', id)
    this.router.navigate(["dashboard/audit-history"]);
    console.log("nexrt")
  }
}

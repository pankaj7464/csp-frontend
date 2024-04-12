import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
export interface Project {
  id: string;
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
    dataSource: Project[] = [];
    editDataId!: string;
    displayedColumns: string[] = ['name', 'description','status', 'action'];
    users!: any[];
    userDetails!: any;
    ProjectStatus = ['NotStarted', 'InProgress', 'Completed', 'OnHold']
  constructor(private fb: FormBuilder, private authorizationService: AuthorizationService, private router: Router, private apiService: ApiService) {
   this.getProject()
  }


  getAllManager() {
    this.apiService.getAllUserByRole(Role.Manager).subscribe(res => {
      console.log(res)
      this.users = JSON.parse(res).data;
    })
  }

  getProject() {
    console.log("getProject")
    this.apiService.getProject().subscribe(project => {
      console.log(project)
      this.dataSource = project.items
    });
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [0, Validators.required],
      managerId: ['', Validators.required],
    });

    this.getAllManager()
  }
  ngafterViewInit() {
    this.getProject()
  }

  submitForm() {
    console.log("Submit Form", this.form.valid);
    console.log(this.form.value);
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
  editItem(data: any, event: MouseEvent) {
    event.stopPropagation();
    this.editDataId = data.id;

    this.form.patchValue(data);
  }
  deleteItem(id: any, event: MouseEvent) {
    event.stopPropagation();
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

  getStatusClass(status: number) {
    switch (status) {
      case 0:
        return 'text-gray-500';
      case 1:
        return 'text-blue-500';
      case 2:
        return 'text-green-500';
      case 3:
        return 'text-orange-500';
      default:
        return ''; 
    }
  }

  isAdmin(): boolean {
    const admin = this.authorizationService.hasRoles(Role.Admin);
    return admin;
  }
  isAuditor(): boolean {
    const auditor = this.authorizationService.hasRoles(Role.Auditor);
    const admin = this.authorizationService.hasRoles(Role.Admin);
    return admin || auditor;
  }

  navigateTo(id: any) {
    localStorage.setItem('projectId', id)
    localStorage.setItem("project",JSON.stringify(this.dataSource.find(x=>x.id == id)))
    this.router.navigate(["dashboard/audit-history"]);
  }

  getMatIconClass(status: number) {
    switch (status) {
      case 0:
        return 'material-icons text-gray-500';
      case 1:
        return 'material-icons text-blue-500';
      case 2:
        return 'material-icons text-green-500';
      case 3:
        return 'material-icons text-orange-500';
      default:
        return 'material-icons'; // Default icon class
    }
  }

  getMatIconName(status: number) {
    switch (status) {
      case 0:
        return 'schedule';
      case 1:
        return 'pending';
      case 2:
        return 'check_circle';
      case 3:
        return 'pause_circle_filled';
      default:
        return 'help_outline'; // Default icon name
    }
  }
}

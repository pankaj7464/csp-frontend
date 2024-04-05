import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {
  dataSource: any[]
  form: FormGroup;
  displayedColumns = ["RoleName", "RoleDesc", "Actions"]
  editDataId: any;
  constructor(private apiService: ApiService, private fb: FormBuilder,) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],


    });

    this.dataSource = [];
  }
  ngOnInit() {
    this.getRoles();
  }
  getRoles() {
    this.apiService.getAllRole().subscribe((data) => {
      data = JSON.parse(data);
      console.log(data)
      this.dataSource = data;

    });
  }
  submitForm() {
    if (this.form.valid) {
      if (!this.editDataId) {
        console.log(this.form)
        this.apiService.postRole(this.form.value).subscribe(res => {
          this.getRoles()
          this.form.reset()
          this.editDataId = ""
          this.apiService.showSuccessToast("Role Success Added");
        })
      }
      else {
        this.apiService.updateRole(this.editDataId, this.form.value).subscribe(res => {
          this.getRoles();
          this.form.reset()
          this.editDataId = ""
          this.apiService.showSuccessToast("Role Successfully editted");
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
    this.apiService.deleteRoles(id).subscribe(
      (res) => {
        this.getRoles();
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }

}

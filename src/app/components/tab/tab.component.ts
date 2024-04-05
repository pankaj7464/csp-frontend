import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  constructor(public router: Router, public apiService: ApiService, private cdr: ChangeDetectorRef, @Inject(DOCUMENT) public document: Document,
    public authService: AuthService) {

  }



  navigateTo(path: any) {
    this.router.navigateByUrl("/dashboard/" + path);
  }


  tabs: { path: string; displayName: string }[] = [
    { path: 'audit-history', displayName: 'Audit History' },
    { path: 'sprint', displayName: 'Sprint' },
    { path: 'stakeholder', displayName: 'Stakeholder' },
    { path: 'version-history', displayName: 'Version History' },
    { path: 'project-budget', displayName: 'Project Budget' },
    { path: 'escalation-matrix', displayName: 'Escalation Matrix' },
    { path: 'risk-profiling', displayName: 'Risk Profiling' },
    { path: 'phase-milestone', displayName: 'Phase Milestone' },
    { path: 'resources', displayName: 'Resources' },
    { path: 'client-feedback', displayName: 'Client Feedback' },
    { path: 'approved-team', displayName: 'Approved Team' },
    { path: 'project-update', displayName: 'Project Update' },
    { path: 'minute-meeting', displayName: 'MinuteMeeting' },
  ];


  generatePdf() {
    let id = localStorage.getItem('projectId');
    let projectId: string = ''
    if (id) {
      projectId = id;
    }
    this.apiService.getAllDataForPdf(projectId).subscribe(
      (data) => {
        const doc = new jsPDF();
        console.log(data);
        Object.keys(data).forEach((key,index) => {
         
          if (data[key]) {
            let items = data[key];
            if (key == "escalationMatrix") {
              console.log(key)
              items = items.sort((a: any, b: any) => a.level - b.level)
            }
            if (items?.length > 0) {
              const tableData = items.map((item: any) => {
                const rowData = [];

                switch (key) {
                  case "projectBudgets": {
                    item.type = this.apiService.projectType[item.type]
                    break;

                  }
                  case "auditHistory": {
                    item.reviewedBy = "Test user"
                    item.dateOfAudit = new Date(item.dateOfAudit).toLocaleDateString();
                    break;
                  }
                  case "phaseMilestone": {
                    item.endDate = new Date(item.endDate).toLocaleDateString();
                    item.startDate = new Date(item.startDate).toLocaleDateString();
                    item.status = this.apiService.phaseMilestoneStatus[item.status];
                    break;
                  }
                  case "escalationMatrix": {
                    const escalationType: string[] = this.apiService.escalationType;
                    const levels: string[] = this.apiService.levels;
                    item.level = levels[item.level]
                    item.escalationType = escalationType[item.escalationType]

                    break;
                  }
                  case "riskProfile": {

                    item.impact = this.apiService.impacts[item.impact]
                    item.type = this.apiService.riskTypes[item.type]
                    item.severity = this.apiService.severities[item.severity]
                    break;
                  }
                  case "versionHistory": {
                    item.approvalDate = new Date(item.approvalDate).toLocaleDateString();
                    item.revisionDate = new Date(item.revisionDate).toLocaleDateString();
                    item.status = this.apiService.sprintStatuses[item.status];
                    break;
                  }
                  case "sprint": {
                    item.endDate = new Date(item.endDate).toLocaleDateString();
                    item.startDate = new Date(item.startDate).toLocaleDateString();
                    item.status = this.apiService.sprintStatuses[item.status];
                    break;
                  }
                  default:
                    "test"
                }
                for (const prop in item) {
                  if (item.hasOwnProperty(prop) && !prop.toLowerCase().includes('id')) {
                    rowData.push(item[prop]);
                  }
                }
                return rowData;
              });
              const tableName = key.charAt(0).toUpperCase() + key.slice(1);

              doc.text(`Table: ${tableName}`, 10, 10);
              autoTable(doc, {
                // Exclude keys containing 'id' substring from header
                head: [Object.keys(items[0]).filter(key => !key.toLowerCase().includes('id'))],
                body: tableData,
                startY: 20, 
              });

              // Add a page break after each table except for the last one
              if (key !== Object.keys(data)[Object.keys(data).length - 2]) {
                doc.addPage();
              }
            }
          }

        });

        doc.save('Report.pdf');
        this.cdr.detectChanges();
        this.apiService.showSuccessToast('Report downloaded successfully');
      },
      (err) => console.log(err)

    );


  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditHistoryComponent } from './pages/audit-history/audit-history.component';
import { SprintComponent } from './pages/sprint/sprint.component';
import { StakeholderComponent } from './pages/stakeholder/stakeholder.component';
import { VersionHistoryComponent } from './pages/version-history/version-history.component';
import { ProjectBudgetComponent } from './pages/project-budget/project-budget.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';
import { RiskProfileComponent } from './pages/risk-profiling/risk-profiling.component';
import { PhaseMilestoneComponent } from './pages/phase-milestone/phase-milestone.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { ClientFeedbackComponent } from './pages/client-feedback/client-feedback.component';
import { ApprovedTeamComponent } from './pages/approved-team/approved-team.component';
import { ProjectUpdateComponent } from './pages/project-update/project-update.component';
import { MinuteMeetingComponent } from './pages/minute-meeting/minute-meeting.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectIdGuard } from './services/ProjectIdGuard';
import { AuthGuard } from '@auth0/auth0-angular';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RoleManagementComponent } from './pages/role-management/role-management.component';
import { AdminGuard } from './services/AdminGuard';
import { NotVerifiedComponent } from './pages/not-verified/not-verified.component';
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "not-verified", component: NotVerifiedComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'project', component: ProjectComponent },
      { path: 'user-management', component: UserManagementComponent,canActivate:[AdminGuard] },
      { path: 'role-management', component: RoleManagementComponent,canActivate:[AdminGuard] },
      { path: 'audit-history', component: AuditHistoryComponent, canActivate: [ProjectIdGuard] },
      { path: 'sprint', component: SprintComponent, canActivate: [ProjectIdGuard] },
      { path: 'stakeholder', component: StakeholderComponent, canActivate: [ProjectIdGuard] },
      { path: 'version-history', component: VersionHistoryComponent, canActivate: [ProjectIdGuard] },
      { path: 'project-budget', component: ProjectBudgetComponent, canActivate: [ProjectIdGuard] },
      { path: 'escalation-matrix', component: EscalationMatrixComponent, canActivate: [ProjectIdGuard] },
      { path: 'risk-profiling', component: RiskProfileComponent, canActivate: [ProjectIdGuard] },
      { path: 'phase-milestone', component: PhaseMilestoneComponent, canActivate: [ProjectIdGuard] },
      { path: 'resources', component: ResourcesComponent, canActivate: [ProjectIdGuard] },
      { path: 'client-feedback', component: ClientFeedbackComponent, canActivate: [ProjectIdGuard] },
      { path: 'approved-team', component: ApprovedTeamComponent, canActivate: [ProjectIdGuard] },
      { path: 'project-update', component: ProjectUpdateComponent, canActivate: [ProjectIdGuard] },
      { path: 'minute-meeting', component: MinuteMeetingComponent, canActivate: [ProjectIdGuard] },
      { path: '**', redirectTo: '/dashboard/project', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

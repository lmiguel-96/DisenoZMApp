import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentsComponent } from './appointments.component';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/appointments', pathMatch: 'full' },
    { path: 'appointments', component: AppointmentsComponent, data: { title: extract('Citas') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {
  static components = [AppointmentsComponent, AppointmentDialogComponent];
  static entryComponents = [AppointmentDialogComponent];
}

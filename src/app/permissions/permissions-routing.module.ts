import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';

import { Shell } from '@app/shell/shell.service';
import { UsersComponent } from './users/users.component';
import { DentistComponent } from './dentist/dentist.component';
import { PermissionsComponent } from './permissions.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'users',
      data: { title: extract('Usuarios') },
      component: PermissionsComponent,
      children: [
        { path: 'permissions', component: UsersComponent, data: { title: extract('Usuarios') } },
        { path: 'dentists', component: DentistComponent, data: { title: extract('Usuarios') } },
        { path: '', redirectTo: 'permissions', pathMatch: 'full' }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule {
  static components = [UsersComponent, PermissionsComponent, DentistComponent];
}

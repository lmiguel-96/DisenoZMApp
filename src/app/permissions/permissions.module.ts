import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionsRoutingModule } from './permissions-routing.module';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    PermissionsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [PermissionsRoutingModule.components, UserDialogComponent],
  entryComponents: [UserDialogComponent]
})
export class PermissionsModule {}

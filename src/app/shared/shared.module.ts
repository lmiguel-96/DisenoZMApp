import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CategoryPipe } from './pipes/category.pipe';
import { RolePipe } from './pipes/role.pipe';
import { StatusPipe } from './pipes/status.pipe';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [LoaderComponent, ConfirmDialogComponent, CategoryPipe, RolePipe, StatusPipe],
  exports: [LoaderComponent, ConfirmDialogComponent, CategoryPipe, RolePipe, StatusPipe],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { CategoryPipe } from './pipes/category.pipe';
import { RolePipe } from './pipes/role.pipe';
import { StatusPipe } from './pipes/status.pipe';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [LoaderComponent, CategoryPipe, RolePipe, StatusPipe],
  exports: [LoaderComponent, CategoryPipe, RolePipe, StatusPipe]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    InventoryRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [InventoryRoutingModule.components, InventoryDialogComponent],
  entryComponents: [InventoryDialogComponent]
})
export class InventoryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ServicesRoutingModule } from './services-routing.module';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    ServicesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [ServicesRoutingModule.components, ServiceDialogComponent],
  entryComponents: [ServiceDialogComponent]
})
export class ServicesModule {}

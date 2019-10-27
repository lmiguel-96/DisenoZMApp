import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetime';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { CustomIntl } from '@app/core/CustomTimepickerIntl.class';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    AppointmentsRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [AppointmentsRoutingModule.components],
  entryComponents: [AppointmentsRoutingModule.entryComponents],
  providers: [
    {
      provide: OwlDateTimeIntl,
      useClass: CustomIntl
    }
  ]
})
export class AppointmentsModule {}

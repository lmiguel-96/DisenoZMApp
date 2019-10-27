import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { View, EventApi, EventInput } from '@fullcalendar/core';
import { MatDialog } from '@angular/material';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { Subject } from 'rxjs';
import { pluck, skipUntil } from 'rxjs/operators';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppointmentsService } from './appointments.service';
import { AppointmentFormData } from '@app/core/models/appointments.model';
import { NotificationService } from '@app/core/notification.service';
import * as moment from 'moment';

@Component({
  selector: 'dzm-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotificationService]
})
export class AppointmentsComponent {
  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;
  hiddenDays = [0];
  buttonText = { prev: 'Anterior', next: 'Siguiente', today: 'Actual', month: 'Mes', week: 'Semana', day: 'Día' };
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  calendarInit$ = new Subject<void>();
  calendarEvents$ = this.appointmentsService.stateChanged.pipe(
    skipUntil(this.calendarInit$),
    pluck('appointments')
  );

  constructor(
    public matDialog: MatDialog,
    private appointmentsService: AppointmentsService,
    private notificationService: NotificationService
  ) {}

  handleAppointmentsDateRangeChanged({ activeStart, activeEnd }: View): void {
    this.appointmentsService.setAppointmentsDateRange(activeStart, activeEnd);
  }

  handleGetAppointments(): void {
    this.appointmentsService.getAppointments();
  }

  handleViewEvetnDetails(selectedEvent: EventApi): void {
    this.matDialog.open(AppointmentDialogComponent, {
      width: '680px',
      height: 'auto',
      minHeight: '400px',
      autoFocus: true,
      data: { selectedEvent: selectedEvent.extendedProps }
    });
  }

  handleEventDateChange(event: EventApi) {
    this.appointmentsService
      .setAppointment({
        ...event.extendedProps,
        dueDate: moment(event.start)
          .set({ hour: 0, minutes: 0, seconds: 0, milliseconds: 0 })
          .toDate(),
        time: [event.start, event.end]
      } as AppointmentFormData)
      .then(wasSet => {
        this.notificationService.appointmentCreated(wasSet);
      });
  }

  handleOpenAppointmentDialog({ date }: EventInput): void {
    this.matDialog.open(AppointmentDialogComponent, {
      width: '680px',
      height: 'auto',
      minHeight: '400px',
      autoFocus: true,
      data: { selectedDate: date }
    });
  }
}

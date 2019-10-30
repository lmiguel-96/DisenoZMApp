import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppointmentsService } from '@app/appointments/appointments.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@app/core/models/user.model';
import { NotificationService } from '@app/core/notification.service';
import { Appointment } from '@app/core/models/appointments.model';
import * as moment from 'moment';

/**
 * IN ORDER TO DETERMINATE WETHER THE DIALOG IS CREATING OR EDITING AN EVENT, IT ACTUALLY RELIES ON
 * THE EXISTENCE OF 'selectedDate' FOR CREATION
 * AND THE EXISTENCE OF 'selectedEvent' FOR EDITION
 */
interface DialogData {
  selectedDate?: Date;
  selectedEvent?: Appointment;
}

@Component({
  selector: 'dzm-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentDialogComponent {
  appointmentForm = this.createAppointmentForm(this.data);
  patientSearchInput = new Subject<string>();
  dentistSearchInput = new Subject<string>();
  isLoading = new BehaviorSubject<boolean>(false);
  patients$ = this.appointmentsService
    .searchPatient(this.patientSearchInput)
    .pipe(map(patients => patients.map(patient => patient.payload.doc.data() as User)));
  dentists$ = this.appointmentsService
    .searchDentists(this.dentistSearchInput)
    .pipe(map(dentists => dentists.map(dentist => dentist.payload.doc.data() as User)));
  minTime = new BehaviorSubject<Date>(
    moment(this.appointmentForm.value.dueDate)
      .set({ hour: 8, minute: 0, seconds: 0, millisecond: 0 })
      .toDate()
  );
  maxTime = new BehaviorSubject<Date>(
    moment(this.appointmentForm.value.dueDate)
      .set({ hour: 17, minute: 0, seconds: 0, millisecond: 0 })
      .toDate()
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  handleCloseDialog(): void {
    this.dialogRef.close();
  }

  handleSetAppointment(appointmentForm: FormGroup): void {
    if (appointmentForm.valid) {
      this.isLoading.next(true);
      this.appointmentsService
        .setAppointment(appointmentForm.value)
        .then((result: boolean) => {
          this.notificationService.appointmentCreated(result);
          if (result) {
            this.handleCloseDialog();
          }
        })
        .finally(() => this.isLoading.next(false));
    } else {
      appointmentForm.markAllAsTouched();
    }
  }

  handleCancelAppointment(appointmentForm: FormGroup): void {
    this.appointmentsService
      .cancelAppointment(appointmentForm.value.appointmentID)
      .then(wasCancelled => {
        this.notificationService.appointmentCancelled(wasCancelled);
        if (wasCancelled) {
          this.handleCloseDialog();
        }
      })
      .finally(() => this.isLoading.next(false));
  }

  handleCompleteAppointment(appointmentForm: FormGroup): void {
    this.appointmentsService
      .completelAppointment(appointmentForm.value.appointmentID)
      .then(wasCompleted => {
        this.notificationService.appointmentCompleted(wasCompleted);
        if (wasCompleted) {
          this.handleCloseDialog();
        }
      })
      .finally(() => this.isLoading.next(false));
  }

  createAppointmentForm({ selectedDate, selectedEvent }: DialogData = this.data): FormGroup {
    const form = this.formBuilder.group({
      appointmentID: [null],
      patient: [null, Validators.required],
      dentist: [null, Validators.required],
      dueDate: [selectedDate, Validators.required],
      time: [null, Validators.required],
      status: ['active'],
      lastUpdate: [new Date(), Validators.required],
      title: [null],
      description: [null]
    });
    if (selectedEvent) {
      form.patchValue({ ...selectedEvent, time: [selectedEvent.startTime, selectedEvent.endTime] });
    }
    return form;
  }

  displayName(user?: User): string | undefined {
    return user ? `${user.name} ${user.lastName}, ${user.phoneNumber}` : undefined;
  }
}

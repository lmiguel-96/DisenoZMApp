import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { Appointment, AppointmentFormData } from '@app/core/models/appointments.model';
import { ObservableStore } from '@codewithdan/observable-store';
import { StoreState } from '@app/core/models/store.model';
import { EventInput } from '@fullcalendar/core';
import { DateInput } from '@fullcalendar/core/datelib/env';

export enum AppointmentStoreActions {
  setAppointments = 'ADD_APPOINTMENTS_BY_DATE_RANGE',
  setAppointmentsDateRange = 'ADD_APPOINTMENTS_DATE_RANGE'
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService extends ObservableStore<StoreState> implements OnDestroy {
  appointmentsSubscription: Subscription;

  constructor(private angularFirestore: AngularFirestore) {
    super({});
  }

  setAppointmentsDateRange(activeStart: DateInput, activeEnd: DateInput): void {
    this.setState(
      { appointmentsDateRange: { activeStart, activeEnd } },
      AppointmentStoreActions.setAppointmentsDateRange
    );
  }

  searchPatient(userInput$: Observable<string>): Observable<DocumentChangeAction<any>[]> {
    return userInput$.pipe(
      startWith(''),
      debounceTime(600),
      distinctUntilChanged(),
      switchMap(userInput => {
        const startTerm = userInput;
        const endTerm = startTerm + '\uf8ff';
        return this.angularFirestore
          .collection('users', userRef =>
            userRef
              .where('role', 'array-contains', 2)
              .orderBy('name')
              .startAt(startTerm)
              .endAt(endTerm)
              .limit(5)
          )
          .snapshotChanges();
      })
    );
  }

  searchDentists(userInput$: Observable<string>): Observable<DocumentChangeAction<any>[]> {
    return userInput$.pipe(
      startWith(''),
      debounceTime(600),
      distinctUntilChanged(),
      switchMap(userInput => {
        const startTerm = userInput;
        const endTerm = startTerm + '\uf8ff';
        return this.angularFirestore
          .collection('users', userRef =>
            userRef
              .where('role', 'array-contains', 3)
              .orderBy('name')
              .startAt(startTerm)
              .endAt(endTerm)
              .limit(5)
          )
          .snapshotChanges();
      })
    );
  }

  getAppointments(): void {
    const { activeStart, activeEnd } = this.getState().appointmentsDateRange;
    // tslint:disable-next-line: curly
    if (this.appointmentsSubscription) this.appointmentsSubscription.unsubscribe();
    this.appointmentsSubscription = this.fetchAppointments(activeStart, activeEnd);
  }

  fetchAppointments(activeStart: DateInput, activeEnd: DateInput): Subscription {
    return this.angularFirestore
      .collection('appointments', appointmentsRef =>
        appointmentsRef.where('dueDate', '>=', activeStart).where('dueDate', '<=', activeEnd)
      )
      .snapshotChanges()
      .pipe(
        map(appointmentsDocs => {
          return appointmentsDocs.map(appointment => {
            const {
              appointmentID,
              dueDate,
              startTime,
              endTime,
              title,
              status
            } = appointment.payload.doc.data() as Appointment;
            return {
              id: appointmentID,
              date: dueDate.toDate(),
              start: startTime ? startTime.toDate() : null,
              end: endTime ? endTime.toDate() : null,
              title,
              classNames:
                status === 'active'
                  ? ['ev-active']
                  : status === 'cancelled'
                  ? ['ev-cancelled']
                  : status === 'completed'
                  ? ['ev-completed']
                  : ['ev-active'],
              extendedProps: {
                ...appointment.payload.doc.data(),
                dueDate: dueDate.toDate(),
                startTime: startTime ? startTime.toDate() : null,
                endTime: endTime ? endTime.toDate() : null
              }
            } as EventInput;
          });
        })
      )
      .subscribe({ next: appointments => this.setState({ appointments }, AppointmentStoreActions.setAppointments) });
  }

  setAppointment(appointmentFormValues: AppointmentFormData): Promise<boolean> {
    const appointment: Appointment = {
      appointmentID: appointmentFormValues.appointmentID
        ? appointmentFormValues.appointmentID
        : this.angularFirestore.createId(),
      dentist: {
        lastName: appointmentFormValues.dentist.lastName,
        name: appointmentFormValues.dentist.name,
        phoneNumber: appointmentFormValues.dentist.phoneNumber,
        userID: appointmentFormValues.dentist.userID
      },
      patient: {
        lastName: appointmentFormValues.patient.lastName,
        name: appointmentFormValues.patient.name,
        phoneNumber: appointmentFormValues.patient.phoneNumber,
        userID: appointmentFormValues.patient.userID
      },
      title: `${appointmentFormValues.patient.name} ${appointmentFormValues.patient.lastName}`,
      description: appointmentFormValues.description,
      dueDate: appointmentFormValues.dueDate,
      startTime: appointmentFormValues.time[0],
      endTime: appointmentFormValues.time[1] ? appointmentFormValues.time[1] : appointmentFormValues.time[0],
      lastUpdate: appointmentFormValues.lastUpdate,
      status: appointmentFormValues.status
    };
    return new Promise(resolve => {
      this.angularFirestore
        .collection('appointments')
        .doc(appointment.appointmentID)
        .set(appointment)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  cancelAppointment(appointmentID: string): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('appointments')
        .doc(appointmentID)
        .set({ status: 'cancelled' }, { merge: true })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  completelAppointment(appointmentID: string): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('appointments')
        .doc(appointmentID)
        .set({ status: 'completed' }, { merge: true })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  ngOnDestroy(): void {
    if (this.appointmentsSubscription) {
      this.appointmentsSubscription.unsubscribe();
    }
  }
}

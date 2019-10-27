import { User } from './user.model';

export interface Appointment {
  appointmentID: string;
  dueDate: any;
  startTime: any;
  endTime?: any;
  lastUpdate: any;
  patient: {
    name: string;
    lastName: string;
    uid: string;
    phoneNumber: string;
  };
  dentist: {
    name: string;
    lastName: string;
    uid: string;
    phoneNumber: string;
  };
  title: string;
  description: string;
  status: string;
}

export interface AppointmentFormData {
  appointmentID: string;
  patient: User;
  dentist: User;
  dueDate: Date;
  time: Date[];
  status: string;
  lastUpdate: Date;
  title: string;
  description: string;
}

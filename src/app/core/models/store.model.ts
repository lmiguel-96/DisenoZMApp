import { EventInput } from '@fullcalendar/core';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { User } from '@app/core/models/user.model';
import { Service, ServiceCategory } from './service.model';

export interface StoreState {
  appointments: EventInput[];
  appointmentsDateRange: { activeStart: DateInput; activeEnd: DateInput };
  user: User;
  isAuthenticated: boolean;
  services: Service[];
  servicesCategories: ServiceCategory[];
}

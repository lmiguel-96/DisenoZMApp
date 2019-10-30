import { EventInput } from '@fullcalendar/core';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { User } from '@app/core/models/user.model';
import { Service, ServiceCategory } from './service.model';
import { UserRole } from './user-roles.model';

export interface StoreState {
  appointments: EventInput[];
  appointmentsDateRange: { activeStart: DateInput; activeEnd: DateInput };
  currentUser: User;
  isAuthenticated: boolean;
  services: Service[];
  servicesCategories: ServiceCategory[];
  registeredUsers: User[];
  userRoles: UserRole[];
}

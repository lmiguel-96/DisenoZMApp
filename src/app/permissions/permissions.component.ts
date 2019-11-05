import { Component } from '@angular/core';

@Component({
  selector: 'dzm-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent {
  navLinks = [
    {
      label: 'Permisos',
      path: '/users/permissions'
    },
    {
      label: 'Odontólogos',
      path: '/users/dentists'
    }
  ];

  constructor() {}
}

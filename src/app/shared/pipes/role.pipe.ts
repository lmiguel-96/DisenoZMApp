import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(role: number[]): string {
    const USER_ROLES = ['administrador', 'operador', 'paciente', 'odontólogo'];
    if (role !== null) {
      return role.map(ID => USER_ROLES[ID]).join(', ');
    }
  }
}

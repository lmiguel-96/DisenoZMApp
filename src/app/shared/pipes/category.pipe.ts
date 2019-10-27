import { Pipe, PipeTransform } from '@angular/core';
import { ServiceCategory } from '@app/core/models/service.model';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {
  transform(serviceCategories: ServiceCategory[]): string {
    if (serviceCategories !== null) {
      return serviceCategories.map(({ name }) => name).join(', ');
    } else {
      return '';
    }
  }
}

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Service } from '@app/core/models/service.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ServicesService } from './services.service';
import { catchError, finalize } from 'rxjs/operators';

export class ServicesDataSource implements DataSource<Service> {
  servicesSubject = new BehaviorSubject<Service[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private servicesService: ServicesService) {}

  connect(collectionViewer: CollectionViewer): Observable<Service[]> {
    this.getServices();
    return this.servicesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.servicesSubject.complete();
    this.loadingSubject.complete();
  }

  getServices() {
    this.loadingSubject.next(true);
    this.servicesService
      .fetchServices()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(this.servicesSubject);
  }
}

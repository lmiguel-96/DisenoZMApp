import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, Subscription, of } from 'rxjs';
import { Service, ServiceCategory } from '@app/core/models/service.model';
import { map, catchError } from 'rxjs/operators';
import { ObservableStore } from '@codewithdan/observable-store';
import { StoreState } from '@app/core/models/store.model';

export enum ServicesStoreActions {
  setServices = 'ADD_SERVICES',
  setServicesCategories = 'ADD_SERVICES_CATEGORIES',
  setInitialStateServices = 'INITIAL_STATE_SERVICES'
}

const INITIAL_STATE = {
  services: [],
  servicesCategories: []
} as StoreState;

@Injectable({
  providedIn: 'root'
})
export class ServicesService extends ObservableStore<StoreState> {
  serviceDataSubscription: Subscription;
  constructor(private angularFirestore: AngularFirestore) {
    super({});
    this.setState(INITIAL_STATE, ServicesStoreActions.setInitialStateServices);
  }

  getServiceData(): void {
    // tslint:disable-next-line: curly
    if (this.serviceDataSubscription) this.serviceDataSubscription.unsubscribe();
    this.serviceDataSubscription = combineLatest([this.fetchServices(), this.fetchServiceCategories()])
      .pipe(catchError(() => of([[], []])))
      .subscribe({
        next: ([services, servicesCategories]) => {
          this.setState({ services }, ServicesStoreActions.setServices);
          this.setState({ servicesCategories }, ServicesStoreActions.setServicesCategories);
        }
      });
  }

  setService(service: Service): Promise<boolean> {
    const currentService: Service = {
      ...service,
      serviceID: service.serviceID ? service.serviceID : this.angularFirestore.createId()
    };
    return new Promise(resolve => {
      this.angularFirestore
        .collection('servicios')
        .doc(currentService.serviceID)
        .set(currentService)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  deleteService({ serviceID }: Service): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('servicios')
        .doc(serviceID)
        .delete()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private fetchServices(): Observable<Service[]> {
    return this.angularFirestore
      .collection('servicios')
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs.map(services => {
            const service = services.payload.doc.data() as Service;
            return {
              ...service,
              serviceID: services.payload.doc.id,
              categories: Object.entries(service.categories).map(([key, value]) => {
                return { serviceCategoryID: key, img: '', description: '', ...value } as ServiceCategory;
              })
            } as Service;
          })
        )
      );
  }

  private fetchServiceCategories(): Observable<ServiceCategory[]> {
    return this.angularFirestore
      .collection('servicesCategory')
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs.map(serviceCategory => {
            return {
              ...serviceCategory.payload.doc.data(),
              serviceCategoryID: serviceCategory.payload.doc.id
            } as ServiceCategory;
          })
        )
      );
  }
}

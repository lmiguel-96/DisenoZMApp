import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Service, ServiceCategory } from '@app/core/models/service.model';
import { map } from 'rxjs/operators';
import { ObservableStore } from '@codewithdan/observable-store';
import { StoreState } from '@app/core/models/store.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService extends ObservableStore<StoreState> {
  constructor(private angularFirestore: AngularFirestore) {
    super({
      trackStateHistory: true
    });
  }

  fetchServices(): Observable<Service[]> {
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

  fetchServiceCategories(): Observable<ServiceCategory[]> {
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

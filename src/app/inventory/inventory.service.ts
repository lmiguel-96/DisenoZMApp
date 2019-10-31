import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ObservableStore } from '@codewithdan/observable-store';
import { StoreState } from '@app/core/models/store.model';
import { Resource, ResourceCategory } from '@app/core/models/resource.model';

export enum ServicesStoreActions {
  setResources = 'ADD_RESOURCES',
  setResourcesCategories = 'ADD_RESOURCES_CATEGORIES',
  setInitialStateResources = 'INITIAL_STATE_INVENTORY'
}

const INITIAL_STATE = {
  resources: [],
  resourcesCategories: []
} as StoreState;

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends ObservableStore<StoreState> {
  serviceDataSubscription: Subscription;
  constructor(private angularFirestore: AngularFirestore) {
    super({});
    this.setState(INITIAL_STATE, ServicesStoreActions.setInitialStateResources);
  }

  getInventoryData(): void {
    // tslint:disable-next-line: curly
    if (this.serviceDataSubscription) this.serviceDataSubscription.unsubscribe();
    this.serviceDataSubscription = combineLatest([this.fetchResources(), this.fetchResourceCategories()])
      .pipe(catchError(() => of([[], []])))
      .subscribe({
        next: ([resources, resourcesCategories]) => {
          this.setState({ resources }, ServicesStoreActions.setResources);
          this.setState({ resourcesCategories }, ServicesStoreActions.setResourcesCategories);
        }
      });
  }

  setResource(resource: Resource): Promise<boolean> {
    const currentResource: Resource = {
      ...resource,
      categories: resource.categories
        .map((category: any) => {
          return [category.resourceCategoryID, category];
        })
        .reduce((categories: { [key: string]: ResourceCategory }, [key, value]: [string, ResourceCategory]) => {
          categories[key] = value;
          return categories;
        }, {}),
      resourceID: resource.resourceID ? resource.resourceID : this.angularFirestore.createId()
    };
    return new Promise(resolve => {
      this.angularFirestore
        .collection('resources')
        .doc(currentResource.resourceID)
        .set(currentResource)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  deleteResource({ resourceID }: Resource): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('resources')
        .doc(resourceID)
        .delete()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private fetchResources(): Observable<Resource[]> {
    return this.angularFirestore
      .collection('resources')
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs.map(resources => {
            const resource = resources.payload.doc.data() as Resource;
            return {
              ...resource,
              resourceID: resources.payload.doc.id,
              categories: Object.entries(resource.categories).map(([key, value]) => {
                return { resourceCategoryID: key, img: '', description: '', ...value } as ResourceCategory;
              })
            } as Resource;
          })
        )
      );
  }

  private fetchResourceCategories(): Observable<ResourceCategory[]> {
    return this.angularFirestore
      .collection('resourcesCategories')
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs.map(resourceCategory => {
            return {
              ...resourceCategory.payload.doc.data(),
              resourceCategoryID: resourceCategory.payload.doc.id
            } as ResourceCategory;
          })
        )
      );
  }
}

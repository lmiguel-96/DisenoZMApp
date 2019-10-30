import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/notification.service';
import { ServicesService } from '../services.service';
import { Service, ServiceCategory } from '@app/core/models/service.model';
import { BehaviorSubject } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';

/**
 * IN ORDER TO DETERMINATE WETHER THE DIALOG IS CREATING OR EDITING AN EVENT, IT ACTUALLY RELIES ON
 * THE EXISTENCE OF 'service' FOR EDITION AND THE OPPOSITE FOR CREATION
 */
interface DialogData {
  service?: Service;
}

@Component({
  selector: 'dzm-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceDialogComponent {
  serviceForm = this.createServiceForm(this.data);
  isLoading = new BehaviorSubject<boolean>(false);
  servicesCategories$ = this.servicesService.stateChanged.pipe(
    filter((state: StoreState) => Boolean(state && state.servicesCategories)),
    pluck('servicesCategories')
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    private servicesService: ServicesService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {}

  handleCloseDialog(): void {
    this.dialogRef.close();
  }

  createServiceForm({ service }: DialogData = this.data): FormGroup {
    const form = this.formBuilder.group({
      serviceID: null,
      name: [null, Validators.required],
      description: [null],
      categories: [null, Validators.required],
      price: [null, Validators.required]
    });
    if (service) {
      form.patchValue(service);
    }
    return form;
  }

  handleSetService(serviceForm: FormGroup): void {
    if (serviceForm.valid) {
      this.isLoading.next(true);
      this.servicesService
        .setService(serviceForm.value)
        .then(wasSet => {
          this.notificationService.serviceCreated(wasSet);
          if (wasSet) {
            this.handleCloseDialog();
          }
        })
        .finally(() => this.isLoading.next(false));
    } else {
      serviceForm.markAllAsTouched();
    }
  }

  trackByCategory(index: number, serviceCategory: ServiceCategory): string {
    return serviceCategory.serviceCategoryID;
  }

  compareServiceCategory(serviceOne: ServiceCategory, serviceTwo: ServiceCategory): boolean {
    if (serviceOne !== null && serviceTwo !== null) {
      return serviceOne.serviceCategoryID === serviceTwo.serviceCategoryID;
    }
  }
}

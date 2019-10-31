import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/notification.service';
import { InventoryService } from '../inventory.service';
import { BehaviorSubject } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';
import { Resource, ResourceCategory } from '@app/core/models/resource.model';

/**
 * IN ORDER TO DETERMINATE WETHER THE DIALOG IS CREATING OR EDITING AN EVENT, IT ACTUALLY RELIES ON
 * THE EXISTENCE OF 'service' FOR EDITION AND THE OPPOSITE FOR CREATION
 */
interface DialogData {
  resource?: Resource;
}

@Component({
  selector: 'dzm-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryDialogComponent {
  resourceForm = this.createResourceForm(this.data);
  isLoading = new BehaviorSubject<boolean>(false);
  resourcesCategories$ = this.inventoryService.stateChanged.pipe(
    filter((state: StoreState) => Boolean(state && state.resourcesCategories)),
    pluck('resourcesCategories')
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<InventoryDialogComponent>,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {}

  handleCloseDialog(): void {
    this.dialogRef.close();
  }

  createResourceForm({ resource }: DialogData = this.data): FormGroup {
    const form = this.formBuilder.group({
      name: [null, Validators.required],
      resourceID: null,
      categories: [null, Validators.required],
      description: [null],
      currentStock: [null, Validators.required],
      price: [null, Validators.required],
      min: [null, Validators.required],
      max: [null, Validators.required],
      unit: [null, Validators.required]
    });
    if (resource) {
      form.patchValue(resource);
    }
    return form;
  }

  handleSetResource(resourceForm: FormGroup): void {
    if (resourceForm.valid) {
      this.isLoading.next(true);
      this.inventoryService
        .setResource(resourceForm.value)
        .then(wasSet => {
          this.notificationService.resourceCreated(wasSet);
          if (wasSet) {
            this.handleCloseDialog();
          }
        })
        .finally(() => this.isLoading.next(false));
    } else {
      resourceForm.markAllAsTouched();
    }
  }

  trackByCategory(index: number, serviceCategory: ResourceCategory): string {
    return serviceCategory.resourceCategoryID;
  }

  compareResourceCategory(resourceOne: ResourceCategory, resourceTwo: ResourceCategory): boolean {
    if (resourceOne !== null && resourceTwo !== null) {
      return resourceOne.resourceCategoryID === resourceTwo.resourceCategoryID;
    }
  }
}

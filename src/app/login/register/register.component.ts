import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NotificationService } from '@app/core/notification.service';

interface IRegisterForm {
  name: string;
  lastName: string;
  email: string;
  phoneOperator: string;
  phoneNumber: string;
  cedula: string;
  password: string;
}

@Component({
  selector: 'dzm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [NotificationService]
})
export class RegisterComponent {
  @Output() handleLoginRequest = new EventEmitter<void>();
  operators = ['0412', '0414', '0424', '0416', '0426'];
  registerForm = this.createRegisterForm();

  constructor(
    private formBuilder: FormBuilder,
    private angularFireFunctions: AngularFireFunctions,
    private notificationService: NotificationService
  ) {}

  createRegisterForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      phoneOperator: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      cedula: [null, Validators.required],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  handleRegisterSubmit({ name, lastName, phoneOperator, phoneNumber, email, cedula, password }: IRegisterForm): void {
    const callable$ = this.angularFireFunctions.httpsCallable('createUser');
    callable$({
      name,
      lastName,
      email,
      password,
      cedula,
      phoneNumber: phoneOperator.concat(phoneNumber)
    }).subscribe({
      next: response => {
        switch (response.code) {
          case 200:
            this.handleLoginRequest.emit();
            this.notificationService.userRegistered(true);
            break;
          default:
            this.notificationService.userRegistered(false);
        }
      }
    });
  }
}

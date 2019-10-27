import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar) {}

  loggedOut(): void {
    this.matSnackBar.open('Sesión cerrada exitosamente', 'Aceptar', {
      politeness: 'polite'
    });
  }

  appointmentCreated(wasSuccesful: boolean): void {
    if (wasSuccesful) {
      this.matSnackBar.open('¡Cita agendada exitosamente!', 'Aceptar', {
        politeness: 'polite'
      });
    } else {
      this.matSnackBar.open(
        'Upss algo salió mal y la cita no pudo ser agendada, por favor intenta nuevamente',
        'Aceptar',
        {
          politeness: 'assertive'
        }
      );
    }
  }

  appointmentCancelled(wasSuccesful: boolean): void {
    if (wasSuccesful) {
      this.matSnackBar.open('Cita cancelada exitosamente', 'Aceptar', {
        politeness: 'polite'
      });
    } else {
      this.matSnackBar.open(
        'Upss algo salió mal y el estatus de la cita no pudo ser actualizado, por favor intenta nuevamente',
        'Aceptar',
        {
          politeness: 'assertive'
        }
      );
    }
  }

  appointmentCompleted(wasSuccesful: boolean): void {
    if (wasSuccesful) {
      this.matSnackBar.open('Cita marcada como completada exitosamente', 'Aceptar', {
        politeness: 'polite'
      });
    } else {
      this.matSnackBar.open(
        'Upss algo salió mal y el estatus de la cita no pudo ser actualizado, por favor intenta nuevamente',
        'Aceptar',
        {
          politeness: 'assertive'
        }
      );
    }
  }
}

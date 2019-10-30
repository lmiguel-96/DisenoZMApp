import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar) {}

  loggedOut(): void {
    this.matSnackBar.open('Sesión cerrada exitosamente', 'Aceptar', {
      politeness: 'polite'
    });
  }

  userBanned(): void {
    this.matSnackBar.open(
      `Tu cuenta fue deshabilitada, si crees que hubo un error por favor contacta al administrador`,
      'Aceptar',
      {
        politeness: 'assertive'
      }
    );
  }

  userStatusUpdated(wasSuccesful: boolean) {
    const message = wasSuccesful
      ? 'Estatus del usuario actualizado exitosamente'
      : `Ocurrió un error y no pudo ser actualizado el estatus del usuario,
      por favor verifica tu conexión e intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'assertive'
    });
  }

  serviceCreated(wasSuccesful: boolean): void {
    if (wasSuccesful) {
      this.matSnackBar.open('¡Servicio actualizado exitosamente!', 'Aceptar', {
        politeness: 'polite'
      });
    } else {
      this.matSnackBar.open(
        'Upss algo salió mal y el servicio no pudo ser actualizado, por favor intenta nuevamente',
        'Aceptar',
        {
          politeness: 'assertive'
        }
      );
    }
  }

  serviceDeleted(wasSuccesful: boolean): void {
    if (wasSuccesful) {
      this.matSnackBar.open('Servicio eliminado exitosamente', 'Aceptar', {
        politeness: 'polite'
      });
    } else {
      this.matSnackBar.open(
        'Upss algo salió mal y el servicio no pudo ser eliminado, por favor intenta nuevamente',
        'Aceptar',
        {
          politeness: 'assertive'
        }
      );
    }
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

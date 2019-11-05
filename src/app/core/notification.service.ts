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
      `Tu cuenta está desactivada, si crees que hubo un error o eres un nuevo usuario,
      por favor contacta al administrador`,
      'Aceptar',
      {
        politeness: 'assertive'
      }
    );
  }

  userRegistered(wasSuccesful: boolean) {
    const message = wasSuccesful
      ? '¡Usuario registrado exitosamente!'
      : `Ocurrió un error y no pudo ser completado el registro,
      por favor verifica tu conexión e intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'assertive'
    });
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

  userRecoveryPasswordSent(wasSuccesful: boolean, email: string) {
    const message = wasSuccesful
      ? `Será enviado un correo electrónico con las instrucciones para recuperar la contraseña
      al correo electrónico ${email}`
      : `Ocurrió un error y no pudo ser enviado el correo de recuperación de contraseña,
      por favor verifica tu conexión e intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'assertive'
    });
  }

  userRoleUpdated(wasSuccesful: boolean) {
    const message = wasSuccesful
      ? 'El nivel de acceso del usuario actualizado exitosamente'
      : `Ocurrió un error y no pudo ser actualizado el nivel de acceso del usuario,
      por favor verifica tu conexión e intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'assertive'
    });
  }

  resourceCreated(wasSuccesful: boolean): void {
    const message = wasSuccesful
      ? '¡Item actualizado exitosamente!'
      : `Upss algo salió mal y el item no pudo ser actualizado, por favor intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'polite'
    });
  }

  resourceDeleted(wasSuccesful: boolean): void {
    const message = wasSuccesful
      ? '¡Item eliminado exitosamente!'
      : `Upss algo salió mal y el item no pudo ser eliminado, por favor intenta nuevamente`;
    this.matSnackBar.open(message, 'Aceptar', {
      politeness: 'polite'
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

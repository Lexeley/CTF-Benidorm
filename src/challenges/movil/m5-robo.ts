import type { Challenge } from '../../core/types';
import { orderList } from '../widgets';

export const m5: Challenge = {
  id: 'm5',
  title: '¡Me han robado el móvil!',
  difficulty: 'medio',
  story: [
    'A Lucía le han quitado el móvil en el metro. Está nerviosa y su amiga le presta el suyo.',
    'Ordena estos 6 pasos del primero al último.',
  ],
  render(el, ctx) {
    el.append(orderList(ctx, [
      { key: 'A', text: 'Cambiar la contraseña del correo principal y cerrar las sesiones abiertas en el móvil robado.' },
      { key: 'B', text: 'Si ya no hay forma de recuperarlo, borrarlo todo en remoto.' },
      { key: 'C', text: 'Avisar a sus contactos de que pueden recibir mensajes falsos en su nombre.' },
      { key: 'D', text: 'Desde otro dispositivo, localizar el móvil y bloquearlo en remoto con un mensaje de contacto en pantalla.' },
      { key: 'E', text: 'Poner la denuncia en comisaría aportando el IMEI (está en la caja o la factura).' },
      { key: 'F', text: 'Llamar a la operadora para bloquear la SIM y pedir que bloqueen el IMEI.' },
    ]));
  },
  hints: [
    'Primero, lo que solo funciona mientras el móvil sigue encendido y localizable. Borrar en remoto hace que ya no puedas localizarlo.',
    'Orden lógico: localizar/bloquear → proteger cuentas → cortar la SIM → borrar → denunciar → avisar a la gente.',
  ],
  answerHelp: 'Las 6 letras en orden (ej.: ABCDEF).',
  lesson: 'Bloquear y localizar es lo urgente (el ladrón suele apagarlo pronto). Después, protege tu correo (es la llave de todas tus cuentas) y la SIM (para que no reciban tus códigos por SMS). Borrar es el último recurso porque impide seguir localizándolo.',
  tip: 'Activa hoy «Encontrar mi dispositivo», un bloqueo de pantalla con PIN y apunta el IMEI (*#06#) en un lugar seguro.',
};

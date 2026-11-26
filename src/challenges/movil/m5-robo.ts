import type { Challenge } from '../../core/types';
import { orderList } from '../widgets';

export const m5: Challenge = {
  id: 'm5',
  title: '¡Me han robado el móvil!',
  difficulty: 'dificil',
  category: 'Respuesta a incidentes',
  story: [
    'A Laura le han quitado el móvil en el metro. Está nerviosa y su amiga le presta el suyo.',
    'Ordena del primero al último SOLO los pasos que sí debería hacer. Dos de ellos son una mala idea: déjalos al final y no los pongas en la respuesta.',
  ],
  render(el, ctx) {
    el.append(orderList(ctx, [
      { key: 'A', text: 'Cambiar la contraseña del correo principal y cerrar las sesiones abiertas en el móvil robado.' },
      { key: 'B', text: 'Si ya no hay forma de recuperarlo, borrarlo todo en remoto.' },
      { key: 'C', text: 'Avisar a sus contactos de que pueden recibir mensajes falsos en su nombre.' },
      { key: 'D', text: 'Desde otro dispositivo, localizar el móvil y bloquearlo en remoto con un mensaje de contacto en pantalla.' },
      { key: 'E', text: 'Poner la denuncia en comisaría aportando el IMEI (está en la caja o la factura).' },
      { key: 'F', text: 'Llamar a la operadora para bloquear la SIM y pedir que bloqueen el IMEI.' },
      { key: 'G', text: 'Entrar en el enlace del SMS que le llega al día siguiente: «Encontrar mi dispositivo: tu móvil ha sido localizado. Inicia sesión para verlo en el mapa».' },
      { key: 'H', text: 'Quitar el móvil robado de su cuenta de Google para que no quede asociado a ella.' },
    ]));
  },
  hints: [
    'Tras un robo llegan SMS falsos para que el dueño meta su contraseña y el ladrón pueda desbloquear el móvil. Y si lo quitas de tu cuenta, el bloqueo de activación desaparece y el ladrón lo puede reactivar.',
    'Primero, lo que solo funciona mientras el móvil está encendido y localizable; borrar en remoto impide seguir localizándolo, así que va casi al final. Antes de cortar la SIM, protege el correo.',
  ],
  answerHelp: 'Las 6 letras de los pasos correctos, en orden (ej.: ABCDEF).',
  lesson: 'Bloquear y localizar es lo urgente (el ladrón suele apagarlo pronto). Después, protege tu correo (es la llave de todas tus cuentas) y la SIM (para que no reciban tus códigos por SMS). Borrar es el último recurso porque impide seguir localizándolo. Nunca lo quites de tu cuenta (se pierde el bloqueo de activación) y desconfía de los SMS de «hemos localizado tu móvil».',
  tip: 'Activa hoy «Encontrar mi dispositivo», un bloqueo de pantalla con PIN y apunta el IMEI (*#06#) en un lugar seguro.',
};

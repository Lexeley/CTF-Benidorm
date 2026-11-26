import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { pickList } from '../widgets';

const item = (area: string, setting: string, value: string) =>
  h('span', {}, h('span', { class: 'muted' }, `${area} / `), `${setting}: `, h('strong', {}, value));

export const e7: Challenge = {
  id: 'e7',
  title: 'Auditoría rápida',
  difficulty: 'facil',
  bonus: true,
  story: [
    'Captura de «Seguridad de Windows» y de la configuración del portátil de Laura (simulada).',
    'Marca TODOS los ajustes mal configurados. No te diremos cuántos hay.',
  ],
  render(el, ctx) {
    el.append(h('div', { class: 'card' },
      h('h3', {}, 'Seguridad de Windows'),
      pickList(ctx, 'Ajustes mal configurados', [
        { key: 'A', node: item('Antivirus', 'Último análisis rápido', 'hace 2 días, 0 amenazas') },
        { key: 'B', node: item('Antivirus', 'Protección en tiempo real', 'Desactivada por el usuario hace 21 días') },
        { key: 'C', node: item('Firewall', 'Red privada', 'Activado') },
        { key: 'D', node: item('Cuenta', 'Bloqueo de pantalla', 'A los 5 minutos de inactividad') },
        { key: 'E', node: item('Firewall', 'Red pública', 'Desactivado') },
        { key: 'F', node: item('Navegador', 'SmartScreen (webs y descargas peligrosas)', 'Activado') },
        { key: 'G', node: item('Windows Update', 'Estado', 'En pausa, última instalación hace 64 días') },
        { key: 'H', node: item('Copia de seguridad', 'OneDrive: Documentos', 'Sincronizado ayer') },
        { key: 'I', node: item('Cuenta', 'Inicio de sesión', 'PIN de 6 dígitos + contraseña') },
        { key: 'J', node: item('Control de cuentas (UAC)', 'Avisar cuando una app quiera hacer cambios', 'No notificarme nunca') },
      ])));
  },
  hints: [
    'Piensa en las capas básicas: antivirus funcionando, firewall en todas las redes, sistema actualizado y que nada se instale sin preguntarte.',
    'Hay 4. Uno de ellos no está en el antivirus ni en el firewall ni en las actualizaciones.',
  ],
  answerHelp: 'Las letras en orden alfabético (ej.: ACF).',
  lesson: 'Antivirus en tiempo real, firewall en todas las redes, actualizaciones al día y UAC avisando cierran la mayoría de puertas a los ataques automáticos. Si el UAC no avisa, cualquier programa puede tocar el sistema sin que te enteres.',
  tip: 'Revisa hoy Seguridad de Windows: antivirus activo, firewall encendido, actualizaciones sin pausar y UAC en su nivel por defecto.',
};

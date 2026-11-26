import type { Challenge } from '../../core/types';
import { h } from '../../ui/dom';
import { pickList } from '../widgets';

const OUT = String.raw`PS C:\Users\laura> Get-MpComputerStatus | Select AMServiceEnabled, RealTimeProtectionEnabled, AntivirusSignatureAge, QuickScanAge
AMServiceEnabled          : True
RealTimeProtectionEnabled : False
AntivirusSignatureAge     : 0
QuickScanAge              : 2

PS C:\Users\laura> netsh advfirewall show allprofiles state
Configuración Perfil de dominio:
Estado                                ACTIVAR
Configuración Perfil privado:
Estado                                ACTIVAR
Configuración Perfil público:
Estado                                DESACTIVAR

PS C:\Users\laura> Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System | Select EnableLUA, ConsentPromptBehaviorAdmin
EnableLUA                  : 1
ConsentPromptBehaviorAdmin : 0

PS C:\Users\laura> Get-ItemProperty HKLM:\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings | Select PauseUpdatesExpiryTime
PauseUpdatesExpiryTime : 2026-12-30T00:00:00Z

PS C:\Users\laura> Get-HotFix | Sort-Object InstalledOn | Select-Object -Last 1 HotFixID, InstalledOn
HotFixID   InstalledOn
--------   -----------
KB5062553  14/07/2026

PS C:\Users\laura> Get-LocalUser | Select Name, Enabled
Name               Enabled
----               -------
Administrador      False
Invitado           True
laura              True

PS C:\Users\laura> Get-LocalGroupMember Administradores | Select Name
Name
----
PORTATIL-LAURA\Administrador

PS C:\Users\laura> Get-Date
sábado, 3 de octubre de 2026 19:02:11`;

export const e7: Challenge = {
  id: 'e7',
  title: 'Auditoría por consola',
  difficulty: 'medio',
  bonus: true,
  story: [
    'Has abierto PowerShell en el portátil de Laura y has lanzado unos cuantos comandos. Esta es la salida.',
    'Marca qué áreas están mal configuradas. No te decimos cuántas.',
  ],
  render(el, ctx) {
    el.append(h('pre', { 'aria-label': 'Salida de PowerShell' }, OUT),
      pickList(ctx, 'Áreas mal configuradas', [
        { key: 'A', node: h('span', {}, 'Servicio antivirus') },
        { key: 'B', node: h('span', {}, 'Protección en tiempo real') },
        { key: 'C', node: h('span', {}, 'Firmas del antivirus') },
        { key: 'D', node: h('span', {}, 'Firewall: perfil privado') },
        { key: 'E', node: h('span', {}, 'Firewall: perfil de dominio') },
        { key: 'F', node: h('span', {}, 'Firewall: perfil público') },
        { key: 'G', node: h('span', {}, 'Control de cuentas (UAC) para administradores') },
        { key: 'H', node: h('span', {}, 'Actualizaciones de Windows') },
        { key: 'I', node: h('span', {}, 'Cuentas locales') },
        { key: 'J', node: h('span', {}, 'Laura usa una cuenta de administrador a diario') },
      ]));
  },
  hints: [
    'ConsentPromptBehaviorAdmin = 0 significa «elevar sin preguntar». Compara la fecha del último parche y la de pausa con la fecha de hoy.',
    'Son 5. Mira bien qué cuentas están habilitadas y quién está realmente en el grupo Administradores.',
  ],
  answerHelp: 'Las letras en orden alfabético (ej.: ACF).',
  lesson: 'La configuración real no siempre se ve en la pantalla bonita: con unos pocos comandos se audita un equipo. Aquí fallaban la protección en tiempo real, el firewall público, el UAC (cualquier programa obtiene permisos sin preguntar), las actualizaciones (casi 3 meses sin parches y pausadas) y la cuenta Invitado activa. Que Laura no sea administradora es correcto.',
  tip: 'Revisa hoy Seguridad de Windows: antivirus activo, firewall encendido, actualizaciones sin pausar, UAC por defecto y cuenta Invitado desactivada.',
};

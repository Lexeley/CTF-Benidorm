import { h } from './dom';

// figlet "standard"
const ART = [
  ' _        _    _   _ ____      _',
  '| |      / \\  | | | |  _ \\    / \\',
  '| |     / _ \\ | | | | |_) |  / _ \\',
  '| |___ / ___ \\| |_| |  _ <  / ___ \\',
  '|_____/_/   \\_\\\\___/|_| \\_\\/_/   \\_\\',
].join('\n');

export const logo = (small = false) => h('pre', { class: `logo${small ? ' small' : ''}`, 'aria-label': 'LAURA', role: 'img' }, ART);

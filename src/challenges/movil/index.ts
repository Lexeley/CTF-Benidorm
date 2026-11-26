import type { Challenge } from '../../core/types';
import { m1 } from './m1-permisos';
import { m2 } from './m2-tienda';
import { m3 } from './m3-smishing';
import { m4 } from './m4-wifi';
import { m5 } from './m5-robo';
import { m6 } from './m6-ubicacion';
import { m7 } from './m7-manchas';

export const movil: Challenge[] = [m1, m2, m3, m4, m5, m6, m7];

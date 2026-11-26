import { describe, expect, it } from 'vitest';
import { b64decode, b64encode, caesar, hashType, hexDecode, hexEncode, inspectUrl, toDms, urlDecode } from '../src/kit/codec';

describe('Kit', () => {
  it('base64 / hex con UTF-8', () => {
    expect(b64decode(b64encode('Ñandú ✓'))).toBe('Ñandú ✓');
    expect(hexDecode(hexEncode('hola'))).toBe('hola');
    expect(hexEncode('A')).toBe('41');
    expect(hexDecode('0x68 0x69')).toBe('hi');
  });
  it('url y césar', () => {
    expect(urlDecode('Kira%2A2025+x')).toBe('Kira*2025 x');
    expect(caesar('Hola, Zz', 3)).toBe('Krod, Cc');
    expect(caesar(caesar('secreto', 7), -7)).toBe('secreto');
  });
  it('tipo de hash', () => {
    expect(hashType('e10adc3949ba59abbe56e057f20f883e')).toBe('MD5');
    expect(hashType('xyz')).toBeNull();
  });
  it('inspector de URL', () => {
    const i = inspectUrl('https://banconorte.es.verificacion-cuentas.net/login?x=1');
    expect(i.registrable).toBe('verificacion-cuentas.net');
    expect(i.subdomain).toBe('banconorte.es');
    expect(i.warnings.length).toBeGreaterThan(0);
    expect(inspectUrl('https://www.ejemplo.com.es/a').registrable).toBe('ejemplo.com.es');
    expect(inspectUrl('http://x.es').warnings.some((w) => w.includes('http'))).toBe(true);
  });
  it('coordenadas en GMS', () => {
    expect(toDms(40.424, 'N', 'S')).toBe(`40° 25' 26.4" N`);
  });
});

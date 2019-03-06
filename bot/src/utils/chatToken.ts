export function encode(num: string | number) {
  num = Number(num);
  return num.toString(32).replace('-', 'G');
}

export function decode(encoded: string) {
  return parseInt(encoded.replace('G', '-'), 32);
}

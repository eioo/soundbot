import Hashids from 'hashids';

const hashids = new Hashids('soundbot', 0, 'abcdefghijklmnopqrstuvwxyz');

export function encode(text: string | number) {
  text = text.toString();
  const pathNameNums = Array.from(text).map(x => (x === '-' ? 10 : Number(x)));
  return hashids.encode(pathNameNums);
}

export function decode(hash: string) {
  return hashids
    .decode(hash)
    .map(num => (num === 10 ? '-' : num.toString()))
    .join('');
}

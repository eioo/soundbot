/* tslint:disable:no-console */
export function info(message: string) {
  const date = new Date().toLocaleString();

  console.log(`[\x1b[1m\x1b[36mINFO\x1b[0m] \x1b[34m${date}\x1b[0m`, message);
}

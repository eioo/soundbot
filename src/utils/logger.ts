/* tslint:disable:no-console */
const RESET = '\x1b[0m';
const BRIGHT = '[\x1b[1m';
const CYAN = '\x1b[36m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';

function log(
  name: string,
  color: string,
  data?: any,
  ...optionalParams: any[]
) {
  const date = new Date().toLocaleString();

  console.log(
    `${BRIGHT}${color}${name}${RESET}] ${BLUE}${date}${RESET}`,
    data,
    ...optionalParams
  );
}

export function info(data?: any, ...optionalParams: any[]) {
  log('INFO', CYAN, data, ...optionalParams);
}

export function message(data?: any, ...optionalParams: any[]) {
  log('MSG', YELLOW, data, ...optionalParams);
}

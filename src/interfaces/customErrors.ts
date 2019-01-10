import { CustomError } from 'ts-custom-error';

export class EnvError extends CustomError {
  constructor(public message: string) {
    super(message);
  }
}

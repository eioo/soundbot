import { CustomError } from 'ts-custom-error';

export class BotError extends CustomError {
  constructor(public message: string) {
    super(message);
  }
}

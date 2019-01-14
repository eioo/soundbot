declare module 'telegram-test' {
  import * as TelegramBot from 'node-telegram-bot-api';

  class TelegramTest {
    constructor(telegramBot: TelegramBot);
    public sendUpdate: (
      chatId: number,
      data: any
    ) => Promise<TelegramBot.Message>;
  }

  export = TelegramTest;
}

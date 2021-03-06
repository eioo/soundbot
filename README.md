# Soundbot

Telegram bot which you can send sound to and share with others.

## Requirements

- Node.js
- Yarn
- PostgreSQL database
- FFmpeg (with _libopus_ codec)

## Installation & running

❗️ If you want to use groups make sure to set your bot's **Privacy mode** to **enabled** with @BotFather

1. Make copy of `.env.example` to `.env` and config it.
2. Run following commands:

```
yarn global add npm-run-all
yarn install
yarn start
```

## Commands

- **/sounds** - gives link to sound list
- **/add** - adds a new sound
- **/play _\<sound name>_**
- **/delete _\<sound name>_** - removes sound from your list

## Environment variables

| Key            | Explanation                 |
| -------------- | --------------------------- |
| BOT_TOKEN      | Your Telegram bot token     |
| PG_HOST        | PostgreSQL host             |
| PG_DATABASE    | PostgreSQL database name    |
| PG_USER        | PostgreSQL username         |
| PG_PASSWORD    | PostgreSQL password         |
| TEST_BOT_TOKEN | Bot token for running tests |
| TEST_CHAT_ID   | Chat ID to run tests on     |

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

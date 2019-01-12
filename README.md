# Soundbot

Telegram bot which you can send sound to and share with others.

## Requirements

- Node.js
- PostgreSQL database
- FFmpeg (with _libopus_ codec)

## Installation & running

❗️ Make sure to set your bot's **Privacy mode** to **enabled** with @BotFather

1. Make copy of `.env.example` to `.env` and config it.
2. Run following commands:

```
npm install
npm run start
```

## Commands

- **/add** - adds a new sound
- **/play _\<sound name>_**
- **/list** - lists your sounds
- **/listall** - lists all sounds available
- **/delete _\<sound name>_** - removes sound from your list

## Environment variables

| Key         | Explanation              |
| ----------- | ------------------------ |
| BOT_TOKEN   | Your Telegram bot token  |
| PG_HOST     | PostgreSQL host          |
| PG_DATABASE | PostgreSQL database name |
| PG_USER     | PostgreSQL username      |
| PG_PASSWORD | PostgreSQL password      |

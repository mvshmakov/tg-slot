## Запуск приложения:
#### 0) Перед запуском приложения создайте тестового бота через BotFather в телеге и заберите у него токен,
#### который необходимо вставить в `.env` вместо моего (`TOKEN={your-token}`). Затем необходимо перевести вашего
#### бота через BotFather в inline-режим и создать игру в том же BotFather с shortname `explode`.
#### 1) `cd {path-to-index.js}`
#### 2) `npm i`
#### 3) `npm start`
#### 4) Открыть `localhost:3000` в браузере

## Pull Requests (PR):
#### Делаем PR в develop ветку. Название каждой ветки соответствует названию тикета (DEV-XXX).
#### Заголовок коммита также должен содержать DEV-XXX. Текст сообщения можно любой, но соответствующий issue.
#### Мёрджит Макс. Не обсуждается.

## Процедура PR:
#### 0) Перед коммитом НЕОБХОДИМО убедиться, что ветка верная (DEV-XXX): `git branch`
#### 0-1) Если звёздочка на любой ветке, но не на нужной, то: `git fetch && git checkout {DEV-XXX}`
#### 1) `cd {path-to-index.js}`
#### 2) `git add .`
#### 3) `git commit -m "{message}"`
#### 4) `git push`

## Линки:
#### ClickUp для тасков: https://app.clickup.com/764524/774579
#### GitHub для хранения репозитория: https://github.com/mvshmakov/tg-slot
#### Travis CI для билдов (можно PR и сразу посмотреть статус): https://travis-ci.com/mvshmakov/tg-slot
#### Slack для общения и мониторинга всего: https://telegramslot.slack.com/messages

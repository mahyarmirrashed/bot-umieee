# UMIEEE Discord Bot

This is a bot created using TypeScript and Discord.js for the University of Manitoba Chapter of IEEE Discord server. This bot was developed by Mahyar Mirrashed (Chair 2021-2022) as part of his incoming role during the summer.

## Tasks

- [ ] Look into setting up Heroku branch with basic commands
  - [ ] Only publish `dist/` subtree along with basic items?
- [ ] Look into [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js) for free data persistence
  - [ ] Does it work with local version?
  - [ ] Does it work when pushing working local version to repository branch?
- [ ] Look into [MongoDB cluster](https://www.youtube.com/watch?v=ET8kwosC9fw)
- [ ] Create proper `Procfile`
- [ ] Complete `AddCommand.ts`
- [ ] Complete COTW features
  - [ ] `CreateVote.ts`
  - [ ] `DismantleVote.ts`
  - [ ] `Nominate.ts`
  - [ ] `GetPreviousMonday.ts`
  - [ ] Create CRON jobs to fire
  - [ ] Modify to use `dotenv` using keys added on Heroku
- [ ] Add feature to [schedule messages](https://youtu.be/C3rfFINhMZw?list=PLaxxQQak6D_fxb9_-YsmRwxfw5PH9xALe)
- [ ] Look into adding [TSLint](https://github.com/typescript-eslint/typescript-eslint)

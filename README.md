# elysia-file-router
A (very) simple file based router for Elysia with TSX support


## Installing
To install this package run the following command:
```bash
bun add elysia-file-router
````

## Usage and configuration
```typescript
import { Elysia } from 'elysia'
import { fileRouter } from 'elysia-file-router'

new Elysia()
    .use(fileRouter('./routes'))
    .listen(3000, () => console.log('Listening on port 3000'))
```
It's as simple as adding the `fileRouter` method as a middleware call! `fileRouter` takes in a string directory path where the routes are (defaults to `"./routes"`)

## Routing
Using the following folder structure as an example:
```text
- root/
  - routes/
    - index.tsx
    - blog
      - all.tsx
      - [id]/index.tsx
```
You get the following routes and files:
* `/`: ./routes/index.tsx
* `/blog/all`: ./routes/blog/all.tsx
* `/blog/:id`: ./routes/blog/:id/index.tsx

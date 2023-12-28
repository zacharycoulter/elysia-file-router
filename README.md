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
    - _layout.tsx
    - _error.tsx
    - +index.tsx
    - blog
      - +all.tsx
      - [id]/+index.tsx
    - user/
      - */
        - +index.tsx
```
You get the following routes and files:
* `/`: `./routes/index.tsx`
* `/blog/all`: `./routes/blog/all.tsx`
* `/blog/:id`: `./routes/blog/:id/index.tsx`
* `/user/*`: `./routes/user/*/index.tsx` (wildcard)

Route endpoint files have the `+` prefix. This allows for components to be stored within the same directory as the routes themselves.

## Handlers
Each route file should export at least one of the following: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and/or `ALL`. These take in `elysia.Context` as the sole parameter and take a normal Elysia handler return value.

### Example
```typescript
import { type Context } from 'elysia';

export const GET = () => {
    return (
        <h1>Hello, World!</h1>
    )
}

export const POST = (ctx: Context) => {
    if (ctx.query.success) {
        return {
            body: { success: true },
            status: 200
        }
    }
    return {
        body: { success: false },
        status: 400
    }
}
```

## Error handling
By adding a `_error.tsx` file to your base routes directory, you can have a endpoint which handles the error. Simply export a `HANDLE` method with a sole parameter of an error:
```typescript
export const HANDLE = (error: Error) => {
    console.error(error)
    return {
        status: 301,
        headers: {
            Location: '/'
        }
    }
}
```

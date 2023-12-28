import { Elysia } from 'elysia'
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Route } from './index.d'

function* readAllFiles(dir: string): Generator<string> {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) yield* readAllFiles(join(dir, file.name));
        else yield join(dir, file.name);
    }
}

const routes = async (directory = './routes'): Promise<Route[]> => Promise.all([...readAllFiles(directory)]
    .filter((file: string) => file.endsWith('.tsx') && file[file.lastIndexOf('/') + 1] === '+')
    .map(async (route: string) => ({
        path: route.substring(0, route.lastIndexOf('.')).replace(/\/\+index$/, '').replace(directory.slice(2), '') || "/",
        ...await import(join(process.cwd(), route))
    })))

export const fileRouter = async (directory: string): Promise<Elysia> => {
    const app = new Elysia()
    for (const route of await routes(directory)) {
        if (route.GET) app.get(route.path, route.GET)
        if (route.POST) app.post(route.path, route.POST)
        if (route.PUT) app.put(route.path, route.PUT)
        if (route.DELETE) app.delete(route.path, route.DELETE)
        if (route.ALL) app.all(route.path, route.ALL)
    }
    app.onError(async (error) => {
        if (existsSync(join(process.cwd(), directory, '_error.tsx'))) {
            const { HANDLE } = await import(join(process.cwd(), directory, '_error'))
            if (HANDLE) return HANDLE(error);
        }
        return error
    })
    return app
}


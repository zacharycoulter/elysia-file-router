import { Handler } from "elysia";

export type Route = {
    path: string
    GET?: Handler
    POST?: Handler
    PUT?: Handler
    DELETE?: Handler
    ALL?: Handler
}

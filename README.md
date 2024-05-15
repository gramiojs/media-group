# Media group plugin

[![npm](https://img.shields.io/npm/v/@gramio/media-group?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-group)
[![JSR](https://jsr.io/badges/@gramio/media-group)](https://jsr.io/@gramio/media-group)
[![JSR Score](https://jsr.io/badges/@gramio/media-group/score)](https://jsr.io/@gramio/media-group)

A plugin that catches errors with the `retry_after` field (**rate limit** errors), **waits** for the specified time and **repeats** the API request.

```ts
import { Bot } from "gramio";
import { mediaGroup } from "@gramio/media-group";

const bot = new Bot(process.env.TOKEN!)
    .extend(mediaGroup())
    .on("message", async (context) => {
        console.log(context.id, "media group", context.mediaGroup);
        return context.send(
            `${context.caption} + ${context.mediaGroup?.length}`
        );
    })
    .onStart(console.log);

bot.start();
```

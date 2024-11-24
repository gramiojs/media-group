# Media group plugin

[![npm](https://img.shields.io/npm/v/@gramio/media-group?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/@gramio/media-group)
[![JSR](https://jsr.io/badges/@gramio/media-group)](https://jsr.io/@gramio/media-group)
[![JSR Score](https://jsr.io/badges/@gramio/media-group/score)](https://jsr.io/@gramio/media-group)

This plugin collects `mediaGroup` from messages (**1** attachment = **1** message) using a **delay** if `mediaGroupId` is in the **MessageContext**, pass only **first** message further down the middleware chain with the `mediaGroup` key, which contains an **array** of messages of this **mediaGroup** (it also contains the **first** message). The delay after 10 attachments (max messages in 1 mediaGroup) is automatically skipped.

```ts
import { Bot } from "gramio";
import { mediaGroup } from "@gramio/media-group";

const bot = new Bot(process.env.TOKEN as string)
    .extend(mediaGroup())
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Caption from the first message - ${context.caption}. MediaGroup contains ${context.mediaGroup.length} attachments`
        );
    })
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));

bot.start();
```

### Setup

You can change the duration of the delay in milliseconds by simply passing it like this:

```typescript
const bot = new Bot(process.env.TOKEN!)
    .extend(mediaGroup(1000)) // wait 1 second for message with mediaGroupId (refreshed after new message with it)
    .on("message", async (context) => {
        if (!context.mediaGroup) return;

        return context.send(
            `Caption from the first message - ${context.caption}. MediaGroup contains ${context.mediaGroup.length} attachments`
        );
    })
    .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));

bot.start();
```

By default it `150 ms`.

## TODO

-   Currently, it stateful, so it does not work with horizontal scaling. Fixes would be hard (for example serialize/deserialize context in redis and etc) and maybe slow in perfomance.

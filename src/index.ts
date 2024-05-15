/**
 * @module
 *
 * Media group collector plugin for GramIO
 */

import { type Bot, type ContextType, Plugin } from "gramio";

// TODO: remove it. Slow types fixes for JSR
/**
 *	This plugin collects `mediaGroup` from messages (**1** attachment = **1** message) using a **delay**
 *	if `mediaGroupId` is in the **MessageContext**, pass only **first** message further down the middleware chain with the `mediaGroup` key,
 *	which contains an **array** of messages of this **mediaGroup** (it also contains the first message).
 *
 * 	@example
 * ```ts
 * import { Bot } from "gramio";
 * import { mediaGroup } from "@gramio/media-group";
 *
 * const bot = new Bot(process.env.TOKEN as string)
 *     .extend(mediaGroup())
 *     .on("message", async (context) => {
 *         if (!context.mediaGroup) return;
 *
 *         return context.send(
 *             `Caption from the first message - ${context.caption}. MediaGroup contains ${context.mediaGroup.length} attachments`
 *         );
 *     })
 *     .onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));
 *
 * bot.start();
 * ```
 *	### Setup
 *
 *	You can change the duration of the delay in milliseconds by simply passing it like this:
 *
 *	```typescript
 *	    .extend(mediaGroup(1000)) // wait 1 second for message with mediaGroupId (refreshed after new message with it)
 *
 *	```
 *
 *	By default it `150 ms`.
 *
 * @param timeout duration of the delay in milliseconds (default is `150 ms`)
 */
export function mediaGroup(timeout = 150): Plugin<
	{},
	import("gramio").DeriveDefinitions & {
		message:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_message:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		channel_post:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_channel_post:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		business_message:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_business_message:
			| {
					/** An array of messages from this media group */
					mediaGroup?: undefined;
			  }
			| {
					/** An array of messages from this media group */
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
	}
> {
	const map = new Map<
		string,
		{
			messages: ContextType<Bot, "message">[];
			timeout: NodeJS.Timeout;
		}
	>();

	return new Plugin("@gramio/media-group")
		.on(
			[
				"message",
				"channel_post",
				"business_message",
				"edited_message",
				"edited_channel_post",
				"edited_business_message",
			],
			(context, next) => {
				if (!context.mediaGroupId) return next();
				const key = `${context.chat.id}-${context.mediaGroupId}`;

				const mediaGroupData = map.get(key);
				if (!mediaGroupData) {
					map.set(key, {
						messages: [context],
						timeout: setTimeout(next, timeout),
					});
				} else {
					map.set(key, {
						messages: [...mediaGroupData.messages, context],
						timeout: mediaGroupData.timeout.refresh(),
					});
				}
			},
		)
		.derive(
			[
				"message",
				"channel_post",
				"business_message",
				"edited_message",
				"edited_channel_post",
				"edited_business_message",
			],
			(context) => {
				if (!context.mediaGroupId) return {};
				const key = `${context.chat.id}-${context.mediaGroupId}`;

				const data = map.get(key);
				if (data) map.delete(key);

				return {
					/** An array of messages from this media group */
					mediaGroup: data?.messages,
				};
			},
		);
}

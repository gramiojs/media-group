import { type Bot, type ContextType, Plugin } from "gramio";

// TODO: remove it. Slow types fixes for JSR
export function mediaGroup(timeout = 150): Plugin<
	{},
	import("gramio").DeriveDefinitions & {
		message:
			| {
					mediaGroup?: undefined;
			  }
			| {
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_message:
			| {
					mediaGroup?: undefined;
			  }
			| {
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		channel_post:
			| {
					mediaGroup?: undefined;
			  }
			| {
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_channel_post:
			| {
					mediaGroup?: undefined;
			  }
			| {
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		business_message:
			| {
					mediaGroup?: undefined;
			  }
			| {
					mediaGroup:
						| import("@gramio/contexts/dist/contexts/message").MessageContext<
								Bot<{}, import("gramio").DeriveDefinitions>
						  >[]
						| undefined;
			  };
		edited_business_message:
			| {
					mediaGroup?: undefined;
			  }
			| {
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
					mediaGroup: data?.messages,
				};
			},
		);
}

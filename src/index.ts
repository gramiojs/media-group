import { Plugin } from "gramio";

export interface MediaGroupOptions {
	// TODO:
	some: 1;
}

export function mediaGroup(options?: MediaGroupOptions) {
	return new Plugin("@gramio/media-group");
}

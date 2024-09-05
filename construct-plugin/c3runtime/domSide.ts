"use strict";

{
	const DOM_COMPONENT_ID = "YouTube_Playables";

	// This class handles messages from the runtime, which may be in a Web Worker.
	const HANDLER_CLASS = class YouTubePlayablesDOMHandler extends globalThis.DOMHandler
	{
		// Reference to YouTube Playables SDK
		_ytgame: typeof ytgame;

		constructor(iRuntime: IRuntimeInterface)
		{
			super(iRuntime, DOM_COMPONENT_ID);

			// YouTube Playables SDK is accessed via the "ytgame" global.
			// SDK reference: https://developers.google.com/youtube/gaming/playables/reference/sdk
			this._ytgame = globalThis["ytgame"];
			
			this.AddRuntimeMessageHandlers([
				["get-initial-state",		() => this._OnGetInitialState()],
				["game-ready",				() => this._OnGameReady()],
				["send-score",				e => this._OnSendScore(e)],
				["save",					e => this._OnSave(e)],
				["load",					() => this._OnLoad()]
			]);
		}
		
		// Called on startup to establish initial state
		async _OnGetInitialState()
		{
			// SDK is available
			if (this._ytgame)
			{
				// Call firstFrameReady() immediately, as by this point Construct will be
				// showing the loading screen
				this._ytgame["game"]["firstFrameReady"]();

				// Determine if in Playables environment
				const isInPlayablesEnv = this._ytgame["IN_PLAYABLES_ENV"];
				
				let isAudioEnabled = true;
				if (isInPlayablesEnv)
				{
					// Send SDK pause/resume events to runtime
					this._ytgame["system"]["onPause"](() => this._OnYTSetSuspended(true));
					this._ytgame["system"]["onResume"](() => this._OnYTSetSuspended(false));

					// Establish if audio is enabled on startup, and also send audio enabled
					// events to runtime
					isAudioEnabled = this._ytgame["system"]["isAudioEnabled"]();

					this._ytgame["system"]["onAudioEnabledChange"]((isAudioEnabled: boolean) =>
					{
						this.PostToRuntime("audio-enabled-change", {
							"isAudioEnabled": isAudioEnabled
						});
					});
				}

				// Identify language specified by SDK
				const language = await this._ytgame["system"]["getLanguage"]();

				return {
					"isInPlayablesEnv": isInPlayablesEnv,
					"sdkVersion": this._ytgame["SDK_VERSION"],
					"language": language,
					"isAudioEnabled": isAudioEnabled
				};
			}
			else
			{
				// SDK is not available
				return {
					"isInPlayablesEnv": false
				};
			}	
		}

		_OnGameReady()
		{
			if (!this._ytgame)
				return;

			this._ytgame["game"]["gameReady"]();
		}

		_OnYTSetSuspended(isSuspended: boolean)
		{
			this.PostToRuntime("set-suspended", {
				"isSuspended": isSuspended
			});
		}

		async _OnSendScore(data_: JSONValue)
		{
			const data = data_ as JSONObject;
			const score = data["score"] as number;

			try {
				await this._ytgame["engagement"]["sendScore"]({
					"value": score
				});
				return { "isOk": true };
			}
			catch (err)
			{
				console.warn(`[YouTube Playables] Error sending score:`, err);
				return { "isOk": false };
			}
		}

		async _OnSave(data_: JSONValue)
		{
			const data = data_ as JSONObject;
			const saveDataStr = data["saveData"] as string;

			try {
				await this._ytgame["game"]["saveData"](saveDataStr);
				return { "isOk": true };
			}
			catch (err)
			{
				console.warn(`[YouTube Playables] Error saving:`, err);
				return { "isOk": false };
			}
		}

		async _OnLoad()
		{
			try {
				const saveDataStr = await this._ytgame["game"]["loadData"]();

				return {
					"isOk": true,
					"saveData": saveDataStr
				};
			}
			catch (err)
			{
				console.warn(`[YouTube Playables] Error saving:`, err);
				return { "isOk": false };
			}
		}
	};

	globalThis.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}
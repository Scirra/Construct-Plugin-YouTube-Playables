
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.YouTube_Playables.Cnds =
{
	InPlayablesEnv(this: SDKInstanceClass)
	{
		return this._isInPlayablesEnv;
	},

	OnSendScoreSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnSendScoreError(this: SDKInstanceClass)
	{
		return true;
	},

	OnSaveSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnSaveError(this: SDKInstanceClass)
	{
		return true;
	},

	OnLoadSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnLoadError(this: SDKInstanceClass)
	{
		return true;
	}
};

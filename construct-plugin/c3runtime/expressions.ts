
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.YouTube_Playables.Exps =
{
	SDKVersion(this: SDKInstanceClass)
	{
		return this._playablesSdkVersion;
	},

	Language(this: SDKInstanceClass)
	{
		return this._playablesLanguage;
	},

	SaveData(this: SDKInstanceClass)
	{
		return this._saveData;
	}
};

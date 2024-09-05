
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.YouTube_Playables.Acts =
{
	async SendScore(this: SDKInstanceClass, score: number)
    {
        await this.sendScore(score);
    },

    async Save(this: SDKInstanceClass, saveData: string)
    {
        await this.saveToYT(saveData);
    },

    async Load(this: SDKInstanceClass)
    {
        await this.loadFromYT();
    }
};

const C3 = globalThis.C3;
C3.Plugins.YouTube_Playables.Acts =
    {
        async SendScore(score) {
            await this.sendScore(score);
        },
        async Save(saveData) {
            await this.saveToYT(saveData);
        },
        async Load() {
            await this.loadFromYT();
        }
    };
export {};

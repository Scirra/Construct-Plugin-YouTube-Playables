const C3 = globalThis.C3;
C3.Plugins.YouTube_Playables.Exps =
    {
        SDKVersion() {
            return this._playablesSdkVersion;
        },
        Language() {
            return this._playablesLanguage;
        },
        SaveData() {
            return this._saveData;
        }
    };
export {};

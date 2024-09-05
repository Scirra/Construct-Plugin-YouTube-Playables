const C3 = globalThis.C3;
C3.Plugins.YouTube_Playables.Cnds =
    {
        InPlayablesEnv() {
            return this._isInPlayablesEnv;
        },
        OnSendScoreSuccess() {
            return true;
        },
        OnSendScoreError() {
            return true;
        },
        OnSaveSuccess() {
            return true;
        },
        OnSaveError() {
            return true;
        },
        OnLoadSuccess() {
            return true;
        },
        OnLoadError() {
            return true;
        }
    };
export {};

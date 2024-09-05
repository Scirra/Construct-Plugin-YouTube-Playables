const C3 = globalThis.C3;
// Update the DOM_COMPONENT_ID to be unique to your plugin.
// It must match the value set in domSide.js as well.
const DOM_COMPONENT_ID = "YouTube_Playables";
class YouTubePlayablesInstance extends globalThis.ISDKInstanceBase {
    constructor() {
        // Note that DOM_COMPONENT_ID must be passed to the base class as an additional parameter.
        super({ domComponentId: DOM_COMPONENT_ID });
        this._isInPlayablesEnv = false;
        this._isPlayablesSuspended = false;
        this._playablesSdkVersion = "";
        this._playablesLanguage = "";
        this._saveData = "";
        /*
        const properties = this._getInitProperties();
        if (properties)		// note properties may be null in some cases
        {
            this._testProperty = properties[0] as number;
        }
        */
        // Listen for the beforeprojectstart event, which is fired just before the first layout
        // starts. This is when the SDK gameReady() method gets called.
        this.runtime.addEventListener("beforeprojectstart", () => this._onBeforeProjectStart());
        this._addDOMMessageHandlers([
            ["set-suspended", e => this._onSetSuspended(e)],
            ["audio-enabled-change", e => this._onAudioEnabledChange(e)]
        ]);
        // Post to the DOM to retrieve the initial state.
        // Make runtime loading wait for the response.
        this.runtime.sdk.addLoadPromise(this._init());
    }
    _release() {
        super._release();
    }
    async _init() {
        // Post to DOM side to establish initial state
        const data_ = await this._postToDOMAsync("get-initial-state");
        const data = data_;
        this._isInPlayablesEnv = data["isInPlayablesEnv"];
        if (this._isInPlayablesEnv) {
            // When in playables environment, read initial state values
            this._playablesSdkVersion = data["sdkVersion"];
            this._playablesLanguage = data["language"];
            // On startup, when in the Playables environment, put the runtime in to manual
            // suspend/resume mode so it is only suspended by the YouTube Playables SDK
            // pause and resume events, as per their requirements.
            this.runtime.sdk.isAutoSuspendEnabled = false;
            const isAudioEnabled = data["isAudioEnabled"];
            this._updateAudioEnabled(isAudioEnabled);
        }
    }
    _onBeforeProjectStart() {
        this._postToDOM("game-ready");
    }
    _onSetSuspended(data_) {
        // Manually call setSuspended() from SDK pause/resume events as per the SDK requirements.
        const data = data_;
        const isSuspended = data["isSuspended"];
        if (this._isPlayablesSuspended === isSuspended)
            return; // ignore redundant calls
        this._isPlayablesSuspended = isSuspended;
        this.runtime.sdk.setSuspended(isSuspended);
    }
    _onAudioEnabledChange(data_) {
        // Update audio enabled state from SDK events as per the SDK requirements.
        const data = data_;
        const isAudioEnabled = data["isAudioEnabled"];
        this._updateAudioEnabled(isAudioEnabled);
    }
    _updateAudioEnabled(isAudioEnabled) {
        // Find the Audio plugin script interface if it's used in this project.
        const audioPlugin = globalThis.IPlugin.getByConstructor(C3.Plugins.Audio);
        if (!audioPlugin)
            return; // Audio plugin not used in project
        const audioObjectType = audioPlugin.getSingleGlobalObjectType();
        // When audio is disabled, enable silent mode in the Audio object to mute all playback.
        audioObjectType.isSilent = !isAudioEnabled;
    }
    // Send score wrapper (delegates to DOM side)
    async sendScore(score) {
        const result_ = await this._postToDOMAsync("send-score", {
            "score": score
        });
        const result = result_;
        const isOk = result["isOk"];
        if (isOk) {
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnSendScoreSuccess);
        }
        else {
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnSendScoreError);
        }
        return isOk;
    }
    // Save wrapper (delegates to DOM side)
    async saveToYT(data) {
        const result_ = await this._postToDOMAsync("save", {
            "saveData": data
        });
        const result = result_;
        const isOk = result["isOk"];
        if (isOk) {
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnSaveSuccess);
        }
        else {
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnSaveError);
        }
        return isOk;
    }
    // Load wrapper (delegates to DOM side)
    async loadFromYT() {
        const result_ = await this._postToDOMAsync("load");
        const result = result_;
        const isOk = result["isOk"];
        if (isOk) {
            this._saveData = result["saveData"];
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnLoadSuccess);
        }
        else {
            this._trigger(C3.Plugins.YouTube_Playables.Cnds.OnLoadError);
        }
        return isOk;
    }
    _saveToJson() {
        return {
        // data to be saved for savegames
        };
    }
    _loadFromJson(o) {
        // load state for savegames
    }
}
;
C3.Plugins.YouTube_Playables = {};
C3.Plugins.YouTube_Playables.Instance = YouTubePlayablesInstance;
export {};

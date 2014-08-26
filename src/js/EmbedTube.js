(function (exports) {

    var EmbedTube = function (opts) {
        opts = opts || {};

        this.elementId = opts.elementId;
        this.width = opts.width || null;
        this.height = opts.height || null;
        this.playerVars = opts.playerVars || {};
        this.videoId = opts.videoId;

        if (!this.elementId) {
            throw new Error('Give id for player alt element.');
        }
        if (!this.videoId) {
            throw new Error('There are no youtube video id.');
        }

        if (EmbedTube.isReady) {
            this.createPlayer();
        } else if (YT && YT.Player) {
            onReady();
            this.createPlayer();
        } else {
            var self = this;
            EmbedTube.queue.push(this);
        }
    };

    // inherit EventTrigger
    EmbedTube = EventTrigger.extend(EmbedTube);

    EmbedTube.prototype.createPlayer = function () {
        var self = this;

        this.player = new YT.Player(this.elementId, {
            width: this.width,
            height: this.height,
            videoId: this.videoId,
            playerVars: this.playerVars,
            events: {
                onReady: function (e) {
                    self.emit('ready', e);
                },
                onStateChange: function (e) {
                    self.emit('stateChange', e);

                    switch (e.data) {
                        case YT.PlayerState.ENDED: self.emit('ended', e); break;
                        case YT.PlayerState.PLAYING: self.emit('playing', e); break;
                        case YT.PlayerState.PAUSED: self.emit('paused', e); break;
                        case YT.PlayerState.BUFFERING: self.emit('buffering', e); break;
                        case YT.PlayerState.CUED: self.emit('cued', e); break;
                    }
                },
                onPlaybackQualityChange: function (e) {
                    self.emit('playbackQualityChange', e);
                },
                onPlaybackRateChange: function (e) {
                    self.emit('playbackRateChange', e);
                },
                onError: function (e) {
                    self.emit('error', e);
                },
                onApiChange: function (e) {
                    self.emit('apiChange', e);
                }
            }
        });
    };

    EmbedTube.prototype.play = function () {
        this.player.playVideo();
    };

    EmbedTube.prototype.pause = function () {
        this.player.pauseVideo();
    };

    EmbedTube.prototype.currentTime = function () {
        if (!this.player) {
            return null;
        }
        return this.player.getCurrentTime();
    };

    EmbedTube.prototype.duration = function () {
        if (!this.player) {
            return null;
        }
        return this.player.getDuration();
    };


    // static vars & methods

    EmbedTube.isReady = false;
    EmbedTube.queue = [];

    function onReady () {
        for (var i = 0; i < EmbedTube.queue.length; i++) {
            EmbedTube.queue[i].createPlayer();
        }
        EmbedTube.PlayerState = YT.PlayerState;
        EmbedTube.isReady = true;
    }

    window.onYouTubeIframeAPIReady = onReady;

    exports.EmbedTube = EmbedTube;
})(this);

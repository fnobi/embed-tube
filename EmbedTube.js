(function (exports) {

    var EmbedTube = function (opts) {
        opts = opts || {};

        if (opts.url) {
            opts.videoId = this.parseUrl(opts.url);
        }

        this.elementId = opts.elementId;
        this.width = opts.width || null;
        this.height = opts.height || null;
        this.playerVars = opts.playerVars || {};
        this.videoId = opts.videoId;
        this.dispatcher = opts.dispatcher;

        if (!this.elementId) {
            throw new Error('Give id for player alt element.');
        }
        if (!this.videoId) {
            throw new Error('There are no youtube video id.');
        }

        if (EmbedTube.isReady) {
            this.createPlayer();
        } else if (window.YT && window.YT.Player) {
            onReady();
            this.createPlayer();
        } else {
            EmbedTube.queue.push(this);
        }
    };

    EmbedTube.prototype.createPlayer = function () {
        var dispatcher = this.dispatcher;

        this.player = new YT.Player(this.elementId, {
            width: this.width,
            height: this.height,
            videoId: this.videoId,
            playerVars: this.playerVars,
            events: {
                onReady: function (e) {
                    dispatcher.trigger('ready', e);
                },
                onStateChange: function (e) {
                    dispatcher.trigger('stateChange', e);

                    switch (e.data) {
                        case YT.PlayerState.ENDED: dispatcher.trigger('ended', e); break;
                        case YT.PlayerState.PLAYING: dispatcher.trigger('playing', e); break;
                        case YT.PlayerState.PAUSED: dispatcher.trigger('paused', e); break;
                        case YT.PlayerState.BUFFERING: dispatcher.trigger('buffering', e); break;
                        case YT.PlayerState.CUED: dispatcher.trigger('cued', e); break;
                    }
                },
                onPlaybackQualityChange: function (e) {
                    dispatcher.trigger('playbackQualityChange', e);
                },
                onPlaybackRateChange: function (e) {
                    dispatcher.trigger('playbackRateChange', e);
                },
                onError: function (e) {
                    dispatcher.trigger('error', e);
                },
                onApiChange: function (e) {
                    dispatcher.trigger('apiChange', e);
                }
            }
        });
    };
    
    EmbedTube.prototype.parseUrl = function (url) {
        var REGEXP = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([0-9a-zA-Z_\-]+)/;

        if (!url || !url.match) {
            return null;
        }

        var matchData = url.match(REGEXP);

        if (!matchData) {
            return null;
        }

        return matchData[2];
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

    EmbedTube.prototype.seekTo = function (seconds, allowSeekAhead) {
        if (!this.player) {
            return null;
        }
        return this.player.seekTo(seconds, allowSeekAhead);
    };

    EmbedTube.prototype.setLoop = function (bool) {
        if (!this.player) {
            return null;
        }
        return this.player.setLoop(bool);
    };

    EmbedTube.prototype.setVolume = function (v) {
        if (!this.player) {
            return null;
        }
        return this.player.setVolume(v);
    };

    EmbedTube.prototype.getVolume = function () {
        if (!this.player) {
            return null;
        }
        return this.player.getVolume();
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


    // load script
    (function () {
        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
    })();


    exports.EmbedTube = EmbedTube;
})(module ? module.exports : this);

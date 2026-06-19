(function() {
    function bindMoviePlayer(options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var streamUrl = options.streamUrl;
        var prepared = false;
        var hlsInstance = null;

        if (!video || !streamUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function start() {
            prepare();

            if (button) {
                button.classList.add('is-hidden');
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }

        video.addEventListener('play', function() {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        video.addEventListener('error', function() {
            if (hlsInstance && window.Hls) {
                hlsInstance.destroy();
                hlsInstance = null;
                prepared = false;
            }
        });
    }

    window.bindMoviePlayer = bindMoviePlayer;
})();

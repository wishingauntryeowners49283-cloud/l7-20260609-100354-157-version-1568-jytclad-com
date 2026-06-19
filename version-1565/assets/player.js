import { H as Hls } from './hls-vendor-dru42stk.js';

document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var source = player.getAttribute('data-source');
    var hlsInstance = null;

    function attachSource() {
        if (!video || !source) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.src !== source) {
                video.src = source;
            }
        } else if (Hls && Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            }
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        attachSource();
        var playback = video.play();

        if (playback && typeof playback.then === 'function') {
            playback.then(function () {
                if (button) {
                    button.classList.add('hidden');
                }
            }).catch(function () {
                if (button) {
                    button.classList.remove('hidden');
                }
            });
        } else if (button) {
            button.classList.add('hidden');
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    if (video) {
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('hidden');
            }
        });
    }
});

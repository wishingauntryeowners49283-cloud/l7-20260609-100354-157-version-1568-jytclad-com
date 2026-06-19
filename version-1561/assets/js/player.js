(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupPlayer(box) {
        var video = box.querySelector("[data-video]");
        var button = box.querySelector("[data-play-button]");
        var errorBox = box.querySelector("[data-player-error]");
        var source = video ? video.querySelector("source") : null;
        var url = source ? source.getAttribute("src") : "";
        var hls = null;
        var attached = false;

        function showError(message) {
            if (errorBox) {
                errorBox.textContent = message;
                errorBox.classList.add("is-visible");
            }
        }

        function attach() {
            if (attached || !video || !url) {
                return;
            }
            attached = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        showError("视频加载失败，请稍后再试");
                        hls.destroy();
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else {
                showError("当前浏览器暂不支持播放，请更换浏览器后再试");
            }
        }

        function play() {
            attach();
            if (button) {
                button.classList.add("is-hidden");
            }
            video.controls = true;
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (!video || !button) {
            return;
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("error", function () {
            showError("视频加载失败，请稍后再试");
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        document.querySelectorAll("[data-player-box]").forEach(setupPlayer);
    });
})();

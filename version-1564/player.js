(function () {
  function initMoviePlayer(videoId, coverId, streamUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    if (!video || !cover || !streamUrl) {
      return;
    }

    var loaded = false;
    var hlsInstance = null;

    function loadStream() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal || !hlsInstance) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
            return;
          }
          hlsInstance.destroy();
          hlsInstance = null;
        });
        return;
      }

      video.src = streamUrl;
      video.load();
    }

    function startPlayback() {
      loadStream();
      cover.classList.add("is-hidden");
      var playAction = video.play();
      if (playAction && typeof playAction.catch === "function") {
        playAction.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    cover.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        cover.classList.remove("is-hidden");
      }
    });
    video.addEventListener("ended", function () {
      cover.classList.remove("is-hidden");
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();

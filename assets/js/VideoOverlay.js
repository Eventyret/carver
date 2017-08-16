$(function () {
    "use strict";

    // Ensure this file doesn't run twice
    var videoOverlayScriptExecutedKey = "videoOverlayScriptExecuted?";
    if (window[videoOverlayScriptExecutedKey]) {
        return;
    } else {
        window[videoOverlayScriptExecutedKey] = true;
    }

    var $containerElement = null;
    var $videoElement = null;
    var $innerElement = null;
    var $closeOverlayElement = null;

    // Attach a delegate listener to the window
    var videoOverlaySelector = "[data-video-overlay]";
    $(document).on('click', videoOverlaySelector, OnVideoClick);

    var fadeDurationMsec = 600;

    function OnVideoClick(event) {
        var videoData = $(this).data('video-overlay');

        if (typeof videoData.url === 'undefined' || typeof videoData.type === 'undefined') {
            console.error("VideoOverlay: Could not play video due to missing url/type parameters");
            return true;
        }

        if ($containerElement === null) {
            CreateVideoOverlay();
        }

        SetVideoInOverlay(videoData.url, videoData.type);
        SetVideoOverlayOpen(true);

        return false;
    }

    function CreateVideoOverlay() {
        if ($containerElement !== null) {
            return;
        }

        $containerElement = $("<div class=\"videoOverlay\"><div class=\"videoOverlayInner\"><div class=\"videoOverlayVerticalAlign\"><div class=\"videoOverlayHorizontalAlign\"></div></div></div></div>");
        $innerElement = $containerElement.children().children().children().first();
        $videoElement = $("<video class=\"videoOverlayVideo\" controls=\"auto\"></video>");
        $closeOverlayElement = $("<button class=\"videoOverlayCloseButton\">Close video</button>");

        $closeOverlayElement.on('click', function (event) {
            SetVideoOverlayOpen(false);
            return false;
        });

        $innerElement.append($closeOverlayElement, $videoElement);
        $(document.body).append($containerElement);
    }

    function SetVideoInOverlay(url, mimeType) {
        $videoElement.find('source').remove();
        $videoElement.append($('<source />').attr('src', url).attr('type', mimeType));
        $videoElement.get(0).pause();
        $videoElement.get(0).currentTime = 0;
    }

    function IsVideoOverlayOpen() {
        return $containerElement.hasClass('videoOverlayOpen');
    }

    function SetVideoOverlayOpen(state) {
        $containerElement.toggleClass('videoOverlayOpen', state);

        if (!state) {
            $videoElement.get(0).pause();
            $videoElement.get(0).currentTime = 0;
            $containerElement.fadeOut({
                duration: fadeDurationMsec
            });
        } else {
            $videoElement.get(0).pause();
            $videoElement.get(0).currentTime = 0;
            $containerElement.fadeIn({
                duration: fadeDurationMsec,
                complete: function () {
                    $videoElement.get(0).play();
                }
            });
        }
    }
});
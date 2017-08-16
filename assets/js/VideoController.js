$(function () {
    var scrollTop = 0;
    var canScroll = false;
    var previousScrollPosition = 0;
    var interval;

    // temp for PayPort videos.
    if (document.URL.indexOf("../../../access-services/payport/index.html") >= 0) {
        $("a.button.play").click(function (e) {
            setTimeout(function () {
                $("#overlay").find("video").get(0).play();
            }, 1000);
        });
    }

    $(window).scroll(function () {
        scrollTop = $(window).scrollTop();
        if (canScroll) {
            findVisibleSectionByPosition(scrollTop);
            previousScrollPosition = scrollTop;
            canScroll = false;
        }

        clearInterval(interval);
        interval = setInterval(function () {
            canScroll = true;
        }, 250);
    });

    // play header video on button click
    $("a.button.play").click(function (e) {
        var IEVersion = GetIEVersion();

        if (!$(this).hasClass("displayOnly")) {
            var video = $(this).parent().siblings("#inline-video");
            $(this).siblings("h1").fadeOut();
            $(this).siblings("h2").fadeOut();
            $(this).siblings("p").fadeOut();
            if (!$(this).hasClass("displayOnly")) {
                $(this).fadeOut();
            }
            $(".scrollContainer").fadeOut();

            video.fadeIn();
            video.get(0).play();
            if (video.hasClass("tileVideo") && $(window).width() < 700) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullScreen) {
                    video.webkitRequestFullScreen();
                }
                if (typeof (video.webkitEnterFullscreen) != "undefined") {
                    // This is for Android Stock.
                    video.webkitEnterFullscreen();
                } else if (typeof (video.webkitRequestFullscreen) != "undefined") {
                    // This is for Chrome.
                    video.webkitRequestFullscreen();
                } else if (typeof (video.mozRequestFullScreen) != "undefined") {
                    video.mozRequestFullScreen();
                }
            }

            video.get(0).onended = function (e) {
                if (!$(video).hasClass("tileVideo")) {
                    $(video).fadeOut();
                    $(this).siblings("h1").fadeIn();
                    $(this).siblings("h2").fadeIn();
                    $(this).siblings("p").fadeIn();
                    $(this).siblings("a.button.play").fadeIn();
                    $(".scrollContainer").fadeIn();
                }
            };
        }
    });
});

var videoStarted = false;
var videoPaused = false;

function findVisibleSectionByPosition(windowTopPosition) {
    var IEVersion = GetIEVersion();
    $(".siteContainer").each(function () {
        if ($(this).hasClass("contentWithVideo")) {
            var thisPosition = $(this).position();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            var sectionTop = thisPosition.top;
            var sectionBottom = thisPosition.top + $(this).height();

            var video = $(this).children().find("#inline-video");

            if ((IEVersion != -1) && (IEVersion <= 9)) {
                // IE, no auto video.
            } else {
                //If the video is in view / current viewport
                if (sectionBottom < viewportBottom) {
                    var title = $(this).children().find("h2");
                    var button = $(this).children().find("a.button.play");

                    title.fadeOut();
                    video.fadeIn();
                    video.get(0).play();
                    videoStarted = true;

                    function handler(e) {
                        if (!e) { e = window.event; }

                        $(this).get(0).currentTime = 0;
                        $(this).get(0).play();
                    }

                    video.get(0).addEventListener('ended', handler, false);
                }
            }
        }
    });

    var IEVersion = GetIEVersion();
    if ((IEVersion != -1) && (IEVersion <= 9)) {
        $("a.button.play").hide();
    }
    if ((IEVersion != -1) && (IEVersion <= 10)) {
        $(".contentWithVideo").css("height", "100%");
        $(".headerWithVideo").css("height", "100%");
        // also fix height of sections here.
    }
}
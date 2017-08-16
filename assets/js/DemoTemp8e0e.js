$(function () {
    $(window).on('load', function () {
        OnLoadAndResize();
    });

    $(window).resize(function () {
        OnLoadAndResize();
    });

    function OnLoadAndResize() {
        setCurrentState();
        AddBackgroundSlideOnHover();
        CheckHeroVideoSize();
        FeatureHeightImprovement();
        HideLoopingVideosForiPadsandiPhones();
    }
});

function AddBackgroundSlideOnHover() {
    if (currentState == state.Desktop) {
        $(".hoverSlideButton").each(function () {
            var background = $(this).find(".hoverAppearance");
            var text = $(this).find(".hoverTextRevealer");

            $(this).hover(function () {
                background.stop().animate({ left: "-1%" }, { duration: 250 }, { queue: false });
                text.stop().animate({ width: "100%" }, { duration: 250 }, { queue: false });
            }, function () {
                background.stop().animate({ left: "-145%" }, { duration: 250 }, { queue: false });
                text.stop().animate({ width: "1%" }, { duration: 250 }, { queue: false });
            });
        });
    }
}

function CheckHeroVideoSize() {
    $(".hero .loopingVideo").each(function() {
        if ($(this).height() < $(".hero").outerHeight()) {
            $(this).addClass("fullHeight");
        }
        if ($(this).width() < $(".hero").outerWidth()) {
            $(this).removeClass("fullHeight");
        }
    });
}

function FeatureVideoPlayControl(element) {
    //$(".hero .play").click(function () {
        var hero = $(element).closest(".hero");
        var video = hero.find(".featureVideo");

        //$(element).siblings("h1").fadeOut();
        //$(element).siblings("hr").fadeOut();
        //$(element).siblings("p").fadeOut();
        //$(element).fadeOut();
        $(".hero .contentContainer").fadeOut();
        $(".hero .background").fadeOut();
        $(".scrollContainer").fadeOut();

        hero.height(heroShowingVideoHeight());
        video.fadeIn();
        video.get(0).play();

        video.bind('ended', function () {
            video.fadeOut();
            hero.height("auto");
            var contentContainer = hero.find(".contentContainer");
            //contentContainer.find("h1").fadeIn();
            //contentContainer.find("hr").fadeIn();
            //contentContainer.find("p").fadeIn();
            //contentContainer.find("a").fadeIn();
            $(".hero .contentContainer").fadeIn();
            $(".hero .background").fadeIn();
            $(".scrollContainer").fadeIn();
        });
    //});
}

function heroShowingVideoHeight() {
    var videoheight = $(".featureVideo").height();  // Value is an int
    var heroTopPadding = parseInt($(".hero").css("padding-top").slice(0, -2));  // Value is a string in px
    var heroBottomPadding = parseInt($(".hero").css("padding-bottom").slice(0, -2));

    return (videoheight - heroTopPadding - heroBottomPadding);
}

function FeatureHeightImprovement() {
    $(".feature").each(function () {
        if ($(this).hasClass("imageOnly") && $(this).find(".sectionVideo")) {
            $(this).height($(this).find(".sectionVideo").height());
        } else if ($(this).find(".sectionVideo")) {
            CheckFeatureVideoSize();
        } else if ($(this).hasClass("imageOnly")) {
            $(this).height($(this).find(".sectionBackground").height());
        }
    });
}

function CheckFeatureVideoSize() {
    $(".feature .sectionVideo").each(function () {
        if ($(this).height() < $(".feature").outerHeight()) {
            $(this).addClass("fullHeight");
        }
        if ($(this).width() < $(".feature").outerWidth()) {
            $(this).removeClass("fullHeight");
        }
    });
}

/* Fires transitional events when the window reaches certain widths */
function setCurrentState() {
    if ($("#desktopView").css("display") != "none") {
        if (currentState != state.Desktop) {
            currentState = state.Desktop;
        }
    } else if ($("#tabletView").css("display") != "none") {
        if (currentState != state.Tablet) {
            currentState = state.Tablet;
        }
    } else if ($("#mobileView").css("display") != "none") {
        if (currentState != state.Mobile) {
            currentState = state.Mobile;
        }
    }
}

/* Apply have disabled the use of autoplay to prevent users get large roam charges, etc*/
function HideLoopingVideosForiPadsandiPhones() {
    if (currentState != state.Desktop && usingSafari()) {
        $(".sectionLoopingVideo, .loopingVideo").each(function () {
            $(this).hide();
        });
    } else if (currentState == state.Desktop && usingSafari()) {
        $(".sectionLoopingVideo, .loopingVideo").each(function () {
            $(this).show();
        });
    }
}

function usingSafari() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1 || ua.indexOf('Chromium') > -1) {
            // Chrome
        } else {
            // Safari
            return true;
        }
    }

    return false;
}
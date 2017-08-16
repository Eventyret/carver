// currentState can be state.Mobile (0), state.Tablet (1) or state.Desktop (2)
$(function () {
    if (!window.console) {
        console = {};
        console.log = function () { };
    }

    // Document ready has the html in place while on load means once html and all images, etc are in place
    $(window).on('load', function () {
        OnLoadAndResize();
        backgroundImageAllignmentFix();
        improveBackFeatureOnOverlays();
        Header3FlushWithTopOfPage();
    });

    $(window).resize(function () {
        OnResize();
        OnLoadAndResize();
        contactMapResizeController();
    });

    OnResize();

    removeLabelsFromForms();
    mainMenuControl();
    contactMapLocationSwitchingControl();
    addScrollToNextSectionClick();
    removeScrollDownArrow();
    sortCodeFinderToggleFilterOptions();
    sortCodeFinderLinkReset();
    sortCodeInputController();
    wrapMultipleHeadingButtons();
    InitTransactionCounter();
    profileInfoDisplayFeature();
    prioritiesInfoDisplayFeature();

    //Need to show controls on first video on home page but not the second video.
    $(".contentWithVideo video").removeAttr("controls");
});

function OnResize() {
    ToggleFeaturedImage();
    //positionExploreBoxes();
    centerGatewayTextSections();
}

function OnLoadAndResize() {
    DriftingImageController();
    addCarouselToImageSets();
    resizeVideoAndMapSections();
    MobileContentWithImageHeadingFix();
    AddTilePositionClasses();
    DisplayFixToPrioritiesList();
    PersonImageDisplayAssist();
    centerTextNextToIcon();
}

function addScrollToNextSectionClick() {
    $(".scrollContainer a.scroll").click(function () {
        if ($(".siteContainer.contentWithFeatureImage").length > 0) {
            $('html,body').animate({
                scrollTop: ($(".siteContainer.contentWithFeatureImage.bg").offset().top - 60)
            }, 900);
        } else {
            $('html,body').animate({
                scrollTop: ($(".siteContainer.multi-ColumnSectionWithTitle").offset().top - 60)
            }, 900);
        }
    });
}

// set height of content in div to be responsive
function centerGatewayTextSections() {
    // Set margin top to half the difference between the content height and container height, vertically centering
    $(".contentWithFeatureImage").each(function () {
        if (currentState !== state.Mobile && !$(this).hasClass("quoteSection")) {
        	var containerHeight = $(this).outerHeight();
        	if ($(this).find("h2").length > 0) {
        		var topOfHeading = $(this).find("h2").offset().top;
        		var bottomOfButton = ($(this).find("a").offset().top) + $(this).find("a").outerHeight();
        		var contentHeight = bottomOfButton - topOfHeading;

        		var topMargin = (containerHeight - contentHeight) / 2;
        		$(this).find("h2").css("margin-top", topMargin);
        	}
        } else if (currentState !== state.Mobile && $(this).hasClass("quoteSection")) {
            var containerHeight = $(this).outerHeight();
            var contentHeight = $(this).find(".informationContainer").height();

            var topMargin = (containerHeight - contentHeight) / 2;

            $(this).find(".informationContainer").css("margin-top", topMargin);
        } else {
            // $(this).find("h2").css("margin-top", "50%");   // Removed because !important styling is in affect
        }
    });

    $(".pageHeaderWithLink").each(function () {
        var containerHeight = $(this).outerHeight();
        var topOfHeading = $(this).find("h1").offset().top;
        var bottomOfContent;
        if ($(this).find("a.button").length === 0) {
            bottomOfContent = ($(this).find("p").last().offset().top) + $(this).find("p").last().outerHeight();
        } else {
            bottomOfContent = ($(this).find("a.button").offset().top) + $(this).find("a.button").outerHeight();
        }

        var contentHeight = bottomOfContent - topOfHeading;

        var topMargin = ((containerHeight - contentHeight) / 2) + 40; // Add 40 to compensate for menu/search bar across top of screen
        $(this).find("h1").css("margin-top", topMargin);
    });
}

function resizeVideoAndMapSections() {
    var IEVersion = GetIEVersion();
    // Give slick time to kick in
    setTimeout(function () {
        if (((currentState === state.Desktop) || (currentState === state.Tablet)) && ((IEVersion != -1) && (IEVersion > 8))) {
            $(".headerWithVideo, .contentWithVideo").each(function () {
                if ($(this).has("video").length > 0) {
                    $(this).height($(this).find("video").height());
                    $(this).find("h1").css("margin-top", ($(this).find("video").height() / 3));
                }
            });
        } else {
            $(".headerWithVideo, .contentWithVideo").each(function () {
                if ($(this).has("video").length > 0) {
                    if ((IEVersion != -1) && (IEVersion > 8)) {
                        $(this).height("auto");
                        $(this).find("h1").css("margin-top", "100px");
                    }
                }
            });
        }
        if ((currentState === state.Desktop) || (currentState === state.Tablet)) {
            // Ed's constant
            var mapAspect = 0.333;
            var mapHeight = $(window).width() * mapAspect;

            $(".siteContainer.multipleMapSection").height(mapHeight);
        } else {
            $(".siteContainer.multipleMapSection").height("inerhit");
        }
    }, 1000);

    if ((IEVersion != -1) && (IEVersion <= 10)) {
        $(".contentWithVideo").css("height", "100%");
        $(".headerWithVideo").css("height", "100%");
        // also fix height of sections here.
        if (IEVersion <= 9) {
            $("a.button.play").hide();
        }
    }
}

function positionExploreBoxes() {
    if (currentState == state.Desktop) {
        $(".exploreBox:nth-child(3n+1)").css("margin-right", "0");

        $(".exploreBox:last-child").css("margin-bottom", "100px");
    } else {
        $(".exploreBox:nth-child(3n+1)").css("margin-right", "auto");
        $(".exploreBox:nth-child(5)").css("margin-bottom", "30px");
    }
}

function addCarouselToImageSets() {
    $(".carousel").each(function () {
        if ($(this).hasClass("slick-initialized")) {
            $(this).slick('unslick');
        }

        var collectionSize = $(this).attr('data-collectionSize');

        var usingFolder = "";
        if (!$(this).hasClass("milestoneCarousel")) {
            usingFolder = $(this).attr('data-imagesFolder');
        }

        var numberToDisplay = GetDisplayNumberForCurrentViewState($(this));

        var forwardButton = $(this).parent().find(".forwardButton");
        if (forwardButton.length > 0) {
            $(this).data("forward", forwardButton);
        } else {
            $($(this).data("forward")).insertAfter(this);
        }

        var backButton = $(this).parent().find(".backButton");
        if (backButton.length > 0) {
            $(this).data("back", backButton);
        } else {
            $($(this).data("back")).insertBefore(this);
        }

        if (numberToDisplay >= collectionSize) {
            backButton.addClass("hidden");
            forwardButton.addClass("hidden");
        } else {
            backButton.removeClass("hidden");
            forwardButton.removeClass("hidden");
        }

        if ($(this).hasClass("milestoneCarousel")) {
            $(this).slick({
                infinite: true,
                slidesToShow: numberToDisplay,
                slidesToScroll: 1,
                prevArrow: ".milestoneCarousel-prev-slide",
                nextArrow: ".milestoneCarousel-next-slide"
            });
        } else {
            $(this).slick({
                infinite: true,
                slidesToShow: numberToDisplay,
                slidesToScroll: 1,
                prevArrow: ".imageCarousel-" + usingFolder + "-prev-slide",
                nextArrow: ".imageCarousel-" + usingFolder + "-next-slide"
            });
        }
    });

    // stats carousel
    if ($(".carousel.auto").hasClass("slick-initialized")) {
        $(".carousel.auto").slick('unslick');
    }

    $(".carousel.auto").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        cssEase: 'linear',
        arrows: false
    });
}

function GetDisplayNumberForCurrentViewState(carousel) {
    var maxDisplay = $(carousel).attr('data-numberToDisplay');

    if (currentState == state.Desktop) {
        return maxDisplay;   // This value is set with desktop in mind
    }

    if (currentState == state.Tablet) {
        if ($(carousel).hasClass("milestoneCarousel")) {
            return (Math.floor(maxDisplay / 1.5));   // Reduce number of milestones shown as this will keep them a decent size
        } else {
            var carouselWidth = ($(window).width() - 120);   // Width - 120 as 60px margin to each side of content to keep centered
            var maxShownAtMinSize = (Math.floor(parseInt(carouselWidth / 250)));   // Minimum size of 250px for each item

            if (maxShownAtMinSize > maxDisplay) {
                return maxDisplay;
            }

            return maxShownAtMinSize;
        }
    }

    return 1; // In mobile view, will only show one at a time
}

function sortCodeFinderLinkReset() {
    $("#forgotPasswordLink").click(function (e) {
        e.preventDefault();
        $(".forgotPasswordForm").slideDown("slow");
    });
}

// Labels in place for use on browsers IE 9 or lower, remove labels to use placeholders on those which can.
function removeLabelsFromForms() {
    // Origanal code here can be found in master.cshtml
    var IEFormVersion = GetIEVersion();
    if (((IEFormVersion != -1) && (IEFormVersion > 9)) || IEFormVersion == -1) {
        $('label.removeable').attr('style', 'display: none');

        $('input[type="radio"]').each(function () {
            var idVal = $(this).attr("id");
            $("label[for='" + idVal + "']").css("clear", "none");
        });
    }
}

// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
function GetIEVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

// remove the scroll down arrow
function removeScrollDownArrow() {
    $(this).one('scroll', function () {
        $(".scrollContainer").fadeOut();
    });
}

function mainMenuControl() {
    $("#tools .menu").click(function () {
        $("#overlay").removeClass("tileOverlay");
        $("#overlay").css("background-color", "");
        $("#overlay").empty();
        $("#overlay").fadeIn(function () {
            $("#menu").fadeIn();
        });
    });

    $("#overlay").click(function (e) {
        if ($(e.target).is($("#overlay"))) {
            $("#menu").fadeOut(function () {
                $("#overlay").fadeOut();
            });
            $("#search").fadeOut(function () {
                $("#overlay").fadeOut();
                $("#search .searchResults").empty();
                $("#search input").val('');
            });
            if ($(this).find(".thankYou") > 0) {
                $(this).find("a.close").click();
            }
            if ($(this).hasClass("tileOverlay")) {
                $("#overlay").fadeOut(1000);
                $("#overlay").removeClass("tileOverlay");
                $("#overlay").css("background-color", "");

                var overlay = $("#overlay .overlay");
                if (overlay.hasClass("videoContent")) {
                    if (overlay.find(".flash").length > 0) {
                        var tempVideo = _this.find(".flash").clone();
                        var parent = _this.find(".flash").parent();
                        overlay.find(".flash").remove();
                        parent.append(tempVideo);
                    } else {
                        var video = overlay.find(".tileVideo");
                        video.get(0).pause();
                    }
                }
            }
            $("#overlay").empty();
        }
    });

    $("#menu a.close").click(function () {
        $("#menu").fadeOut(function () {
            $("#overlay").fadeOut();
        });
    });

    $("#tools .search").click(function () {
        $("#overlay").removeClass("tileOverlay");
        $("#overlay").css("background-color", "");
        $("#overlay").empty();
        $("#overlay").fadeIn(function () {
            $("#search").fadeIn();
            $("#search input").focus();
        });
    });

    $("#search a.close").click(function () {
        $("#search").fadeOut(function () {
            $("#overlay").fadeOut();
            $("#search .searchResults").empty();
            $("#search input").val('');
        });
    });
}

function contactMapLocationSwitchingControl() {
    addClickToLocationSwitch("rick");
    addClickToLocationSwitch("london");
}

function addClickToLocationSwitch(location) {
    var target = "a." + location;
    var opposite = (location === "london") ? "a.rick" : "a.london";
    $(target).click(function () {
        if (!$(this).hasClass("on")) {
            $(this).removeClass("off");
            $(this).addClass("on");

            $(opposite).addClass("off");
            $(opposite).removeClass("on");

            $('#contactMap').children().fadeOut(500, function () {
                $('#contactMap').empty();
                // Changes map based on its location
                (location === "london") ? changeMapToLondon() : changeMapToRickmansworth();
            });
        }
    });
}

function sortCodeFinderToggleFilterOptions() {
    toggleSortCodeFinderFilterOption("sortCode");
    toggleSortCodeFinderFilterOption("address");
}

function toggleSortCodeFinderFilterOption(option) {
    var opposite = (option === "address") ? "sortCode" : "address";
    $("a." + option).click(function () {
        if (!$(this).hasClass("on")) {
            $(this).removeClass("off");
            $(this).addClass("on");

            $("a." + opposite).addClass("off");
            $("a." + opposite).removeClass("on");
            $("#form" + option.replace(option[0], option[0].toUpperCase())).show();
            $("#form" + opposite.replace(opposite[0], opposite[0].toUpperCase())).hide();
        }
    });
}

// wrapping multiple a tags in header sections in div to center
function wrapMultipleHeadingButtons() {
    if ($(".pageHeaderWithLink a.button").length > 1) {
        $(".pageHeaderWithLink a.button").wrapAll("<div class='buttonContainer' />");
    }
}

function contactMapResizeController() {
    if ($("a.london").hasClass("on")) {
        resetMapPosition("london");
    } else if ($("a.rick").hasClass("on")) {
        resetMapPosition("rick");
    } else {
        //Neither is on
    }
}

function InitTransactionCounter() {
    if ($("#TransactionCounter").length > 0) {
        //Transaction per day:  29,684,212
        //Transaction per hour: 1,236,842
        //Transaction per min:  20,614
        //Transaction per sec:  344
        var now = new Date();
        var lastmidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        var diff = now.getTime() - lastmidnight.getTime();
        var diffSeconds = Math.ceil(diff / 1000);
        var changesPerSecond = 4;

        var myCounter = new flipCounter("TransactionCounter", {
            value: 344 * diffSeconds,
            inc: 344 / changesPerSecond,
            pace: 1000 / changesPerSecond
        });

        var totalWidth = 0;
        $("#TransactionCounter").children("ul").each(function () {
            totalWidth += $(this).outerWidth();
        });

        $("#TransactionCounter").css("width", totalWidth);
    }
}

function sortCodeInputController() {
    inputControlOnSortCodeSegment(1);
    inputControlOnSortCodeSegment(2);
    inputControlOnSortCodeSegment(3);
}

function inputControlOnSortCodeSegment(sortCodeSegementNumber) {
    var sortCodeSegment = "#SortCodePart" + sortCodeSegementNumber;
    $(sortCodeSegment).keyup(function (event) {
        // Disable shift ability
        if (event.shiftKey == true) {
            event.preventDefault();
        }

        // When only a number is pressed, above letters or in number pad
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
            if ($(sortCodeSegment).val().length >= 2) {
                if (sortCodeSegementNumber < 3) {
                    $("#SortCodePart" + (sortCodeSegementNumber + 1)).focus();
                }
                return false;
            }
        } else if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
            // Allow backspace, delete, left & right arrow to work as normal
            if ((event.keyCode == 8) && ($(sortCodeSegment).val().length == 0)) {
                // Backspace will move to previous sort code segment if not in first segment
                if (sortCodeSegementNumber > 1) {
                    $("#SortCodePart" + (sortCodeSegementNumber - 1)).focus();
                }
            }
        } else {
            // All other keys will not work, ie  letters, symbols
            event.preventDefault();
        }
    });
}

//Fixes so heading does not run into heading image area at mobile view
function MobileContentWithImageHeadingFix() {
    var screenWidth = $(window).width();
    var contentToUpdate = ".contentWithFeatureImage.bg.landing, .header";

    if ($(contentToUpdate).length > 0) {
        $(contentToUpdate).each(function () {
            var relatedHeader = $(this).find("h2");
            if ($(this).find(".moreInformationHeading").length > 0) {
                relatedHeader = $(this).find(".content");
            }

            var colour = $(this).find("a").css('border-color');

            if (currentState === state.Mobile) {
                if ($(contentToUpdate).hasClass("verticalCentered")) {
                    // No changes to this type of content appearence
                } else {
                    backgroundImageSize($(this), function (width, height) {
                        var backgroundImageHeight = Math.ceil(screenWidth / (width / height));
                        var newPaddingTop = (backgroundImageHeight + 40) + 'px !important';

                        $(relatedHeader).attr("style", "margin-top: " + $(relatedHeader).css("margin-top") + "; padding-top: " + newPaddingTop + "; color: " + colour + ";");
                    });
                }
            } else {
                $(relatedHeader).attr("style", "margin-top: " + $(relatedHeader).css("margin-top") + "; padding-top: initial; color: " + colour + ";");
            }
        });
    }
}

//Fixes so heading does not run into heading image area at mobile view
function PersonImageDisplayAssist() {
    var screenWidth = $(window).width();
    var contentToUpdate = ".personImage, .longHeader";

    if ($(contentToUpdate).length > 0) {
        $(contentToUpdate).each(function () {
            var relatedHeader = $(this).find(".informationContainer");

            if (screenWidth < 1000) {
                backgroundImageSize($(this), function (width, height) {
                    var backgroundImageHeight = Math.ceil(screenWidth / (width / height));
                    var newPaddingTop = (backgroundImageHeight + 40) + 'px';

                    $(relatedHeader).attr("style", "padding-top: " + newPaddingTop + "; padding-bottom: 0;");
                });
            } else {
                backgroundImageSize($(this), function (width, height) {
                    var backgroundImageHeight = Math.ceil(screenWidth / (width / height));
                    var newPadding = (backgroundImageHeight * 0.2) + 'px';

                    $(relatedHeader).attr("style", "padding: " + newPadding + " 0;");
                });
            }
        });
    }
}

function backgroundImageSize($element, callback) {
    $('<img />')
        .load(function () { callback(this.width, this.height); })
        .attr('src', $element.css('background-image').match(/^url\("?(.+?)"?\)$/)[1]);
}

function backgroundImageAllignmentFix() {
    $(".contentWithFeatureImage, .personImage").each(function () {
        if ($(this).find(".right").length > 0) {
            $(this).css("background-position-x", "0");
        } else {
            $(this).css("background-position-x", "100%");
        }
    });
}

function centerTextNextToIcon() {
    var elementOfInterest = $(".non-TileDoubleAndSingleWidth").find(".icon");

    if ($(elementOfInterest).length > 0) {
        $(elementOfInterest).each(function () {
            var textHeight = $(this).parent().siblings();
            if ($(textHeight).height() < $(this).height()) {
                var newMarginTop = ($(this).height() - textHeight.height()) / 2;
                $(textHeight).css('margin-top', newMarginTop + 'px');
            } else {
                $(textHeight).css('margin-top', '0');
            }
        });
    }
}

//Hide image on mobile. Show otherwise.
function ToggleFeaturedImage() {
    $("img.verticalCentered").parents(".contentWithFeatureImage").addClass("verticalCentered");
    var featuredSection = $(".contentWithFeatureImage.bg.landing.verticalCentered");
    var featuredImage = featuredSection.find("img.verticalCentered");
    var screenWidth = $(window).outerWidth(true) + 17; // Add 17 for browser scroll bar

    if (featuredSection.length > 0) {
        if (screenWidth < 700) {
            if (featuredImage.length > 0) {
                featuredImage.hide();
            }
        } else {
            if (featuredImage.length > 0) {
                featuredImage.show();
            }
        }
    }
}

function profileInfoDisplayFeature() {
    $(".profile").click(function () {
        if ($(".info", this).css("top") === "0px") {
            // check state, mobile is 272
            if ($(window).width() > 800) {
                $(".info", this).animate({
                    top: 345
                });
            } else {
                $(".info", this).animate({
                    top: 335
                });
            }

            // On load, there are empty p tags, these br's are to replace those once gone to keep look reight
            var returnPadding = $(this).find("p:first").html() + "<br/><br/><br/><br/><br/>";
            $(this).find("p:first").html(returnPadding);

            $(".info img.icon.open", this).hide();
            $(".info img.icon.closed", this).show();
        } else {
            $(".info", this).animate({
                top: 0
            });

            // On first time expanding, removes empty p tags to give more room for text
            $(this).find('p').each(function () {
                var $this = $(this);
                if ($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $this.remove();
            });
            // If not first time clicked, will have br's to remove instead of empty p tags
            $(this).find('br').each(function () {
                $(this).remove();
            });

            $(".info img.icon.closed", this).hide();
            $(".info img.icon.open", this).show();
        }
    });

    var icons = {
        header: "board-accordion-closed-icon",
        activeHeader: "board-accordion-open-icon"
    }
    $("#boardMembersList").accordion({
        heightStyle: "content",
        collapsible: true,
        icons: icons,
        header: ".memberIntro"
    });
}

function prioritiesInfoDisplayFeature() {
    var icons = {
        header: "accordion-closed-icon",
        activeHeader: "accordion-open-icon"
    }
    $(".accordionInline").accordion({
        heightStyle: "content",
        collapsible: true,
        icons: icons,
        header: ".accordionItemHeading"
    });

}

var AnimationIsRunning = false;
function DriftingImageController() {
    if ($(".hero").hasClass("withDriftingImage")) {
        var IEVersion = GetIEVersion();
        if (currentState === state.Desktop && !AnimationIsRunning) {
            if (((IEVersion != -1) && (IEVersion > 9)) || IEVersion == -1) {
                StartDriftingImageAnimation();
            }
        } else if (currentState !== state.Desktop) {
            if (((IEVersion != -1) && (IEVersion > 9)) || IEVersion == -1) {
                StopDriftingImageAnimation();
            }
        }
    }
}

var driftAnimationTime = 40000;
var animationContainer = $(".heroPlaceHolder");
function StartDriftingImageAnimation() {
    var halfDriftTime = 20000;

    animationContainer.stop().animate({
        'right': '0'
    }, halfDriftTime, RunAnimation);

    AnimationIsRunning = true;
}

function RunAnimation() {
    animationContainer.stop();
    var left = animationContainer.offset().left;  // Need to re-establish the start value after any animation and set other value to auto
    animationContainer.css({
        'left': left,
        'right': 'auto'
    }).animate({
        'left': '0'
    }, driftAnimationTime, function () {
        animationContainer.stop();
        animationContainer.css({
            'right': left,
            'left': 'auto'
        }).animate({
            'right': '0'
        }, driftAnimationTime, RunAnimation);
    });
}

function StopDriftingImageAnimation() {
    animationContainer.stop().css({
        'right': '-12%',
        'left': 'auto'
    });
    AnimationIsRunning = false;
}

function AddTilePositionClasses() {
    $(".col-4").each(function () {
        $(this).removeClass("left").removeClass("right");
        if ($(this).position().left < ($(window).width() / 2.5)) {
            $(this).addClass("left");
        } else {
            $(this).addClass("right");
        }
    });
}

function improveBackFeatureOnOverlays() {
    $("#backToParent").find(".button").click(function (event) {
        if (window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });
}

function Header3FlushWithTopOfPage() {
    var isFirst = true;
    $(".contentPage").children().each(function () {
        if (isFirst) {
            if ($(this).is("h3")) {
                $(this).css('margin-top', '0');
            }
        }
        isFirst = false;
    });
}

function DisplayFixToPrioritiesList() {
    //var introOfFocus = $("#prioritiesList").find(".priorityIntro").last();
    //var detailsOfFocus = $("#prioritiesList").find(".priorityDetails").last();

    //if (introOfFocus.hasClass("ui-accordion-header-active")) {
    //    introOfFocus.find("h4").css('border-bottom', 'none');
    //    var colour = "#" + introOfFocus.find("h4").css("color");
    //    detailsOfFocus.css('border-bottom', '3px solid ' + colour);
    //} else {
    //    detailsOfFocus.css('border-bottom', 'none');
    //    introOfFocus.find("h4").css('border-bottom', '3px solid');
    //}
}

//Background position animation is inconsistant across all browsers, here's a fix for firefox

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 */
(function ($) {
    // backgroundPosition[X,Y] get hooks
    var $div = $('<div style="background-position: 3px 5px">');
    $.support.backgroundPosition = $div.css('backgroundPosition') === "3px 5px" ? true : false;
    $.support.backgroundPositionXY = $div.css('backgroundPositionX') === "3px" ? true : false;
    $div = null;

    var xy = ["X", "Y"];

    // helper function to parse out the X and Y values from backgroundPosition
    function parseBgPos(bgPos) {
        var parts = bgPos.split(/\s/),
            values = {
                "X": parts[0],
                "Y": parts[1]
            };
        return values;
    }

    if (!$.support.backgroundPosition && $.support.backgroundPositionXY) {
        $.cssHooks.backgroundPosition = {
            get: function (elem, computed, extra) {
                return $.map(xy, function (l, i) {
                    return $.css(elem, "backgroundPosition" + l);
                }).join(" ");
            },
            set: function (elem, value) {
                $.each(xy, function (i, l) {
                    var values = parseBgPos(value);
                    elem.style["backgroundPosition" + l] = values[l];
                });
            }
        };
    }

    if ($.support.backgroundPosition && !$.support.backgroundPositionXY) {
        $.each(xy, function (i, l) {
            $.cssHooks["backgroundPosition" + l] = {
                get: function (elem, computed, extra) {
                    var values = parseBgPos($.css(elem, "backgroundPosition"));
                    return values[l];
                },
                set: function (elem, value) {
                    var values = parseBgPos($.css(elem, "backgroundPosition")),
                        isX = l === "X";
                    elem.style.backgroundPosition = (isX ? value : values["X"]) + " " +
                                                    (isX ? values["Y"] : value);
                }
            };
            $.fx.step["backgroundPosition" + l] = function (fx) {
                $.cssHooks["backgroundPosition" + l].set(fx.elem, fx.now + fx.unit);
            };
        });
    }
})(jQuery);
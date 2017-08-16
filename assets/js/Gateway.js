var gatewayAnimationTriggerOffset = 50;
var leftSlice;
var rightSlice;
var leftSliceContent;
var rightSliceContent;
var heroSlice;

$(function () {

	//is this a gateway page or landing page
	if ($(".gatewayGridSliceLeft").length || $(".gatewayGridSliceRight").length || $(".gatewayGridHero750WithText").length || $(".gatewayGridMiddle").length) {

		//find indivudual elements
		if ($(".gatewayGridSliceLeft").length) {
			leftSliceContent = $('.gatewayGridSliceLeft .contentContainer');
			leftSlice = $('.gatewayGridSliceLeft .slice-content');
		}
		if ($(".gatewayGridSliceRight").length) {
			rightSliceContent = $('.gatewayGridSliceRight .contentContainer');
			rightSlice = $('.gatewayGridSliceRight .slice-content');
		}

		if ($(".gatewayGridHero750WithText").length) {
			heroSlice = $(".gatewayGridHero750WithText .slice-content");
			heroSlice.css({ "transform": "skewX(-22deg)" })
		}

		//sets body class to be white
		$("body").addClass("slice-gateway-background");

		$(".grid-container").not(":first").each(function () {
			CreateWhiteOverlay(this);
		});

		GatewayScrollListener();
	} else {

		if ($(".sliceLeft").length) {
			leftSliceContent = $('.sliceLeft .contentContainer');
			leftSlice = $('.sliceLeft .slice-content');
		}

		if ($(".sliceRight").length) {
			rightSliceContent = $('.sliceRight .contentContainer');
			rightSlice = $('.sliceRight .slice-content');
		}
	}

	GatewayResizeListener();
});

// The white overlay that shows over the element before it's loaded in
function CreateWhiteOverlay(sliceGateway) {
	var whiteOverlay = "<div class='white-overlay'>&nbsp;</div>";
	$(sliceGateway).append(whiteOverlay);
	$(sliceGateway).addClass("offset");
}

function GatewayScrollListener() {
	GatewayScrollEvent();
	$(window).scroll(GatewayScrollEvent);
}

function GatewayResizeListener() {
	GatewayResizeEvent()
	$(window).resize(GatewayResizeEvent);
}

function GatewayResizeEvent() {

	//if page is in mobile view, reset css and set smaller scroll offset
	if ($("#mobileView").css("display") === "block") {
		gatewayAnimationTriggerOffset = 50;

		if (typeof rightSliceContent !== typeof undefined) {
			rightSliceContent.children().each(function () {
				$(this).attr("style", "");
			});
		}

		if (typeof leftSliceContent !== typeof undefined) {
			leftSliceContent.removeClass("slice-align-left");
			leftSliceContent.css({
				"width": "90%",
				"left": 0
			});
		}

		$(".grid-container").attr("style", "");
		$(".grid-container img").attr("style", "");
		$(".grid-container .contentContainer").attr("style", "");

	} else {

		// need to work out where the content needs to line up with the bottom of the skew
		if (typeof rightSliceContent !== typeof undefined) {
			
			var fullWidth = rightSliceContent.width();
			var fullHeight = rightSliceContent.outerHeight(true);
			var gatewayOffset = rightSliceContent.siblings(".slice-content").css("margin-left").replace("px", "");

			var skewOffset = (fullHeight / 2) * Math.tan(22 * Math.PI / 180);

			var contentLeftOffset = rightSliceContent.css("margin-left").replace("px", "");
			var width = (fullWidth * 1) + (gatewayOffset * 1) + (contentLeftOffset * 1) - skewOffset; // * 1 to ensure int not string

			rightSliceContent.children().not("a").each(function () {
				$(this).css({
					"width": width
				});
			});
		}

		if (typeof leftSliceContent !== typeof undefined) {
			
			leftSliceContent.addClass("slice-align-left");
			var left = -leftSlice.position().left + parseInt(leftSlice.css("marginLeft").replace("px", ""));
			leftSliceContent.css({ "left": left });
			left = -leftSlice.position().left + parseInt(leftSlice.css("marginLeft").replace("px", ""));
			var leftWidth = ($('.contentContainer:eq(0)').width() + parseInt($('.contentContainer:eq(0)').css("marginLeft").replace("px", ""))) - left;
			leftSliceContent.css({ "width": leftWidth });

		}

		if (typeof heroSlice !== typeof undefined) {
			var heroLeft = -(heroSlice.position().left + heroSlice.width());
			heroSlice.css({ "marginLeft": heroLeft });
		}

		gatewayAnimationTriggerOffset = 150;

		// ensure grid container heights are correct across all large widths
		// widest images are 2100 wide
		if ($(window).width() > 2100) {
			$(".grid-container").addClass("max-height");
		} else {
			$(".grid-container").removeClass("max-height");
		}

		$(".grid-container .contentContainer").each(function () {
			var totalHeightOfChildren = 0;

			$(this).children().each(function () {
				totalHeightOfChildren += $(this).outerHeight(true);
			});
			$(this).css({
				"maxHeight": totalHeightOfChildren
			});

			var gridContainer = $(this).parents(".grid-container");
			var gridBuffer = 120;
			var backgroundImage = $(this).siblings("img").first();

			// normal slice sections will have 2100x900
			var bgHeight = 900;
			var bgWidth = 2100;

			if (gridContainer.hasClass("grid-hero")) {
				bgHeight = 750;
			}

			var bgAspectRatio = bgHeight / bgWidth;
			var contentHeight = $(this).outerHeight(false);
			var containerHeight = $(window).width() * bgAspectRatio;
			var contentWithBuffer = contentHeight + gridBuffer;

			if (gridContainer.hasClass("grid-hero")) {

				// ensure the image is covering the section AND maintaining the aspect ratio
				var potentialImageHeight = contentWithBuffer;
				var potentialImageWidth = potentialImageHeight / bgAspectRatio;

				if (potentialImageWidth < $(window).outerWidth(true)) {
					potentialImageWidth = $(window).outerWidth(true);
					potentialImageHeight = potentialImageWidth * bgAspectRatio;
				} 

				gridContainer.find("img").first().attr("style", "height: " + potentialImageHeight + "px; width: " + potentialImageWidth + "px;");


				if (contentWithBuffer > containerHeight) {

					// fix  the height of the section
					gridContainer.attr("style", "padding-top: " + contentWithBuffer + "px;");

					


					if (!gridContainer.hasClass("vertical-lock")) {
						gridContainer.addClass("vertical-lock");
					}
				} else {
					gridContainer.attr("style", "");
					gridContainer.removeClass("vertical-lock");
				}
			}
		});
	}
}
// when the user scrolls, animate any gateway slices within the current viewport
function GatewayScrollEvent() {

	var topViewport = $(window).scrollTop();
	var bottomViewport = $(window).scrollTop() + $(window).height();
	var bottomBreakpoint = bottomViewport - gatewayAnimationTriggerOffset;
	var sliceGateways = $(".grid-container").not(":first");

	$.each(sliceGateways, function () {
		var thisTop = $(this).position().top;
		var thisBottom = thisTop + $(this).height();

		if ((thisTop > topViewport && thisTop < bottomBreakpoint) ||
            thisBottom > topViewport && thisBottom < bottomViewport) {
			RecursivelyFadeOutPreviousOverlay($(this));
		}
	});
}

// recursively fade out the overlay of an element and all of its children
function RecursivelyFadeOutPreviousOverlay(element) {

	$(element).find(".white-overlay").fadeOut(500);
	$(element).switchClass("offset", "", 1000, "easeOutCubic");

	if ($(element).prev(".grid-container").length > 0) {
		RecursivelyFadeOutPreviousOverlay($(element).prev(".grid-container"));
	}
}
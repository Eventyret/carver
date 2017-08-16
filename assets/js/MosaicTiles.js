$(function () {
    $(window).on('load', function () {
        keepTileShapeInTabletAndMobile();
        keepStategicBoxesShapeInTabletAndMobile();
        setupOverlaysOnTile();
        fixTileGridLayoutPlacementInMobile();
        allignImagesInTiles();
        allignImagesInStrategicBoxes();
    });

    $(window).on('resize', function () {
        keepTileShapeInTabletAndMobile();
        keepStategicBoxesShapeInTabletAndMobile();
        positionTileOverlay();
        fixTileGridLayoutPlacementInMobile();
        allignImagesInTiles();
        allignImagesInStrategicBoxes();
    });

    function fixTileGridLayoutPlacementInMobile() {
        if ($(window).width() < 700) {
            var elementBeforeTileGrid = $(".tileGridLayout").prev();
            if (elementBeforeTileGrid.hasClass("tileHeader")) {
                $(".tileGridLayout").css("margin-top", (elementBeforeTileGrid.find(".contentContainer").height() - elementBeforeTileGrid.height() + 40) + 'px');
            }
        } else {
            $(".tileGridLayout").css("margin-top", "40px");
        }
    }

    function keepTileShapeInTabletAndMobile() {
        var singleTileWidth = $(".col-4").find(".tile").outerWidth();
        if (singleTileWidth != 360) {
            // Wanting height of the tiles to be 88% of the width
            var requireHeight = Math.floor(singleTileWidth * 0.88);
            if ($(".tile").parents().find(".moreInformationlayout").length > 0) {
                // Tiles to have 2:1 ratio on overlay (more information) pages
                requireHeight = Math.floor(singleTileWidth * 0.25);
            }

            $(".tile").each(function () {
                if (!$(this).hasClass("overlay") && !$(this).hasClass("mosaicLogin")) {
                    $(this).css("height", requireHeight);
                }
            });

            // Check if any tile's content is causing a height difference, note the height
            var newHeight = 0;
            $(".tile").each(function () {
                if ((!$(this).hasClass("overlay") && !$(this).hasClass("mosaicLogin")) && ($(this).height() > requireHeight && $(this).height() > newHeight)) {
                    newHeight = $(this).height();
                }
            });

            // If a tile is taller, set all to this new height
            if(newHeight != 0) {
                $(".tile").each(function () {
                    if (!$(this).hasClass("overlay") && !$(this).hasClass("mosaicLogin")) {
                        $(this).css("height", newHeight);
                    }
                });
            }
        } else {
            $(".tile").each(function () {
                if (!$(this).hasClass("overlay") && !$(this).hasClass("mosaicLogin")) {
                    $(this).css("height", "");
                }
            });
        }
    }

    function keepStategicBoxesShapeInTabletAndMobile() {
        var singleBoxWidth = $(".strategicBox").outerWidth();
        if (singleBoxWidth != 360) {
            // Wanting height of the tiles to be 2/3 of the width ie 360 width gives 240 height
            var requireHeight = Math.floor(singleBoxWidth / 1.5);
            var bothAreas = $(this).find(".imgContainer, .content");
            var contentArea = $(this).find(".content");

            $(".strategicBox").each(function () {
                $(bothAreas).css("height", requireHeight);
            });

            // Check if any box's content is causing a height difference, note the height
            var newHeight = 0;
            $(".strategicBox").each(function () {
                if ($(contentArea).height() > requireHeight && $(contentArea).height() > newHeight) {
                    newHeight = $(contentArea).height();
                }
            });

            // If a box is taller, set all to this new height
            if (newHeight != 0) {
                $(".strategicBox").each(function () {
                    $(contentArea).css("height", newHeight);
                });
            }
        } else {
            $(".strategicBox").each(function () {
                $(bothAreas).css("height", "");
            });
        }
    }

    function setupOverlaysOnTile() {
        $(".tile, .quoteWithOverlayOption.pageContent").each(function () {
            var overlayLinkedTo = $(this);
            var overlayOfTile = $(this).siblings(".overlay");
            if (overlayOfTile.length > 0) {
                $(this).on("click", function () {
                    // Get colour from tile / quote section to apply to overlay background
                    var overlayBackingColour = "";
                    if ($(this).css("background-color") !== "rgb(255, 255, 255)") {
                        overlayBackingColour = "rgba" + $(this).css("background-color").slice(3, -1) + ", 0.85)";
                    }

                    // Apply colour to overlay background & show background
                    $("#overlay").addClass("tileOverlay").fadeIn();

                    // Clear overlay background of display overlay. Add & display new overlay
                    $("#overlay").empty().append(overlayOfTile.clone(true,true));

                    var overlayTopPosition = $(window).scrollTop() + ($(window).height()/4);
                    $("#overlay .overlay").css('top', overlayTopPosition).removeClass("hidden");

                    positionTileOverlay();
                });

                overlayOfTile.find("a.close").on("click", function () {
                    var overlay = $(this).parents(".overlay");
                    overlay.fadeOut(1000).addClass("hidden");
                    $("#overlay").fadeOut(1000);
                    $("#overlay").removeClass("tileOverlay");
                    $("#overlay").css("background-color", "");
                    if (overlay.hasClass("videoContent")) {
                        if (overlay.find(".flash").length > 0) {
                            // Pausing flash on close doesn't work, so remove the flash object
                            //and append it back in to force it to restart.
                            var tempVideo = _this.find(".flash").clone();
                            var parent = _this.find(".flash").parent();
                            overlay.find(".flash").remove();
                            parent.append(tempVideo);
                        } else {
                            var video = overlay.find(".tileVideo");
                            video.get(0).pause();
                        }
                    }
                });
            }
        });
    }

    function positionTileOverlay() {
        $(".overlay").each(function () {
            var screenWidth = $(window).width();
            var overlayWidth = $(this).width();
            var currentLeft = parseInt($(this).css("left").slice(0, -2));
            var overlayCenter = currentLeft + (overlayWidth / 2);

            // Check to see if cetnered Horizonally, correct if not
            if ((screenWidth / 2) != overlayCenter) {
                var difference = (screenWidth / 2) - overlayCenter;
                var newLeft = currentLeft + difference;

                $(this).css("left", (newLeft + 'px'));
            }
        });
    }

    function allignImagesInTiles() {
        $(".tile").each(function () {
            if ($(this).find("img").length > 0 && !$(this).hasClass("mosaicIcon")) {
                bestFitForImage($(this));
                centerImageOnFocalPoint($(this));
            }
        });
    }

    function allignImagesInStrategicBoxes() {
        $(".strategicBox").each(function () {
            bestFitForImage($(this));
            centerImageOnFocalPoint($(this));
        });
    }

    function bestFitForImage(tile) {
        // Make variables for elements working on
        var container = $(tile).find(".imgContainer");
        var image = $(tile).find("img");

        // Remove to check if this is still need if already applied
        image.removeClass("fullWidth");

        if (image.width() < container.width()) {
            image.addClass("fullWidth");
        }
    }

    function centerImageOnFocalPoint(tile) {
        if (!$(tile).hasClass("explore")) {
            // Make variables for elements working on
            var container = $(tile).find(".imgContainer");
            var image = $(tile).find("img");

            // Horizonal centering
            // Values required
            var containerWidth = container.width();
            var imgWidth = image.width();
            var imgFocalLeft = imgWidth * $(tile).find("img").attr("data-focal-left");

            // Calculated values required
            var maxPreventingRightSideGap = containerWidth - imgWidth;
            var differenceInLeft = (containerWidth / 2) - imgFocalLeft;

            if (differenceInLeft > 0) {
                image.css("left", 0);
            } else if (differenceInLeft < maxPreventingRightSideGap) {
                image.css("left", maxPreventingRightSideGap + 'px');
            } else {
                image.css("left", differenceInLeft + 'px');
            }

            // Vertical centering
            // Values required
            var containerHeight = container.height();
            var imgHeight = image.height();
            var imgFocalTop = imgHeight * $(tile).find("img").attr("data-focal-top");

            // Calculated values required
            var maxPreventingBottomGap = containerHeight - imgHeight;
            var differenceInTop = (containerHeight / 2) - imgFocalTop;

            if (differenceInTop > 0) {
                image.css("top", 0);
            } else if (differenceInTop < maxPreventingBottomGap) {
                image.css("top", maxPreventingBottomGap + 'px');
            } else {
                image.css("top", differenceInTop + 'px');
            }
        }
    }
});
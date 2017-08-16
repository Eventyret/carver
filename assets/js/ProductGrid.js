$(function () {
    "use strict";

    // Ensure this file doesn't run twice
    var productGridScriptExecutedKey = "productGridScriptExecuted?";
    if (window[productGridScriptExecutedKey]) {
        return;
    } else {
        window[productGridScriptExecutedKey] = true;
    }

    // Will be called for each <div class="productGrid"> on the page
    function InitGrid($grid) {
        HeroModuleInit($grid);
        AccordionModuleInit($grid);
        TextCarouselModuleInit($grid);
        ImageCarouselModuleInit($grid);
        MouseFocusOutlineRemoverInit($grid);
    }

    function HeroModuleInit($grid) {
        // Mute the looping videos, just in case
        $('.heroLoopingVideo').each(function (index, element) {
            element.volume = 0.0;
        });

        // When the feature videos end, hide it again
        $('.heroFeatureVideo').each(function (index, element) {
            element.addEventListener("ended", function (event) {
                $(element).removeClass("open");
            });
        })

        // When you click the 'play video' button, open the feature video
        $('.hoverSlideButton.opensVideo', $grid).click(function (event) {
            var $heroContainer = $(this).closest(".hero.featureHero");

            var $video = $(".heroFeatureVideo", $heroContainer).addClass("open");

            $video.get(0).play();

            return false;
        });
    }

    function AccordionModuleInit($grid) {
        $('.accordion', $grid).each(function (index, element) {
            $(element).accordion({
                heightStyle: "content",
                collapsible: true,
                header: ".accordionItemHeadingContainer",
                icons: false
            });
        });
    }

    function TextCarouselModuleInit($grid) {
        $('.textCarouselItems', $grid).each(function (index, element) {
            var $element = $(element);

            var $previousArrow = $element.parent().find('.carouselPrevious');
            var $nextArrow = $element.parent().find('.carouselNext');

            $(element).slick({
                slidesToShow: 1,
                prevArrow: $previousArrow,
                nextArrow: $nextArrow,
                mobileFirst: true,
                responsive: [
                    {
                        breakpoint: 700,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3
                        }
                    }
                ]
            });
        });
    }

    function ImageCarouselModuleInit($grid) {
        var imageMaxWidth = 960;

        $('.imageCarouselItems', $grid).each(function (index, element) {
            var $element = $(element);

            var $previousArrow = $element.parent().find('.carouselPrevious');
            var $nextArrow = $element.parent().find('.carouselNext');

            var initialControlFullHeight = parseInt($previousArrow.css('max-height'), 10);

            var $pagination = $(element).parent().find('.carouselPagination');

            var slickInstance = $(element).slick({
                slidesToShow: 1,
                prevArrow: $previousArrow,
                nextArrow: $nextArrow,
                adaptiveHeight: true /// TODO, is this wanted?
            })
            .on('setPosition', imageCarouselSlickSetPosition)
            .on('beforeChange', imageCarouselSlickBeforeChange);

            $pagination.on('click', '.carouselPaginationItem', function (ev) {
                $(element).slick("goTo", $(this).data('slide-index'));

                return false;
            });

            // Run the event handlers one time just to kick off active states
            imageCarouselSlickSetPosition(slickInstance);
            imageCarouselSlickBeforeChange(null, slickInstance, $(element).slick('slickCurrentSlide'), $(element).slick('slickCurrentSlide'));

            function imageCarouselSlickSetPosition(slick) {
                // This slick.setPosition event handler just moves the prev/next arrows up/down based on image width
                var imageCarouselItemWidth = $(element).find('.imageCarouselItem').outerWidth();
                var carouselControlsTopScalar = Math.min(imageCarouselItemWidth, imageMaxWidth) / imageMaxWidth; // [0,1] value of the image scale, with 1 being max scale

                var $controls = $previousArrow.add($nextArrow);

                $controls.css('max-height', "" + (initialControlFullHeight * carouselControlsTopScalar) + "px");
            }

            function imageCarouselSlickBeforeChange(event, slick, currentSlide, nextSlide) {
                $pagination.find('.carouselPaginationItem.active').removeClass('active');
                $pagination.find('.carouselPaginationItem[data-slide-index=' + nextSlide + ']').addClass('active');
            }
        });
    }

    // This function disables focus via mouse on certain elements, so that the outline doesn't appear
    // Yes, this can be done in CSS using the outline property, however outlinenone.com may persuade you otherwise
    var selectorsToRemoveMouseFocusOutlineFor = [
        '.accordionItemHeadingContainer',
        '.carouselButton'
    ];
    function MouseFocusOutlineRemoverInit($grid) {
        // On mouse down, add mouseFocus class, register a one-time focusout listener, then when focus is lost, remove said class. Easy.
        $(selectorsToRemoveMouseFocusOutlineFor.join(','), $grid).mousedown(function (event) {
            $(this).addClass("mouseFocus").one('focusout', function (innerEvent) {
                $(this).removeClass("mouseFocus");
            });
        });
    }

    // Kick off point
    var $grids = $(".productGrid");
    $grids.each(function (index, gridElement) {
        InitGrid($(gridElement));
    });
});
// currentState can be state.Mobile (0), state.Tablet (1) or state.Desktop (2)
$(function () {
    AttachSideBarScrollControl();
    AllignEiscdSidebarAndContent();
    AdjustLeadershipListWithSidebar();

    $(window).resize(function () {
        AttachSideBarScrollControl();
        AdjustLeadershipListWithSidebar();
    });

    $(document).scroll(function () {
        AttachSideBarScrollControl();
        AdjustLeadershipListWithSidebar();
    });

    function AttachSideBarScrollControl() {
        if (currentState !== state.Mobile) {
            if ($(".sidebarContainer").siblings("#EISCDContainer").length === 0) {
                scrollSidebarLinks();
            } else {
                scrollEISCDSidebarLinks();
            }
        } else {
            $(".sidebarContainer").removeClass("fixedPosition").removeClass("fixToBottom").removeClass("naturalPosition").removeClass("naturalTabletPosition");
        }
    }
});

// Content Page Sidebar links scrolling
function scrollSidebarLinks() {
    if ($(window).width() > state.Desktop) {
        if ($(this).scrollTop() > 160) {
            slidesidebar();

            var topOfsidebar = $(".sidebarContainer").position().top;
            var bottomOfsidebar = topOfsidebar + $(".sidebarContainer").height();
            var topOfConnect;

            // With the creation of Profile Container with Sidebar, need to handle a page with no Connect Bar
            if ($(".siteContainer").siblings(".connectBar").length !== 0) {
                topOfConnect = ($('.connectBar').offset().top - $(window).scrollTop());
            } else {
                topOfConnect = ($('.footer').offset().top - $(window).scrollTop());
            }

            if (bottomOfsidebar >= topOfConnect) {
                pinsidebarToBottom();
            }

            var relativeSidebarTop = $(".sidebarContainer").offset().top - $(window).scrollTop();
            if (relativeSidebarTop > 25) {
                slidesidebar();
            }
        } else if ($(this).scrollTop() < 420) {
            putsidebarBack();
        }
    } else {
        putsidebarBack();
    }
}

function scrollEISCDSidebarLinks() {
    var windowWidth = $(window).width();
    // With 3 subscription boxes in a row, the sidebar change point to and from fixed
    var scrollChangePoint = 1210;
    // When subscription boxes go to having 3 in row to 2
    if (windowWidth < 1195) {
        scrollChangePoint = 1850;
    }
    // When subscription boxes form a straight column
    if (windowWidth < 795) {
        scrollChangePoint = 2440;
    }

    if (windowWidth > state.Desktop) {
        if ($(this).scrollTop() > scrollChangePoint) {
            slidesidebar();

            var topOfsidebar = $(".sidebarContainer.eiscd").position().top;
            var bottomOfsidebar = topOfsidebar + $(".sidebarContainer.eiscd").height();
            var topOfConnect;

            if ($(".siteContainer").siblings(".connectBar").length !== 0) {
                topOfConnect = ($('.connectBar').offset().top - $(window).scrollTop());
            } else {
                topOfConnect = ($('.footer').offset().top - $(window).scrollTop());
            }

            if (bottomOfsidebar >= topOfConnect) {
                pinsidebarToBottom();
            }

            var relativeSidebarTop = $(".sidebarContainer.eiscd").offset().top - $(window).scrollTop();
            if (relativeSidebarTop > 25) {
                slidesidebar();
            }
        } else if ($(this).scrollTop() < scrollChangePoint) {
            putsidebarBack();
        }
    } else {
        putsidebarBack();
    }
}

function putsidebarBack() {
    var windowWidth = $(window).width();
    $(".sidebarContainer").removeClass("fixedPosition").removeClass("fixToBottom");

    if (windowWidth < 800 && windowWidth > 699) {
        $(".sidebarContainer").removeClass("naturalPosition").removeClass("naturalTabletPosition");
        $(".sidebarContainer, .sidebarContainer ul").addClass("applyMobileStyling");
    } else {
        $(".sidebarContainer, .sidebarContainer ul").removeClass("applyMobileStyling");
        $(".sidebarContainer").addClass("naturalPosition").addClass("naturalTabletPosition");
    }

    keepAllignmentWithSearch();
}

function slidesidebar() {
    var windowWidth = $(window).width();
    $(".sidebarContainer").removeClass("fixToBottom").removeClass("naturalPosition").removeClass("naturalTabletPosition");

    if (windowWidth < 800 && windowWidth > 699) {
        $(".sidebarContainer").removeClass("fixedPosition");
        $(".sidebarContainer, .sidebarContainer ul").addClass("applyMobileStyling");
    } else {
        $(".sidebarContainer, .sidebarContainer ul").removeClass("applyMobileStyling");
        $(".sidebarContainer").addClass("fixedPosition");
    }

    keepAllignmentWithSearch();
}

function pinsidebarToBottom() {
    var windowWidth = $(window).width();
    $(".sidebarContainer").removeClass("fixedPosition").removeClass("naturalTabletPosition").removeClass("naturalPosition");

    if (windowWidth < 800 && windowWidth > 699) {
        $(".sidebarContainer").removeClass("fixToBottom");
        $(".sidebarContainer, .sidebarContainer ul").addClass("applyMobileStyling");
    } else {
        $(".sidebarContainer, .sidebarContainer ul").removeClass("applyMobileStyling");
        $(".sidebarContainer").addClass("fixToBottom");
    }

    keepAllignmentWithSearch();
}

function keepAllignmentWithSearch() {
    var sidebarRight = $(window).width() - ($(".search").position().left + $(".search").width());
    $(".sidebarContainer.fixedPosition").css("right", sidebarRight);
}

function AllignEiscdSidebarAndContent() {
    if ($(".sidebarContainer").siblings("#EISCDContainer").length !== 0) {
        $(".contentPage h3").css("margin-top", "0");
    }
}

function AdjustLeadershipListWithSidebar() {
    if ($(".contentPage").find("#leadershipList").length !== 0) {
        if (currentState === state.Desktop) {
            $("#leadershipList").css("width", "880px");
            $(".profile:nth-child(3n-1)").css("margin-right", "30px");
        }
        // In tablet below 1160px of screen width, the sidebar overlaps profiles
        if ($(window).width() < 1160 && $(window).width() > 879) {
            $("#leadershipList").css("width", "600px");
        }
        // In tablet below 880px of screen width, the sidebar overlaps leadership list text
        if ($(window).width() < 880 && $(window).width() > 699) {
            $("#leadershipList").css("width", "430px");
        }
        if ($(window).width() < 699) {
            $("#leadershipList").css("width", "100%");
        }
    }
}
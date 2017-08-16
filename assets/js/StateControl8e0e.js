var state = { Mobile: 0, Tablet: 1, Desktop: 2 };
var currentState;

$(function () {
    var windowWidth;

    $(window).resize(function () {
        setCurrentState();
    });
    setCurrentState();

    /* Fires transitional events when the window reaches certain widths */
    function setCurrentState() {
        windowWidth = $(window).width();

        if (windowWidth >= 1200) {
            if (currentState != state.Desktop) {
                currentState = state.Desktop;
            }
        } else if (windowWidth < 1200 && windowWidth >= 700) {
            if (currentState != state.Tablet) {
                currentState = state.Tablet;
            }
        } else if (windowWidth < 700) {
            if (currentState != state.Mobile) {
                currentState = state.Mobile;
            }
        }
    }
});
$(function () {

    $("#overlay").on("click", ".close", function () {
        hideOverlay();
    });

    $(".staff-values").on("click", ".staff-box", function () {
        var staffOverlay = $(this).next().clone();

        $("#overlay").append(staffOverlay);
        staffOverlay.show();
        $("#overlay").fadeIn();

        if ($("#mobileView").css("display") === "block") {
            staffOverlay.css({ "top": $(window).scrollTop() + 60 });
        } else {
            staffOverlay.position({
                my: "center",
                at: "center",
                of: $(window)
            });
        }
    });

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key == "Escape" || evt.key == "Esc");
        } else {
            isEscape = (evt.keyCode == 27);
        }
        if (isEscape) {
            hideOverlay();
        }
    };

    function hideOverlay() {
        $("#overlay").fadeOut();
        $("#overlay").empty();
    }

});
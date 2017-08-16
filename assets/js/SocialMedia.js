$(function () {
    $(".share.twitter span.sharrre").sharrre({
        share: {
            twitter: true
        },
        enableHover: false,
        enableTracking: true,
        buttons: {
            twitter: {
                via: 'VocaLink'
            }
        },
        click: function (api, options) {
            api.openPopup('twitter');
            return false;
        }
    });

    $(".share.google span.sharrre").sharrre({
        share: {
            googlePlus: true
        },
        enableHover: false,
        enableTracking: true,
        click: function (api, options) {
            api.openPopup('googlePlus');
            return false;
        }
    });

    $(".share.linkedin span.sharrre").sharrre({
        share: {
            linkedin: true
        },
        enableHover: false,
        enableTracking: true,
        click: function (api, options) {
            api.openPopup('linkedin');
            return false;
        }
    });
});
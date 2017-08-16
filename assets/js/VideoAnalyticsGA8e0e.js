var gaSend;
$(document).ready(function () {
    setTimeout(function () {
        if ($(".siteContainer").find("video").length > 0) {
            $("video").each(function () {
                applyVideoAnalytics(this);
            });
        }
        if ($(".siteContainer").find("object[name]").length > 0) {
            $("object[name]").each(function () {
                applyVideoAnalytics(this);
            });
        }
    }, 1000);
});

function applyVideoAnalytics(video) {
    gaSend = ga.getAll()[0].get('name') + ".send";

    var videoPlayed = false;
    // videoStatus will be an array of booeans where 0 = 25% viewed, 1 = 50%, 2 = 75% & 3 = 100%
    var videoStatus = [false, false, false, false];
    var secondsCounter = 0.0;
    var videoName = "";
    if ($(video).attr("title") !== undefined) {
        videoName = 'Video: ' + $(video).attr("title");
    }
    if ($(video).attr("name") !== undefined) {
        videoName = 'Video: ' + $(video).attr("name");
    }
    $(video).on("timeupdate", function (event) {
        var url = $(video).find('source').attr('src');
        if (!videoPlayed) {
            ga(gaSend, {
                hitType: 'event',
                eventCategory: 'Video',
                eventAction: 'Play',
                eventLabel: videoName
            });
            videoPlayed = true;
        }
        var changeInTime = video.currentTime - secondsCounter;
        if (changeInTime > 0.25 || video.currentTime === video.duration) {
            videoStatus = onTrackedVideoFrame(video, video.currentTime, video.duration, videoStatus, videoName);
        }
        secondsCounter = video.currentTime;
    });
}

function onTrackedVideoFrame(video, currentTime, duration, videoStatus, videoName) {
    var totTime = parseInt(duration.toFixed(), 10);
    var quartTime = parseInt((totTime / 4).toFixed(), 10);
    var halfTime = parseInt((totTime / 2).toFixed(), 10);
    var threeQuartTime = totTime - quartTime;
    var elapsedTime = parseInt(currentTime.toFixed(), 10);

    if (elapsedTime === quartTime && !videoStatus[0]) {
        statusChange(videoStatus, videoName, '25%', 0);
    }
    if (elapsedTime === halfTime && !videoStatus[1]) {
        statusChange(videoStatus, videoName, '50%', 1);
    }
    if (elapsedTime === threeQuartTime && !videoStatus[2]) {
        statusChange(videoStatus, videoName, '75%', 2);
    }
    if (currentTime === duration && !videoStatus[3]) {
        statusChange(videoStatus, videoName, '100%', 3);
    }

    return videoStatus;
}

function statusChange(videoStatus, videoName, progress, statusToChange) {
    ga(gaSend, {
        hitType: 'event',
        eventCategory: 'Video',
        eventAction: 'Progress',
        eventLabel: videoName + ' ' + progress + ' Viewed'
    });
    videoStatus[statusToChange] = true;
}
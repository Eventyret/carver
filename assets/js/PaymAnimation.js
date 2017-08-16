$(function () {
    var ppmCanvasCtx;
    var hpwCanvasCtx;
    var vocalinkPurple = "#3b0083";
    var propositionAnimated = false;
    var hpm1Animated = false;
    var hpm2Animated = false;
    var hpm3Animated = false;

    //If container is available / if macro was used on the page
    if ($("#paymAnimationContainer").length > 0) {
        if ($(window).width() > 700) {
            ResizePaymentMechanismCanvas();
            ResizeHowPaymWorksCanvas();
            ppmCanvasCtx = document.getElementById("PushPaymentMechanismCanvas").getContext("2d");
            //hpwCanvasCtx = document.getElementById("HowPaymWorksCanvas").getContext("2d");

            //AddMeasureGrid();//Layer canvas with 100px grid for measuring
            AddArrowClickEvents();
            BeginAnimationListener();
        } else {
            //Mobile. do nothing
        }
    }

    function AddArrowClickEvents() {
        $(".bankServerQueries .downArrow").click(function () {
            DrawHowPaymWorks2();
        });
    }

    function BeginAnimationListener() {
        $(".downArrow").hide();

        AnimationScrollControl();
        $(window).scroll(function () {
            AnimationScrollControl();
        });
    }

    function AnimationScrollControl() {
        var paymContainerTop = $("#paymAnimationContainer").position().top;
        if ($(window).scrollTop() > paymContainerTop && !propositionAnimated) {
            propositionAnimated = true;
            DrawPropositionAnimation();
        }

        //if ($(window).scrollTop() > paymContainerTop + 300 && !hpm1Animated) {
        //    hpm1Animated = true;
        //    DrawHowPaymWorks1();
        //}

        //if ($(window).scrollTop() > paymContainerTop + 400 && !hpm2Animated) {
        //    hpm2Animated = true;
        //    DrawHowPaymWorks2();
        //}

        //if ($(window).scrollTop() > paymContainerTop + 1100 && !hpm3Animated) {
        //    hpm3Animated = true;
        //    DrawHowPaymWorks3();
        //}
    }

    function DrawPropositionAnimation() {
        var p2pToMobile = GetNewLine(150, 225, 320, 225);
        var accountToMobile = GetNewLine(430, 225, 590, 225);

        //Proposition & Payment method animation
        DrawLine(ppmCanvasCtx, p2pToMobile, vocalinkPurple, function () {
            setTimeout(function () {
                DrawLine(ppmCanvasCtx, accountToMobile, vocalinkPurple);
            }, 250);
        });
    }

    function DrawHowPaymWorks1() {
        var sendingToMid = GetNewLine(172, 75, 310, 75);
        var infrastructureToMid = GetNewLine(588, 75, 450, 75);

        var sendingMidToBank = GetNewLine(356, 74, 356, 402);
        var infrastructureMidToBank = GetNewLine(404, 74, 404, 404);

        //How paym works animation 1
        DrawLine(hpwCanvasCtx, sendingToMid, vocalinkPurple);
        DrawLine(hpwCanvasCtx, infrastructureToMid, vocalinkPurple, function () {
            $(".bankServerQueries .downArrow").fadeIn();
        });
    }

    function DrawHowPaymWorks2() {
        var bankToFaster = GetNewLine(380, 270, 380, 450);
        var fasterToPayment = GetNewLine(380, 550, 380, 650);

        DrawLine(hpwCanvasCtx, bankToFaster, vocalinkPurple, function () {
            setTimeout(function () {
                DrawLine(hpwCanvasCtx, fasterToPayment, vocalinkPurple);
            }, 250);
        });
    }

    function DrawHowPaymWorks3() {
        var beneficiaryToBank = GetNewLine(380, 900, 380, 1000);

        DrawLine(hpwCanvasCtx, beneficiaryToBank, vocalinkPurple);
    }

    function DrawLine(ctx, line, colour) {
        DrawLine(ctx, line, colour, null);
    }

    function DrawLine(ctx, line, colour, callback) {
        ctx.beginPath();
        ctx.moveTo(line.beginPosition.x, line.beginPosition.y);
        ctx.lineTo(line.currentPosition.x, line.currentPosition.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = colour;
        ctx.stroke();
        ctx.closePath();

        if (line.currentPosition.x != line.endPosition.x) {
            if (line.currentPosition.x < line.endPosition.x) {
                line.currentPosition.x += 2;
            } else {
                line.currentPosition.x -= 2;
            }
        }

        if (line.currentPosition.y != line.endPosition.y) {
            if (line.currentPosition.y < line.endPosition.y) {
                line.currentPosition.y += 2;
            } else {
                line.currentPosition.y -= 2;
            }
        }

        if ((line.currentPosition.x != line.endPosition.x) || (line.currentPosition.y != line.endPosition.y))
        {
            setTimeout(function () {
                DrawLine(ctx, line, colour, callback);
            }, 1);//Set speed of the line draw. Lower timeout means faster draw
        } else {
            if (callback) {
                callback();
            }
        }
    }

    function ResizePaymentMechanismCanvas() {
        $("#PushPaymentMechanismCanvas")
            .attr("height", $("#PushPaymentMechanism").outerHeight(true))
            .attr("width", $("#PushPaymentMechanism").outerWidth(true));
    }

    function ResizeHowPaymWorksCanvas() {
        $("#HowPaymWorksCanvas")
            .attr("height", $("#HowPaymWorks").outerHeight(true))
            .attr("width", $("#HowPaymWorks").outerWidth(true));
    }

    //Start x y, end x y
    function GetNewLine(x1, y1, x2, y2) {
        return line = {
            beginPosition: {
                x: x1,
                y: y1
            },
            currentPosition: {
                x: x1,
                y: y1
            },
            endPosition: {
                x: x2,
                y: y2
            }
        };
    }

    function AddMeasureGrid() {
        //x
        DrawLine(hpwCanvasCtx, GetNewLine(0,   0, 800,   0), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 100, 800, 100), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 200, 800, 200), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 300, 800, 300), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 400, 800, 400), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 500, 800, 500), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 600, 800, 600), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 700, 800, 700), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 800, 800, 800), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 900, 800, 900), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1000, 800, 1000), "#f00");//red to mark 1000px
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1100, 800, 1100), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1200, 800, 1200), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1300, 800, 1300), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1400, 800, 1400), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1500, 800, 1500), "#000");
        DrawLine(hpwCanvasCtx, GetNewLine(0, 1600, 800, 1600), "#000");

        //y
        DrawLine(hpwCanvasCtx, GetNewLine(  0, 0,   0, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(100, 0, 100, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(200, 0, 200, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(300, 0, 300, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(400, 0, 400, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(500, 0, 500, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(600, 0, 600, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(700, 0, 700, 1600), "#666");
        DrawLine(hpwCanvasCtx, GetNewLine(800, 0, 800, 1600), "#666");
    }
});
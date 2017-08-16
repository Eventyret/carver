$(function () {
    AddValidationOnKeyUp();
    AddValidationOnInputKeyDown();
    AddValidationOnClickEvent();
    DDOformOverlay();
    SetupForm();
    CheckFormStates();
    ApplyStyleChangeToDDOType();
});

function AddValidationOnKeyUp() {
    $("input, textarea").keyup(function (e) {
        if (e.which != 9) {
            ToggleErrorClass(ValidateElement($(this)), $(this));
            UpdateSubmitDisabledStatus();
        }
        // Allow a radio button which has been tabbed to to be checked when user presses 'Enter'
        if (e.which == 13 && $(this).is(':radio')) {
            $(this).attr('checked', true);
        }
    });
}

function AddValidationOnInputKeyDown() {
    $("input, textarea").keydown(function (e) {
        if (e.which == 9 && $(this).val() != "") {
            ToggleErrorClass(ValidateElement($(this)), $(this));
            UpdateSubmitDisabledStatus();
        }
    });
}

function AddValidationOnClickEvent() {
    $("input:radio, input:checkbox").click(function () {
        if(ElementNeedsValidation($(this))) {
            ToggleErrorClass(ValidateElement($(this)), $(this));
            UpdateSubmitDisabledStatus();
        }
    });
}

function SetupForm() {
    // Remove paragraphs which give information which is not needed with jQuery working
    $(".invoiceInformation").css('display', 'none');
    $(".currentContactInformation").css('display', 'none');
    $(".userNumberInformation").css('display', 'none');

    // Show User number if the form type is Amend or Leave
    ShowHideUserNumber();

    // Show reason for leaving if the form type is Leave
    ShowHideReasonForLeaving();

    // If the different invoice address option is checked, show the invoice section
    ShowHideInvoiceSection();

    // If this is an amend form, it will have an amend currect contacts option...
    if ($("#ReplaceCurrentContacts").length > 0) {
        // Show current contacts section if option is checked...
        ShowHideCurrentContactsSection();
        CurrentContactsHandler();

        // And have first and second contacts dorment if their corresponding current first name and surname have not been filled in.
        ActiveDormentFirstContactSection();
        ActiveDormentSecondContactSection();
    }

    // Set up the status for the submit button
    UpdateSubmitDisabledStatus();
}

function CheckFormStates() {
    // If form type changes, show or hide user number input as required
    $("input[name=DDOType]:radio").change(function () {
        ShowHideUserNumber();
        ShowHideReasonForLeaving();
        UpdateSubmitDisabledStatus();
    });

    // If the customers invoice address is the same as the company address, there is no need for the invoice section
    $("#DifferentInvoiceAddress").change(function () {
        ShowHideInvoiceSection();
        UpdateSubmitDisabledStatus();
    });

    // If this is an amend form, it will have an amend currect contacts option
    if ($("#ReplaceCurrentContacts").length > 0) {
        // Show current contacts section to allow the amendment of contact details if option is checked
        $("#ReplaceCurrentContacts").change(function () {
            ShowHideCurrentContactsSection();
            UpdateSubmitDisabledStatus();
        });

        // Show required field(s)
        $(".secondContactSection").find("input").each(function () {
            $(this).change(function () {
                CurrentContactsHandler();
            });
        });

        // Have first and second contacts dorment until their corresponding current first name and surname have been filled in
        $("#CurrentFirstContactFirstName, #CurrentFirstContactSurname").change(function () {
            ActiveDormentFirstContactSection();
            FixHelpfulLinkBackgroundColour();
        });
        $("#CurrentSecondContactFirstName, #CurrentSecondContactSurname").change(function () {
            ActiveDormentSecondContactSection();
            FixHelpfulLinkBackgroundColour();
        });

        FixHelpfulLinkBackgroundColour();
    }
}

function ShowHideUserNumber() {
    if ($('input[name="DDOType"]:checked').val() == "Amend" || $('input[name="DDOType"]:checked').val() == "Leave") {
        $("#UserNumber").removeClass("hidden");
        $('label[for="UserNumber"]').removeClass("hidden");
        $(".userNumberParagraph").removeClass("hidden");
    } else {
        $("#UserNumber").addClass("hidden");
        $('label[for="UserNumber"]').addClass("hidden");
        $(".userNumberParagraph").addClass("hidden");
    }
}

function ShowHideReasonForLeaving() {
    if ($('input[name="DDOType"]:checked').val() == "Leave") {
        $("#ReasonForLeaving").removeClass("hidden");
        $('label[for="ReasonForLeaving"]').removeClass("hidden");
    } else {
        $("#ReasonForLeaving").addClass("hidden");
        $('label[for="ReasonForLeaving"]').addClass("hidden");
    }
}

function ShowHideCurrentContactsSection() {
    if ($('input[name="ReplaceCurrentContacts"]:checked').length > 0) {
        $(".currentContactsSection").removeClass("hidden");
    } else {
        $(".currentContactsSection").addClass("hidden");
    }
}

function ShowHideInvoiceSection() {
    if ($('input[name="DifferentInvoiceAddress"]:checked').length > 0) {
        $(".invoiceSection").removeClass("hidden");
    } else {
        $(".invoiceSection").addClass("hidden");
    }
}

function ActiveDormentFirstContactSection() {
    if (($("#CurrentFirstContactFirstName").val() != "") && ($("#CurrentFirstContactSurname").val() != "")) {
        $(".firstContactSection").find("input").each(function () {
            $(this).removeAttr('disabled');
        });
    } else {
        $(".firstContactSection").find("input").each(function () {
            $(this).attr('disabled', 'disabled');
        });
    }
}

function ActiveDormentSecondContactSection() {
    if (($("#CurrentSecondContactFirstName").val() != "") && ($("#CurrentSecondContactSurname").val() != "")) {
        $(".secondContactSection").find("input").each(function () {
            $(this).removeAttr('disabled');
        });
    } else {
        $(".secondContactSection").find("input").each(function () {
            $(this).attr('disabled', 'disabled');
        });
    }
}

function FixHelpfulLinkBackgroundColour() {
    $(".helpfulLink").each(function () {
        var colour = $(this).siblings(".withHelpfulLink").css('background-color');
        $(this).css('background-color', colour);
    });
}

function CurrentContactsHandler() {
    $("#CurrentFirstContactFirstName, #CurrentFirstContactSurname, #CurrentSecondContactFirstName, #CurrentSecondContactSurname").each(function () {
        $(this).change(function () {
            if (HasValidFieldInCurrentContacts()) {
                if (ValidateElement($("#CurrentFirstContactFirstName")) || ValidateElement($("#CurrentFirstContactSurname"))) {
                    if (!ValidateElement($("#CurrentSecondContactFirstName")) && !ValidateElement($("#CurrentSecondContactSurname"))) {
                        $("#CurrentSecondContactFirstName, #CurrentSecondContactSurname").removeClass("error");
                    }
                } else {
                    $("#CurrentFirstContactFirstName, #CurrentFirstContactSurname").removeClass("error");
                }
            }
        });
    });
}

function HasValidFieldInCurrentContacts() {
    validFieldFound = false;
    $(".currentContactsSection").find("input").each(function () {
        if (ValidateElement($(this))) {
            validFieldFound = true;
        }
    });

    return validFieldFound;
}

//http://stackoverflow.com/questions/2855865/jquery-regex-validation-of-e-mail-address
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

//http://stackoverflow.com/questions/6960596/example-of-a-regular-expression-in-jquery-for-phone-numbers
function isValidPhoneNumber(phoneNumber) {
    var pattern = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
    return pattern.test(phoneNumber);
};

function isValidPostCode(PostCode) {
    var pattern = new RegExp(/^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/g);
    return pattern.test(PostCode);
};

function ValidateElement(element) {
    var isValid = true;
    if ($(element).val() !== "") {
        // Email validation
        if ($(element).attr("id").indexOf("Email") !== -1) {
            if (!isValidEmailAddress($(element).val())) {
                isValid = false;
            }
        }
        // Phone validation
        if ($(element).attr("id").indexOf("Telephone") !== -1) {
            if (!isValidPhoneNumber($(element).val())) {
                isValid = false;
            }
        }
        // Post code format
        if ($(element).attr("id").indexOf("PostCode") !== -1) {
            if ($(element).attr("id").indexOf("Invoice") === 0) {
                if ($(element).val() != "") {
                    if (!isValidPostCode($(element).val())) {
                        isValid = false;
                    }
                }
            }
        }
        // Checkbox validation
        if ($(element).is(':checkbox')) {
            if (!$(element).is(':checked')) {
                isValid = false;
            }
        }
        // Radio button validation
        if ($(element).is(':radio')) {
            var groupName = $(element).attr('name');
            if (!$("input[name=" + groupName + "]:checked").val()) {
                isValid = false;
            }
        }
    } else if ($(element).val() === "" && $(element).attr("id").indexOf("Invoice") === 0) {
        isValid = true;
    } else {
        isValid = false;
    }

    return isValid;
}

function ToggleErrorClass(isValid, element) {
    if (isValid) {
        $(element).removeClass("error");
    } else {
        $(element).addClass("error");
    }
}

function UpdateSubmitDisabledStatus() {
    if (IsSectionValid()) {
        $(".next, .register").removeAttr('disabled');
    } else {
        $(".next, .register").attr('disabled', 'disabled');
    }
}

function IsSectionValid() {
    var sectionValid = true;
    $(".formSection").each(function () {
        var section = $(this);
        if ($(section).find(".active").length > 0) {
            $(section).find("input:visible, textarea:visible").each(function () {
                if (ElementNeedsValidation($(this))) {
                    if (!ValidateElement($(this))) {
                        sectionValid = false;
                    }
                }
            });
        }
    });

    return sectionValid;
}

function ElementNeedsValidation(element) {
    if ($(element).hasClass("button")) {
        return false;
    }

    if ($(element).is(':checkbox')) {
        if ($(element).attr("id") != "Agree" && $(element).attr("id") != "Completed") {
            return false;
        }
    }

    if ($(element).is('[disabled=disabled]')) {
        return false;
    }

    // In Amend, client may not wish to change this option
    if ($(element).is(':radio')) {
        var groupName = $(element).attr('name');
        if (($(element).attr('name') == "LicenceInformation") && (FORM_TYPE == "Amend")) {
            return false;
        }
    }

    // Check this element is one of the current contact names which may need validation
    var isCurrentNameElement = false;
    var allCurrentNameElementsAreEmpty = true;
    $("#CurrentFirstContactFirstName, #CurrentFirstContactSurname, #CurrentSecondContactFirstName, #CurrentSecondContactSurname").each(function () {
        if ($(this).attr("id") == $(element).attr("id")) {
            isCurrentNameElement = true;
        }
        if ($(this).val() != "") {
            allCurrentNameElementsAreEmpty = false;
        }
    });

    // Check if this is part of a name pair that don't need validation as both empty ie that contact is not needing amended
    if (isCurrentNameElement && !allCurrentNameElementsAreEmpty) {
        if ($("#CurrentFirstContactFirstName").val() == "" && $("#CurrentFirstContactSurname").val() == "") {
            if ($(element).attr("id") == $("#CurrentFirstContactFirstName").attr("id") || $(element).attr("id") == $(" #CurrentFirstContactSurname").attr("id")) {
                return false;
            }
        }
        if ($("#CurrentSecondContactFirstName").val() == "" && $("#CurrentSecondContactSurname").val() == "") {
            if ($(element).attr("id") == $("#CurrentSecondContactFirstName").attr("id") || $(element).attr("id") == $(" #CurrentSecondContactSurname").attr("id")) {
                return false;
            }
        }
    }

    // If makes here, this element will need validation
    return true;
}

function ApplyStyleChangeToDDOType() {
    $("input[name=DDOType]").parent().addClass("formSelector");
}

function DDOformOverlay() {
    if (ACTIVE_SECTION == "3") {
        AddClickAreasToForm();
        AddHelpfulOverlayClickHandler();
    }
    if (SHOW_THANK_YOU) {
        ShowThankYouOverlay();
    }
}

function AddClickAreasToForm() {
    $("#FirstContactSecurityInformation, #SecondContactSecurityInformation").each(function () {
        $(this).addClass("withHelpfulLink");
        $(this).after("<input type=\"button\" class=\"button helpfulLink\" value=\"?\" />");
    });
}

function SetupHelpfulOverlay() {
    $("#overlay").append("<div class=\"overlay helpful hidden\"></div>");
    $(".helpful").append("<a class=\"close\"></a>");
    $(".helpful").append("<div class=\"contentContainer\"></div>");
    $(".helpful").find(".contentContainer").append("<h2>Security Info</h2>");
    $(".helpful").find(".contentContainer").append("<p>Be sure to keep your Security info safe as you will be prompted to provide this when completing registration.</p>");
    $(".helpful").find(".contentContainer").append("<p>e.g. Your pets name, First place of work, favourite colour, etc...</p>");
}

function AddHelpfulOverlayClickHandler() {
    $(".helpfulLink").click(function () {
        SetupHelpfulOverlay();

        $("#overlay").css("background-color", "rgba(255,255,255, 0.5)");
        $("#overlay").fadeIn(1000);
        $(".overlay").fadeIn(1000).removeClass("hidden");

        $(".overlay").find("a.close").on("click", function () {
            $(".overlay").fadeOut(1000).addClass("hidden");
            $("#overlay").fadeOut(1000, function () {
                $("#overlay").empty();
                $("#overlay").css("background-color", "");
            });
        });
    });
}

function SetupThankYouOverlay() {
    $("#overlay").append("<div class=\"overlay thankYou hidden\"></div>");
    $(".thankYou").append("<a class=\"close\"></a>");
    $(".thankYou").append("<div class=\"contentContainer\"></div>");
    $(".thankYou").find(".contentContainer").append("<h2>Thank You</h2>");
    $(".thankYou").find(".contentContainer").append("<p>" + THANK_YOU_MESSAGE + " An email has been sent confirming your request.</p>");
}

function ShowThankYouOverlay() {
    SetupThankYouOverlay();

    $("#overlay").css("background-color", "rgba(255,255,255, 0.5)");
    $("#overlay").fadeIn(1000);
    $(".overlay").fadeIn(1000).removeClass("hidden");

    $(".overlay").find("a.close").on("click", function () {
        $(".overlay").fadeOut(1000).addClass("hidden");
        $("#overlay").fadeOut(1000, function () {
            $("#overlay").empty();
            $("#overlay").css("background-color", "");
            window.location.href = "index.html";
        });
    });
}
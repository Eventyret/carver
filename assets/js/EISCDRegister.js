$(function () {
    if (!$("#form").hasClass("eiscdHasError")) {
        CompressSections();
        AddButtonsForSections();
    } else {
        PopulateSummary();
    }
    AttachSummaryPopulationOnKeypress();
    AddValidationOnKeyUp();
    AddValidationOnInputKeyDown();
    AddValidationOnDropDownChange();

    PaymentPage();
});

var nextButton = "<button class='eiscdNext button'>Next</button>";
var backButton = "<button class='eiscdBack button'>Back</button>";
var europeanCountries = ["Åland Islands", "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Faroe Islands", "Finland", "France", "Germany", "Gibraltar", "Greece", "Guernsey", "Hungary", "Iceland", "Republic of Ireland", "Isle of Man", "Italy", "Jersey", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Republic of Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Republic of Kosovo", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Ukraine", "United Kingdom"];

function CompressSections() {
    $(".eiscdSection").addClass("closed");
    $(".eiscdSection h2").each(function () {
        $(this).addClass("inactive");
    });

    $(".eiscdSection").first().removeClass("closed").addClass("open").find("h2").removeClass("inactive");
}

function AddButtonsForSections() {
    $(".eiscdSection").each(function () {
        var nextClone = $(nextButton).clone();
        var backClone = $(backButton).clone();

        if (!$(this).is(":first-child") && !$(this).is(":last-child")) {
            backClone.appendTo($(this));

            backClone.click(function (e) {
                e.preventDefault();
                    var thisIndex = $(this).parent(".eiscdSection").index();

                    $(".eiscdSection.open").removeClass("open").addClass("closed");
                    $($(".eiscdSection")[thisIndex - 1]).removeClass("closed").addClass("open");

                    $("h2").not(".inactive").addClass("inactive");
                    $($(".eiscdSection")[thisIndex - 1]).find("h2.inactive").removeClass("inactive");
            });
        }

        if (!$(this).is(":last-child")) {
            nextClone.appendTo($(this));

            nextClone.click(function (e) {
                e.preventDefault();

                if (IsSectionValid($(this).parent(".eiscdSection"))) {
                    var thisIndex = $(this).parent(".eiscdSection").index();

                    $(".eiscdSection.open").removeClass("open").addClass("closed");
                    $($(".eiscdSection")[thisIndex + 1]).removeClass("closed").addClass("open").find("input").first().focus();

                    $("h2").not(".inactive").addClass("inactive");
                    $($(".eiscdSection")[thisIndex + 1]).find("h2.inactive").removeClass("inactive");
                } else {
                    $(this).parent(".eiscdSection").find("input").each(function () {
                        ValidateElement($(this));
                    });
                    $(this).parent(".eiscdSection").find("select").each(function () {
                        ValidateElement($(this));
                    });
                    $($(this).parent(".eiscdSection")).find(".error").first().focus();
                }
            });
        } else {
            backClone.prependTo($(this).find(".eiscdFormField"));
            backClone.css("float", "left");
            backClone.click(function (e) {
                e.preventDefault();

                var thisIndex = $(this).parent(".eiscdSection").index();

                if (thisIndex === -1) {
                    //confirmation section
                    thisIndex = 4;
                }

                $(".eiscdSection.open").removeClass("open").addClass("closed");
                $($(".eiscdSection")[thisIndex - 1]).removeClass("closed").addClass("open");

                $("h2").not(".inactive").addClass("inactive");
                $($(".eiscdSection")[thisIndex - 1]).find("h2.inactive").removeClass("inactive");
            });
        }
    });
}

function AddValidationOnKeyUp() {
    $("input").keyup(function (e) {
        if (e.which != 9) {
            ValidateElement($(this));
        }
        // Allow a radio button which has been tabbed to to be checked when user presses 'Enter'
        if (e.which == 13 && $(this).is(':radio')) {
            $(this).attr('checked', true);
        }
    });
    // Allows validation on moving up and down in a drop down.
    $("select").keyup(function (e) {
        if (e.which == 38 || e.which == 40) {
            ValidateElement($(this));
        }
    });
}

function AddValidationOnInputKeyDown() {
    $("input").keydown(function (e) {
        if (e.which == 9 && $(this).val() != "") {
            ValidateElement($(this));
            PopulateSummary();
        }
    });
    $("button").keydown(function (e) {
        if (e.which == 9) {
            if ($(this).hasClass("eiscdNext")) {
                $(this).parent(".eiscdSection").find('input').first().focus();
            }
        }
    });
}

function AddValidationOnDropDownChange() {
    $(".formField select").each(function () {
        $(this).change(function () {
            if ($(this).attr("id").indexOf("invoice") === 0) {
                ValidateElement($("#InvoicePostCodeZip"));
            } else if ($(this).attr("id").indexOf("country") === 0) {
                ValidateElement($("#CompanyPostCodeZip"));
                ValidateElement($("#VatNumber"));
            } else {
                //do nothing
            }
        });
    });
}

function IsSectionValid(section) {
    var isValid = true;
    var index = $(section).index();

    if (index == 0) {
        //checkboxes
        if (typeof $("input[name='licenseType']:checked").val() == typeof undefiend || typeof $("input[name='customerType']:checked").val() == typeof undefined) {
            isValid = false;
        }
    } else if (index == 1) {
        //company details
        $(section).find("select").each(function () {
            isValid = ValidateElement($(this));
        });
        $(section).find("input").each(function () {
            var isInvoice = $(this).attr("id").indexOf("Invoice") == 0;

            //Return false if any false shows, need to break out of the each if we find a false
            if ($(this).val() == "" && !isInvoice) {
                isValid = false;
            } else  {
                isValid = ValidateElement($(this));
            }

            if (!isValid) {
                return false;
            }
        });
    } else if (index == 2) {
        //contact details
        $(section).find("input").each(function () {
            if ($(this).val() == "") {
                isValid = false;
            } else {
                isValid = ValidateElement($(this));
            }
        });
    } else if (index == 3) {
        //summary
    }

    return isValid;
}

function AttachSummaryPopulationOnKeypress() {
    $("input").keyup(function () {
        PopulateSummaryItemByInput($(this));
    });

    $("input[type=radio][name=licenseType]").click(function () {
        var id = $(this).attr("id");
        $("label.LicenseType").text($("label[for='"+id+"']").text());

        //Toggle the terms and conditions that are relavant by License Type
        $(".termsAndConditions").hide();
        $(".termsAndConditions ." + id).parent().show();
    });

    $("input[type=radio][name=customerType]").click(function () {
        var id = $(this).attr("id");
        $("label.CustomerType").text($("label[for='" + id + "']").text());
    });
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
    //var pattern = new RegExp(/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i);
    var pattern = new RegExp(/^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/g);
    return pattern.test(PostCode);
};

function ValidateElement(element) {
    var isValid = true;
    if ($(element).val() !== "") {
        if ($(element).attr("id").indexOf("Email") !== -1) {
            if (!isValidEmailAddress($(element).val())) {
                isValid = false;
            }
        }
        //Phone validation
        if ($(element).attr("id").indexOf("Telephone") !== -1) {
            if (!isValidPhoneNumber($(element).val())) {
                isValid = false;
            }
        }
        //post code format
        if ($(element).attr("id").indexOf("PostCode") !== -1) {
            if ($(element).attr("id").indexOf("Invoice") === 0) {
                if ($(element).val() != "") {
                    if (!isValidPostCode($(element).val()) && $("#invoiceDropdown").find(":selected").text() === "United Kingdom") {
                        isValid = false;
                    }
                }
            } else {
                //only validate the postcode if its in the UK
                if (!isValidPostCode($(element).val()) && $("#countryDropdown").find(":selected").text() === "United Kingdom") {
                    isValid = false;
                }
            }
        }
        if ($(element).attr("id").indexOf("VatNumber") !== -1) {
            if ($(element).val().length < 2 && europeanCountries.indexOf($("#countryDropdown").find(":selected").text()) >= 0) {
                isValid = false;
            }
        }
    //VAT number validation if European country is selected
    } else if ($(element).val() === "" && $(element).attr("id").indexOf("VatNumber") !== -1) {if (europeanCountries.indexOf($("#countryDropdown").find(":selected").text()) >= 0) {
            isValid = false;
        }
    } else if ($(element).val() === "" && $(element).attr("id").indexOf("Invoice") === 0) {
        isValid = true;
    } else {
        isValid = false;
    }

    //Country selected
    if ($(element).attr("id").indexOf("countryDropdown") === 0) {
        if ($("#countryDropdown").val() === "Default") {
            isValid = false;
        }
    }

    if (isValid) {
        $(element).removeClass("error");
    } else {
        $(element).addClass("error");
    }

    return isValid;
}

function PopulateSummary() {
    $("input").each(function () {
        PopulateSummaryItemByInput($(this));
    });

    $("input[type=radio][name=licenseType]").each(function () {
        if ($(this).is(":checked")) {
            var _this = $(this);
            $("label.LicenseType").text($(_this).val());
        }
    });
    $("input[type=radio][name=customerType]").each(function () {
        if ($(this).is(":checked")) {
            var _this = $(this);
            $("label.CustomerType").text($(_this).val());
        }
    });
}

function PopulateSummaryItemByInput(input) {
    var value = $(input).val();
    var thisId = $(input).attr("id");
    var labelWithClass = "label." + thisId;
    if ($(labelWithClass).length > 0) {
        $(labelWithClass).text(value);
    } else if (thisId == "FirstContactFirstName" || thisId == "FirstContactSurname") {
        var firstname = $("#FirstContactFirstName").val();
        var surname = $("#FirstContactSurname").val();

        $("label.FirstContactName").text(firstname + " " + surname);
    } else if (thisId == "SecondContactFirstName" || thisId == "SecondContactSurname") {
        var firstname = $("#SecondContactFirstName").val();
        var surname = $("#SecondContactSurname").val();

        $("label.SecondContactName").text(firstname + " " + surname);
    }
}

function PaymentPage() {
    if ($("#switcher").length > 0) {
        $("#switcher a").click(function () {
            $("a.on").removeClass("on").addClass("off").find("div").hide();
            $(this).removeClass("off").addClass("on").find("div").show();

            if ($(".fasterPayments").hasClass("on")) {
                $(".fasterPaymentsContent").show();
            } else {
                $(".fasterPaymentsContent").hide();
            }

            if ($(".directDebit").hasClass("on")) {
                $(".directDebitContent").show();
            } else {
                $(".directDebitContent").hide();
            }
        });

        $("#switcher a.on").click();
    }
}
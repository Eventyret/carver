/* Preload script */
var images = new Array()
function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image()
        images[i].src = preload.arguments[i]
    }
}
preload(
    "media/1069/menu_mobile_grey.svg",
    "media/1070/menu_mobile_white.svg",
    "media/1102/menu_mobile_on.svg",
    "media/1071/menu_sectors_grey.svg",
    "media/1072/menu_sectors_white.svg",
    "media/1103/menu_sectors_on.svg",
    "media/1073/menu_support_grey.svg",
    "media/1074/menu_support_white.svg",
    "media/1104/menu_support_on.svg",
    "media/1067/menu_international_grey.svg",
    "media/1068/menu_international_white.svg",
    "media/1105/menu_international_on.svg",
    "media/1065/menu_roundel_grey.svg",
    "media/1066/menu_roundel_white.svg",
    "media/1106/menu_roundel_on.svg",
    "media/1075/menu_thoughtleadership_grey.svg",
    "media/1076/menu_thoughtleadership_white.svg",
    "media/1107/menu_thoughtleadership_on.svg",
    "media/1091/menu_paymentprocessing_grey.svg",
    "media/1092/menu_paymentprocessing_white.svg",
    "media/1108/menu_paymentprocessing_on.svg",
    "media/1314/menu_accessservices_grey.svg",
    "media/1318/menu_accessservices_white.svg",
    "media/1315/menu_accessservices_on.svg",
    "media/1316/menu_bankingservices_grey.svg",
    "media/1319/menu_bankingservices_white.svg",
    "media/1317/menu_bankingservices_on.svg"
)
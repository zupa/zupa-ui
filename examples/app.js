

$(document).ready(function(){

    // MAIN MENU
    $("#main-menu").zupaMainMenu({
        buttons: [{
            label: "Elements",
            menu: [{
                label: "Products"
            },
                {
                    label: "Services"
                },
                {
                    label: "Sectors"
                },
                {
                    label: "Projects"
                }]
        },
            {
                label: "Companies"
            },
            {
                label: "Orders"
            }]
    });


});


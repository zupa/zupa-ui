
$(document).ready(function(){

    // MAIN PANE
    $("#main-pane").zupaPane({
        pane: {
            center: {
                parent: true
            },
            north: {
                enabled: true,
                resizable: false,
                height: 70
            }
        },
        padding: 0,
        spacing: 0
    });

    // CONTENT PANE
    $("#content-pane").zupaPane({
        pane: {
            center: {
                parent: false
            },
            north: {
                enabled: true,
                resizable: false,
                height: 28
            },
            south: {
                enabled: true,
                height: 200
            },
            west: {
                enabled: true,
                width: 470
            },
            east: {
                enabled: true,
                width: 300
            }
        }
    });

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
            label: "Companies",
            link: "#/"
        },
        {
            label: "Orders",
            link: "#/table"
        }]
    });

    // TABS: WEST
    $("#west-tabs").zupaTabs({
        tabs: [{
            label: "Forms",
            content: "#tab-form-elements",
            scrollVertical: true
        },
        {
            label: "Loader",
            content: "#tab-loader"
        },
        {
            label: "Window",
            content: "#tab-window"
        }]
    });

    // LOADER
    $("#tab-loader").zupaLoader();
    $("#tab-loader").data('zupaLoader').showLoader("LOADING DATA");

    // CALENDAR
    $("#calendar-input").datepicker();

    // THUMBNAIL
    $("#field-thumb").zupaThumb({
        url: 'img/tree.png',
        size: 160
    });

    // TABLE
    $("#main-table").zupaTable({
        url: "http://hotell.difi.no/api/jsonp/brreg/enhetsregisteret",
        jsonp: "callback",
        path: {
            entries: "entries",
            total: "posts",
            page: "page",
            pages: "pages",
            count: "count",
            start: "start",
            sortcol: "sortcol",
            sortdir: "sortdir"
        },
        label: "Products",
        columns: [{
            name: "Org.nr",
            col: 'orgnr',
            searchable: true,
            sortable: true,
            resizable: true,
            width: "100px"
        },
        {
            name: "Navn",
            col: 'navn',
            searchable: true,
            sortable: true,
            resizable: true,
            width: "450px"
        },
        {
            name: "Adresse",
            col: "forretningsadr",
            searchable: true,
            sortable: true,
            resizable: true
        }]
    });

    // BUTTON MENU
    $("#button-menu").zupaButtonMenu({
        buttons: [{
            label: "File",
            menu: [{
                label: "New"
            },
            {
                label: "Open File"
            },
            {
                label: "Open Recent"
            },
            {
                label: "Close"
            },
            {
                label: "Close All"
            }]
        },
            {
                label: "Resources",
                menu: [{
                    label: "Alignment"
                },
                    {
                        label: "Actions"
                    },
                    {
                        label: "Filters"
                    }]
            },
            {
                label: "Window",
                menu: [{
                    label: "Customize perspective",
                    icon: "fa fa-trash-o"
                },
                    {
                        label: "Close all perspectives",
                        icon: "fa fa-thumb-tack"
                    },
                    {
                        label: "Preferences",
                        icon: "fa fa-tasks"
                    },
                    {
                        label: "Navigation",
                        icon: "fa fa-random",
                        menu: [{
                            label: "Show system menu",
                            menu: [{
                                label: "1. Element",
                                onClick: function(){
                                    console.log("HELL YEAH");
                                }
                            },
                                {
                                    label: "2. Element"
                                },
                                {
                                    label: "3. Element"
                                },
                                {
                                    label: "4. Element"
                                }]
                        },
                            {
                                label: "Quick Access",
                                menu: [{
                                    label: "1. Element"
                                },
                                    {
                                        label: "2. Element"
                                    },
                                    {
                                        label: "3. Element"
                                    },
                                    {
                                        label: "4. Element"
                                    }]
                            },
                            {
                                label: "Next View",
                                menu: [{
                                    label: "1. Element"
                                },
                                    {
                                        label: "2. Element"
                                    },
                                    {
                                        label: "3. Element"
                                    },
                                    {
                                        label: "4. Element"
                                    }]
                            }]
                    }]
            },
            {
                label: "Help"
            }]
    });


    // ACCORDION
    $("#main-accordion").zupaAccordion({
        panes: [{
            title: "Products"
        },
            {
                title: "Services"
            },
            {
                title: "Accounts"
            },
            {
                title: "Leverage"
            }]
    });


    // PLACEHOLDER
    $("#placeholder").zupaPlaceholder();


    // WINDOW ONE
    $("#open-window-one").click(function(){
        ZupaWindow({
            title: "Window",
            minimizable: false,
            centered: true,
            width: 350,
            height: 200
        }).open();
    });

    // CONTEXT MENU
    $("#context-menu-area").zupaContextMenu({
        trigger: 'leftclick',
        menu: [{
            label: "File",
            menu: [{
                label: "New"
            },
                {
                    label: "Open File"
                },
                {
                    label: "Open Recent"
                },
                {
                    label: "Close"
                },
                {
                    label: "Close All"
                }]
        },
            {
                label: "Resources",
                menu: [{
                    label: "Alignment"
                },
                    {
                        label: "Actions"
                    },
                    {
                        label: "Filters"
                    }]
            },
            {
                label: "Window",
                menu: [{
                    label: "Customize perspective",
                    icon: "fa fa-trash-o"
                },
                    {
                        label: "Close all perspectives",
                        icon: "fa fa-thumb-tack"
                    },
                    {
                        label: "Preferences",
                        icon: "fa fa-tasks"
                    },
                    {
                        label: "Navigation",
                        icon: "fa fa-random",
                        menu: [{
                            label: "Show system menu",
                            menu: [{
                                label: "1. Element",
                                onClick: function(){
                                    console.log("HELL YEAH");
                                }
                            },
                                {
                                    label: "2. Element"
                                },
                                {
                                    label: "3. Element"
                                },
                                {
                                    label: "4. Element"
                                }]
                        },
                            {
                                label: "Quick Access",
                                menu: [{
                                    label: "1. Element"
                                },
                                    {
                                        label: "2. Element"
                                    },
                                    {
                                        label: "3. Element"
                                    },
                                    {
                                        label: "4. Element"
                                    }]
                            },
                            {
                                label: "Next View",
                                menu: [{
                                    label: "1. Element"
                                },
                                    {
                                        label: "2. Element"
                                    },
                                    {
                                        label: "3. Element"
                                    },
                                    {
                                        label: "4. Element"
                                    }]
                            }]
                    }]
            },
            {
                label: "Help"
            }]
    });
});
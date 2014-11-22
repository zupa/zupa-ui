$(document).ready(function(){

    //MAIN PANE
    $("#mainPane").zupaPane({
        pane: {
            center: {
                parent: true
            },
            north: {
                enabled: true,
                height: "33.33333%",
                resizable: true,
                parent: true
            },
            south: {
                enabled: true,
                height: "33.33333%",
                resizable: true,
                parent: true
            },
            east: {
                enabled: true,
                width: "33.33333%",
                resizable: true,
                parent: true
            },
            west: {
                enabled: true,
                width: "33.33333%",
                resizable: true,
                parent: true
            }
        },
        padding: 8,
        spacing: 8
    });


    //SIDE PANE
    $(".sidePane").zupaPane({
        pane: {
            center: {
                parent: false
            },
            north: {
                enabled: true,
                height: "33.33333%",
                resizable: true,
                parent: false
            },
            south: {
                enabled: true,
                height: "33.33333%",
                resizable: true,
                parent: false
            },
            east: {
                enabled: true,
                width: "33.33333%",
                resizable: true,
                parent: false
            },
            west: {
                enabled: true,
                width: "33.33333%",
                resizable: true,
                parent: false
            }
        },
        padding: 0,
        spacing: 8
    });


    //SOUTH PANE
    $("#southPane").zupaPane({
        pane: {
            center: {
                parent: false
            },
            north: {
                enabled: true,
                height: 28,
                resizable: true
            },
            west: {
                enabled: true,
                width: 100
            },
            east: {
                enabled: true,
                width: 100
            }
        },
        padding: 0,
        spacing: 8
    });


    //FILES TABLE
    $("#filesTable").zupaTable({
        url: "http://localhost:8088/files",
        path: {
            entries: "list",
            total: "total",
            page: "page",
            pages: "pages",
            count: "count",
            start: "start",
            sortcol: "sortcol",
            sortdir: "sortdir"
        },
        label: "Files",
        columns: [{
            name: "ID",
            col: 'id',
            searchable: true,
            sortable: true,
            resizable: false,
            width: "50px"
        },
            {
                name: "Filename",
                col: 'filename',
                searchable: true,
                sortable: true,
                resizable: true
            },
            {
                name: "Path",
                col: 'path',
                searchable: true,
                sortable: false,
                resizable: true
            },
            {
                name: "Type",
                col: 'type',
                searchable: true,
                sortable: true,
                resizable: true
            }],
        onRowClick: function(row){

            //Open file in tab
            openFileInTab(row);
        }
    });


    //BUTTON MENU
    $("#buttonMenu").zupaButtonMenu({
        buttons: [{
            label: "File",
            menu: [{
                label: "New"
            },
                {
                    label: "Open File",
                },
                {
                    label: "Open Recent",
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
                        label: "Actions",
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
                label: "Help",
                menu: [{
                    label: "Check for updates"
                },
                    {
                        label: "Marketplace",
                    },
                    {
                        label: "About"
                    }]
            },]
    });
});


$(document).ready(function(){

    //SIDEBAR
//    $("#menubar").zupaMenubar();

    /**
     * TEST: Content Pane
     */
    $("#mainPane").zupaPane({
        pane: {
            west: {
                enabled: true,
                width: 500
            },
            east: {
                enabled: true,
                width: 300
            },
            north: {
                resizable: true,
                enabled: false,
                height: 100
            },
            south: {
                enabled: true,
                height: 200
            }
        }
    });

    $("#subaPane").zupaPane({
        pane: {
            west: {
                enabled: true,
                width: 100
            },
            east: {
                enabled: true,
                width: 100
            },
            north: {
                enabled: true,
                height: 50
            },
            south: {
                enabled: true,
                height: 50
            }
        },
        padding: 0
    });

    /**
     * TEST: Table
     */
    $("#productTable").zupaTable({
        url: "http://hotell.difi.no/api/jsonp/brreg/enhetsregisteret",
        pathEntries: "entries",
        pathTotal: "posts",
        label: "Products",
        columns: [{
                name: "Org.nr",
                col: 'orgnr',
                searchable: true,
                sortable: true,
                resizable: true,
                width: "50px"
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

    // TEST CHILD
    $("#testchild").zupaChild();


    /**
     * TEST: Tabs
     */
    $("#testTabs").zupaTabs({
        tabs: [{
                label: "Application",
                content: "#tab1",
                closeable: true
            },
            {
                label: "Products",
                content: "#testchild",
                closeable: true
            }]
    });

    $("#testTabs").data("zupaTabs").addTab({
        label: "Elements",
        content: "#tab4",
        closeable: true
    });

    $("#testTabs").data("zupaTabs").addTab({
        label: "Companies",
        content: "#tab5",
        closeable: true
    });

    $("#testTabs").data("zupaTabs").addTab({
        label: "Some long ass text that you wont believe",
        content: "#tab6",
        closeable: true
    });

    $("#testTabs").data("zupaTabs").addTab({
        label: "Datasheet",
        content: "#tab7",
        closeable: true
    });


    $("#accordionTest").zupaAccordion({
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

    //Calendar
    $( "#calendar-input" ).datepicker();

});







var Utils = {

    /**
     * Return the right value based on locale
     * @param word
     * @returns {*}
     */
    word: function(word){
        if(word == null || word == "" || word.map == null){
            return "";
        }

        return word.map["nb-no"].text;
    }

};

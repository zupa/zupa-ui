/*!
 * Zupa UI - Table
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

$.zupaTable = function(element, options) {

    var defaults = {
        url: null,					// REST url to get page
        pathEntries: "list",        // Path to entries
        pathTotal: "total",         // Path to amount of entries
        columns: null,				// Columns to be shown in table
        label: "Records",           // The name of the type the table is displaying
        start: 0,				    // Start at page number
        count: 10,				    // Number of records per page
        selectable: true,			// Are rows selectable?
        sortColumn: 0,				// Default sorted column index
        sortDirection: "asc",		// Sort direction
        onRowClick: null,			// Callback to click on row
        onRowDoubleClick: null,		// Callback to double click on row
        path: {
            entries: "list",        // Response path to list of entries
            total: "total",         // Response path to total value
            page: "page",           // (Option 1): Response path to current page value
            pages: "pages",         // (Option 1): Response path to total number of pages
            count: "count",         // (Option 2): Response path to number of records per page
            start: "start"          // (Option 2): Response path to start position of list request
        },
        language: {
            loading: "Loading",
            sortAscending: "Sort Ascending",
            sortDescending: "Sort Descending"
        }
    };

    //Variables
    var plugin = this;
    plugin.settings = {};

    //Extend default options
    plugin.settings = $.extend(true, {}, defaults, options);

    var $element = $(element);
    var $tableHeader = $('<div class="gui-table-header"></div>').hide();
    var $tableContent = $('<div class="gui-table-content"><div class="column-marker"></div><table><tbody></tbody></table></div>').hide();
    var $tableFooter = $('<div class="gui-table-footer"><div class="message-box"></div></div>').hide();
    var $messageBox = $tableFooter.find(".message-box");
    var $columnMarker = $tableContent.find(".column-marker");
    var $columnMenu = $('<div class="column-menu"><div class="column-menu-arrow"></div><div class="column-sort-asc gui-btn btn-fill"><i class="icon arrow-up"></i>'+plugin.settings.language.sortAscending+'</div><div class="column-sort-desc gui-btn btn-fill"><i class="icon arrow-down"></i>'+plugin.settings.language.sortDescending+'</div></div>').hide();

    /**
     * INITIALIZE
     */
    plugin.init = function(){

        //HTML
        $element.empty();
        $element.addClass("gui-table");

        //Append elements
        $element.append($tableHeader);
        $element.append($tableContent);
        $element.append($tableFooter);
        $element.append($columnMenu);

        //Loader
        $element.zupaLoader();
        plugin.loader = $element.data('zupaLoader');

        //Binding: Parent resize
        $element.parent().on('sizeHasChanged', function(event){
            if(event.target == $element.parent()[0]){
                containerResizeHandler();
            }
        });

        //Table content scrollbar
        $tableContent.mCustomScrollbar({
            theme: "light-thick",
            contentTouchScroll: true,
            mouseWheelPixels: "auto",
            scrollButtons:{
                enable: true
            },
            callbacks:{
                onTotalScroll:function(){
                    if(!plugin.loadingInProgress){
                        plugin.loadPage();
                    }
                },
                onTotalScrollOffset: 200,
                onOverflowY:function(){
                    plugin.drawSize();
                }
            }
        });

        // BIND: Row click
        if(typeof plugin.settings.onRowClick == "function"){
            $tableContent.on("click", "table tr", function(){
                plugin.settings.onRowClick($(this).data());
            });
        }

        // BIND: Column menu button
        $tableHeader.on("click", ".column-menu-button", function(){
            positionColumnMenu($(this));
        });

        // BIND: Sort Ascending
        $columnMenu.on("click", ".column-sort-asc", function(){
            plugin.sortColumnAscending(plugin.settings.selectedColumn);
        });

        // BIND: Sort Descending
        $columnMenu.on("click", ".column-sort-desc", function(){
            plugin.sortColumnDescending(plugin.settings.selectedColumn);
        });

        //Load initial rows
        plugin.loadPage();
    };


    /**
     * CONTAINER RESIZE HANDLER
     * Triggered when the container is resized.
     * The parent container must be higher than 0px before data can be fetched.
     */
    var containerResizeHandler = function(){
        if(plugin.settings.start > 0){
            plugin.drawSize();
        }else if(!plugin.loadingInProgress) {
            plugin.loadPage();
        }
    };

    /**
     * POSITION COLUMN MENU
     * Position the column menu according to the column that is beeing clicked
     */
    var positionColumnMenu = function(columnButton){

        //Check if already selected
        if(columnButton.hasClass("selected")){
            closeColumnMenu();
            return false;
        }

        //Selected column
        plugin.settings.selectedColumn = columnButton.parent().index();

        //Check if last
        var leftPos = null;
        if(columnButton.parent().is(':last-child') && !columnButton.parent().is(':first-child')){
            $columnMenu.addClass("menu-reversed");
            leftPos = columnButton.offset().left - $columnMenu.outerWidth() + 9;
        }else {
            $columnMenu.removeClass("menu-reversed");
            leftPos = columnButton.offset().left - 10;
        }

        $element.find(".column-menu-button").removeClass("selected");
        columnButton.addClass("selected");
        $columnMenu.css("left", leftPos);
        $columnMenu.show();
    };

    /**
     * CLOSE COLUMN MENU
     */
    var closeColumnMenu = function(){
        plugin.settings.selectedColumn == null;
        $element.find(".column-menu-button").removeClass("selected");
        $columnMenu.hide();
    };


    /**
     * LOAD PAGE
     * Load a new set of rows.
     * If filters has been applied we empty the table first.
     */
    plugin.loadPage = function(){

        //Loader
        plugin.loader.showLoader(plugin.settings.language.loading+" "+plugin.settings.label);

        //Set loading in progress
        plugin.loadingInProgress = true;

        //Set number of records message
        plugin.setMessage(plugin.settings.language.loading);

        //Calculate the number of records to load based on the height of the container
        var heightValue = $element.parent().height();
        if(heightValue < 100){
            heightValue = $(window).height();
        }
        plugin.settings.count = Math.round((heightValue/26)*2);

        //Columns
        var dColumns = "";
        var searchableColumns = "";{}

        for(var i = 0; i < plugin.settings.columns.length; i++){
            dColumns += plugin.settings.columns[i].col+";";

            if(plugin.settings.columns[i].searchable){
                searchableColumns += plugin.settings.columns[i].col+";";
            }
        }

        //Set parameters
        var params = {};
        params[plugin.settings.path.start] = plugin.settings.start;
        params[plugin.settings.path.count] = plugin.settings.count;

        //Sort
        if(plugin.settings.path.sortcol != null && plugin.settings.sortColumn != null){
            params[plugin.settings.path.sortcol] = plugin.settings.columns[plugin.settings.sortColumn].col;
            params[plugin.settings.path.sortdir] = plugin.settings.sortDirection;
        }


        //Make request
        $.ajax({
            url: plugin.settings.url,
            type: "GET",
            dataType: "json",
            async: true,
            data: params
        }).then(loadPageSuccess, loadPageFailure);
    };

    // Load page: SUCCESS
    var loadPageSuccess = function(data){
        plugin.loader.hideLoader();
        plugin.settings.start += plugin.settings.count;
        plugin.drawData(data);
    };

    // Load page: FAILURE
    var loadPageFailure = function(data){
        plugin.loader.hideLoader();
        plugin.loadingInProgress = false;
        console.log("FAILURE");
    };


    /**
     * SORT ASCENDING
     * Sort the table on this column in ascending order
     */
    plugin.sortColumnAscending = function(columnIndex){
        closeColumnMenu();
        plugin.settings.sortColumn = columnIndex;
        plugin.settings.sortDirection = "asc";
        plugin.resetTable();
        plugin.loadPage();
    };

    /**
     * SORT DESCENDING
     * Sort the table on this column in descending order
     */
    plugin.sortColumnDescending = function(columnIndex){
        closeColumnMenu();
        plugin.settings.sortColumn = columnIndex;
        plugin.settings.sortDirection = "desc";
        plugin.resetTable();
        plugin.loadPage();
    };


    /**
     * DRAW DATA
     * Table rows and headers are placed in the DOM.
     * @param data
     */
    plugin.drawData = function(data){

        //Draw Header
        $tableHeader.empty().append('<div class="holder"></div>');
        for(var i = 0; i < plugin.settings.columns.length; i++){
            var currentColumn = $('<div class="column"><div class="inner">'+plugin.settings.columns[i].name+'</div></div>');

            //Sortable
            if(plugin.settings.columns[i].sortable){
                currentColumn.append('<div class="column-menu-button"></div>');
            }

            //If sorted on column
            if(plugin.settings.sortColumn == i){
                if(plugin.settings.sortDirection == "asc"){
                    currentColumn.addClass("column-sort-asc");
                }else {
                    currentColumn.addClass("column-sort-desc");
                }
            }

            $tableHeader.find(".holder").append(currentColumn);
        }

        //Set resizable columns
        $tableHeader.find(".column").each(function(index, col){
            if(plugin.settings.columns[index] != null && plugin.settings.columns[index].resizable){
                $(col).append('<div class="resize-handle"></div>');

                $(col).find(".resize-handle").draggable({
                    axis: "x",
                    drag: function(){
                        var markerPos = parseInt($(this).css("left"))+parseInt($(this).parent().css("left"));
                        $columnMarker.css("left", markerPos);
                        $columnMarker.show();
                    },
                    stop: function(){
                        $columnMarker.hide();
                        var colPos = $(this).parent().index();
                        var colWidth = $(this).css("left");
                        plugin.settings.columns[colPos].width = colWidth+"px";
                        $(this).removeAttr("style");
                        plugin.drawSize();
                    }
                });

            }
        });

        // Draw table rows
        $.each(data[plugin.settings.path.entries], function(index, row){
            var rowData = $('<tr>');
            $.each(plugin.settings.columns, function(y, scol){
                $.each(row, function(key, val){
                    if(key == scol.col){

                        var colData = $('<td><div class="inner"></div></td>');

                        //Custom parsing
                        if(scol.parse != null && typeof scol.parse == "function"){
                            colData.find(".inner").append(scol.parse(row));
                        }else {
                            colData.find(".inner").append(val);
                        }

                        rowData.append(colData);
                    }
                });
            });
            rowData.data(row);
            $tableContent.find("table").append(rowData);
        });

        //Set number of records message
        plugin.setMessage("<b>"+data[plugin.settings.path.total]+"</b> "+plugin.settings.label);

        //Draw the sizes
        plugin.drawSize();
    };


    /**
     * DRAW SIZE
     * Update the different sizes of the table components
     */
    plugin.drawSize = function(){

        var globalWidth = $element.parent().width();
        var globalHeight = $element.parent().height();

        //If size is less than 150 we hide table
        if(globalHeight < 150){
            $tableHeader.hide();
            $tableFooter.hide();
            $tableContent.hide();
            return false;
        }else {
            $tableHeader.show();
            $tableFooter.show();
            $tableContent.show();
        }

        //if this is the initial load we have to show all elements and hide spinner
        if(!plugin.hasLoadedInital){
            $tableHeader.show();
            $tableContent.show();
            $tableFooter.show();
            plugin.hasLoadedInital = true;
        }


        //Parent
        $element.width(globalWidth);
        $element.height(globalHeight);

        //Header
        $tableHeader.width(globalWidth);

        if(globalHeight < 50){
            $tableHeader.hide();
        }else {
            $tableHeader.show();
        }

        //Footer
        $tableFooter.width(globalWidth);

        if(globalHeight < 150){
            $tableFooter.hide();
        }else {
            $tableFooter.show();
        }

        //Content
        $tableContent.width(globalWidth);
        $tableContent.height(globalHeight - $tableHeader.height() - $tableFooter.height());

        //Fix column widths
        $.each(plugin.settings.columns, function(index, obj){
            if(obj.width != null){

                var columnWidth = null;
                var pxIn = obj.width.indexOf("px");
                var perIn = obj.width.indexOf("%");

                if(pxIn >= 0){
                    columnWidth = parseInt(obj.width.substring(0, pxIn));
                }else if(perIn >= 0){
                    columnWidth = Math.floor((parseInt(obj.width.substring(0, perIn))/100) * globalWidth);
                }

                if(columnWidth != null){
                    $tableContent.find("table tr:first td:nth-child("+(index+1)+")").width(columnWidth);
                }
            }
        });

        //Set header position and width
        var leftPosCounter = 0;
        $tableContent.find("table tr:first td").each(function(index, obj){
            var headerWidth = $(obj).width();
            var actutalWidth = $(obj).outerWidth();
            $tableHeader.find(".holder .column:nth-child("+(index+1)+")").width(headerWidth).css("left", (leftPosCounter)+"px");
            leftPosCounter += actutalWidth;

        });

        //Set end loading process
        plugin.loadingInProgress = false;

        //Broadcast container size change
        $element.trigger("sizeHasChanged");

    };


    /**
     * EMPTY TABLE
     */
    plugin.resetTable = function(){
        plugin.settings.start = 0;
        $tableContent.find("table tbody").empty();
    };


    /**
     * SET MESSAGE
     */
    plugin.setMessage = function(message){
        $messageBox.html(message);
    };


    //Initialize Table
    plugin.init();

};


$.fn.zupaTable = function(options) {
    return this.each(function() {
        if (undefined == $(this).data('zupaTable')) {
            var plugin = new $.zupaTable(this, options);
            $(this).data('zupaTable', plugin);
        }
    });
};

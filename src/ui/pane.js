/*!
 * Zupa UI - Pane
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

$.zupaPane = function(element, options) {


    var defaults = {
        pane: {							// Pane configurations
            center: {					// CENTER PANE
                parent: false			// Center pane is parent for another nested pane instance
            },
            east: {						// EAST PANE
                enabled: false,			// Enable east pane
                resizable: true,		// East pane is resizable
                width: "25%",			// East pane width (pixels = int, percent = string)
                minWidth: 0,			// East pane minimum width in pixels
                parent: false			// East pane is parent for another nested pane instance
            },
            west: {						// WEST PANE
                enabled: false,			// Enable west pane
                resizable: true,		// West pane is resizable
                width: "25%",			// West pane width (pixels = int, percent = string)
                minWidth: 0,			// West pane minimum width in pixels
                parent: false			// West pane is parent for another nested pane instance
            },
            north: {					// NORTH PANE
                enabled: false,			// Enable north pane
                resizable: true,		// North pane is resizable
                height: "25%",			// North pane height (pixels = int, percent = string)
                minHeight: 0,			// North pane minimum height in pixels
                parent: false			// North pane is parent for another nested pane instance
            },
            south: {					// SOUTH PANE
                enabled: false,			// Enable south pane
                resizable: true,		// South pane is resizable
                height: "25%",			// South pane height (pixels = int, percent = string)
                minHeight: 0,			// South pane minimum height in pixels
                parent: false			// South pane is parent for another nested pane instance
            }
        },
        padding: 8,						// Pixels of padding around the edges of the pane container
        spacing: 8,						// Pixels of spacing between the individual panes
        offset: 2						// Border that adds to the width and height
    };

    var plugin = this;
    plugin.settings = {};


    var $element = $(element); // reference to the jQuery version of DOM element
    var $centerPane = $element.find("> .pane-center").addClass("gui-pane");
    var $westPane = $element.find("> .pane-west").addClass("gui-pane");
    var $eastPane = $element.find("> .pane-east").addClass("gui-pane");
    var $northPane = $element.find("> .pane-north").addClass("gui-pane");
    var $southPane = $element.find("> .pane-south").addClass("gui-pane");


    plugin.updateSettings = function(newSettings){
        plugin.settings = $.extend(true, {}, plugin.settings, newSettings);
        plugin.redraw();
    };

    /**
     * INITIALIZE
     */
    plugin.init = function() {

        //Extend default options
        plugin.settings = $.extend(true, {}, defaults, options);

        //Add class
        $element.addClass('gui-panes');

        //Wrap in container
        $centerPane.contents().wrapAll('<div class="pane-container"></div>');
        $westPane.contents().wrapAll('<div class="pane-container"></div>');
        $eastPane.contents().wrapAll('<div class="pane-container"></div>');
        $northPane.contents().wrapAll('<div class="pane-container"></div>');
        $southPane.contents().wrapAll('<div class="pane-container"></div>');

        //If pane inside another pane
        plugin.settings.isNestedPane = false;
        if($element.parent().hasClass("pane-container")){
            plugin.settings.isNestedPane = true;

            //Listen for parent pane size change
            $element.parent().on('sizeHasChanged', function(event){
                if(event.target == $element.parent()[0]){
                    plugin.redraw();
                }
            });
        }

        //Add Center
        $element.append($centerPane);

        //Parent
        if(plugin.settings.pane.center.parent){
            $centerPane.addClass("pane-parent");
        }

        //Add West
        if(plugin.settings.pane.west.enabled) {
            $element.append($westPane);

            //Parent
            var handleOffset = plugin.settings.offset / 2;
            if(plugin.settings.pane.west.parent){
                $westPane.addClass("pane-parent");
                handleOffset = 0;
            }

            //Resizable
            if(plugin.settings.pane.west.resizable){
                $westPane.resizable({
                    handles: "e",
                    minWidth: 0,
                    ghost: true,
                    stop: westResizeCallback
                });
                $westPane.find("> .ui-resizable-e").css({"width": plugin.settings.spacing, "right": -(plugin.settings.spacing + handleOffset)});
            }

        }else {
            $westPane.hide();
        }

        //Add East
        if(plugin.settings.pane.east.enabled){
            $element.append($eastPane);

            //Parent
            var handleOffset = plugin.settings.offset / 2;
            if(plugin.settings.pane.east.parent){
                $eastPane.addClass("pane-parent");
                handleOffset = 0;
            }

            //Resizable
            if(plugin.settings.pane.east.resizable){
                $eastPane.resizable({
                    handles: "w",
                    minWidth: 0,
                    ghost: true,
                    stop: eastResizeCallback
                });
                $eastPane.find("> .ui-resizable-w").css({"width": plugin.settings.spacing, "left": -(plugin.settings.spacing + handleOffset)});
            }

        }else {
            $eastPane.hide();
        }

        //Add North
        if(plugin.settings.pane.north.enabled){
            $element.append($northPane);

            //Resizable
            if(plugin.settings.pane.north.resizable){
                $northPane.resizable({
                    handles: "s",
                    minHeight: 0,
                    ghost: true,
                    stop: northResizeCallback
                });
                $northPane.find("> .ui-resizable-s").css({"height": plugin.settings.spacing, "bottom": -(plugin.settings.spacing+1)});
            }

            //Parent
            if(plugin.settings.pane.north.parent){
                $northPane.addClass("pane-parent");
            }
        }else {
            $northPane.hide();
        }

        //Add South
        if(plugin.settings.pane.south.enabled){
            $element.append($southPane);

            //Resizable
            if(plugin.settings.pane.south.resizable){
                $southPane.resizable({
                    handles: "n",
                    minHeight: 0,
                    ghost: true,
                    stop: southResizeCallback
                });
                $southPane.find("> .ui-resizable-n").css({"height": plugin.settings.spacing, "top": -(plugin.settings.spacing+1)});
            }

            //Parent
            if(plugin.settings.pane.south.parent){
                $southPane.addClass("pane-parent");
            }
        }else {
            $southPane.hide();
        }

        //TRIGGERS
        $(window).resize(windowResizeCallback);

        //BIND: Open/Close Panes
        $element.find(".ui-resizable-handler").off('dblclick');
        $element.find(".ui-resizable-e").on('dblclick', function(event){
            if(plugin.settings.pane.west.realWidth == 0){
                plugin.openWestPane();
            }else {
                plugin.closeWestPane();
            }
        });
        $element.find(".ui-resizable-w").on('dblclick', function(event){
            if(plugin.settings.pane.east.realWidth == 0){
                plugin.openEastPane();
            }else {
                plugin.closeEastPane();
            }
        });
        $element.find(".ui-resizable-n").on('dblclick', function(event){
            if(plugin.settings.pane.south.realHeight == 0){
                plugin.openSouthPane();
            }else {
                plugin.closeSouthPane();
            }
        });
        $element.find(".ui-resizable-s").on('dblclick', function(event){
            if(plugin.settings.pane.north.realHeight == 0){
                plugin.openNorthPane();
            }else {
                plugin.closeNorthPane();
            }
        });


        //Set sizes
        plugin.redraw();
    }


    /**
     * WINDOW RESIZE
     * Triggered whenever the browser window is resized
     */
    var windowResizeCallback = function(event, ui){
        if (!$(event.target).hasClass('ui-resizable') && event.target===this) {
            plugin.redraw();
        }
    };

    /**
     * RESIZE WEST PANE
     * Triggered whenever the west pane is resized.
     */
    var westResizeCallback = function(event, ui){
        var maxWidth = westMaxWidth();
        if(ui.size.width > maxWidth){
            plugin.settings.pane.west.realWidth = maxWidth;
        }else if(ui.size.width < plugin.settings.pane.west.minWidth){
            plugin.settings.pane.west.realWidth = plugin.settings.pane.west.minWidth;
        }else {
            plugin.settings.pane.west.realWidth = ui.size.width;
        }

        plugin.redraw();
    };

    /**
     * RESIZE EAST PANE
     * Triggered whenever the east pane is resized.
     */
    var eastResizeCallback = function(event, ui){
        var maxWidth = eastMaxWidth();
        if(ui.size.width > maxWidth){
            plugin.settings.pane.east.realWidth = maxWidth;
        }else if(ui.size.width < plugin.settings.pane.east.minWidth){
            plugin.settings.pane.east.realWidth = plugin.settings.pane.east.minWidth;
        }else {
            plugin.settings.pane.east.realWidth = ui.size.width;
        }
        plugin.redraw();
    };

    /**
     * RESIZE SOUTH PANE
     * Triggered whenever the south pane is resized.
     */
    var southResizeCallback = function(event, ui){
        var maxHeight = southMaxHeight();
        if(ui.size.height > maxHeight){
            plugin.settings.pane.south.realHeight = maxHeight;
        }else if(ui.size.height < plugin.settings.pane.south.minHeight){
            plugin.settings.pane.south.realHeight = plugin.settings.pane.south.minHeight;
        }else {
            plugin.settings.pane.south.realHeight =  ui.size.height;
        }
        plugin.redraw();
    };

    /**
     * RESIZE NORTH PANE
     * Triggered whenever the north pane is resized.
     */
    var northResizeCallback = function(event, ui){
        var maxHeight = northMaxHeight();
        if(ui.size.height > maxHeight){
            plugin.settings.pane.north.realHeight = maxHeight;
        }else if(ui.size.height < plugin.settings.pane.north.minHeight){
            plugin.settings.pane.north.realHeight = plugin.settings.pane.north.minHeight;
        }else {
            plugin.settings.pane.north.realHeight = ui.size.height;
        }

        plugin.redraw();
    };


    /**
     * WEST: MAX WIDTH
     * Calculate the max allowed with of the west pane
     * @returns {number}
     */
    var westMaxWidth = function(){
        var maxWidth = $element.parent().width()
            - plugin.settings.spacing       // west spacing
            - plugin.settings.offset*2      // west offset
            - plugin.settings.padding*2;    // pane padding

        if(plugin.settings.pane.east.enabled){
            maxWidth -= (plugin.settings.pane.east.realWidth + plugin.settings.spacing + plugin.settings.offset);
        }

        return maxWidth;
    };

    /**
     * EAST: MAX WIDTH
     * Calculate the max allowed with of the east pane
     * @returns {number}
     */
    var eastMaxWidth = function(){
        var maxWidth = $element.parent().width()
            - plugin.settings.spacing       // east spacing
            - plugin.settings.offset*2      // east offset
            - plugin.settings.padding*2;    // pane padding

        if(plugin.settings.pane.west.enabled){
            maxWidth -= (plugin.settings.pane.west.realWidth + plugin.settings.spacing + plugin.settings.offset);
        }

        return maxWidth;
    };


    /**
     * SOUTH: MAX HEIGHT
     * Calculate the max allowed height of the south pane
     * @returns {number}
     */
    var southMaxHeight = function(){
        var maxHeight = $element.parent().height()
            - plugin.settings.spacing       // south spacing
            - plugin.settings.offset*2      // south offset
            - plugin.settings.padding*2;    // pane padding

        if(plugin.settings.pane.north.enabled){
            maxHeight -= (plugin.settings.pane.north.realHeight + plugin.settings.spacing + plugin.settings.offset);
        }

        if(plugin.settings.isNestedPane){
            maxHeight -= plugin.settings.offset;
        }

        return maxHeight;
    };


    /**
     * NORTH: MAX HEIGHT
     * Calculate the max allowed height of the north pane
     * @returns {number}
     */
    var northMaxHeight = function(){
        var maxHeight = $element.parent().height()
            - plugin.settings.spacing       // north spacing
            - plugin.settings.offset*2      // north offset
            - plugin.settings.padding*2;    // pane padding

        if(plugin.settings.pane.south.enabled){
            maxHeight -= (plugin.settings.pane.south.realHeight + plugin.settings.spacing + plugin.settings.offset);
        }

        if(plugin.settings.isNestedPane){
            maxHeight -= plugin.settings.offset;
        }

        return maxHeight;
    };

    /**
     * CLOSE WEST PANE
     */
    plugin.closeWestPane = function(){
        if(plugin.settings.pane.west.realWidth > plugin.settings.pane.west.minWidth){
            plugin.settings.pane.west.lastWidth = plugin.settings.pane.west.realWidth;
            $westPane.animate(
                { width: plugin.settings.pane.west.minWidth },
                { step: function(now){
                    plugin.settings.pane.west.realWidth = Math.round(now);
                    plugin.redraw();
                }
                }, 300, function(){
                    plugin.settings.pane.west.realWidth = plugin.settings.pane.west.minWidth;
                    plugin.redraw();
//                        plugin.settings.pane.west.width = plugin.settings.pane.west.realWidth;
                });
        }
    };

    /**
     * OPEN WEST PANE
     */
    plugin.openWestPane = function(){
        var maxWidth = westMaxWidth();
        var openToWidth = plugin.settings.pane.west.lastWidth > maxWidth ? maxWidth : plugin.settings.pane.west.lastWidth;
        $westPane.animate(
            { width: openToWidth },
            { step: function(now){
                plugin.settings.pane.west.realWidth = Math.round(now);
                plugin.redraw();
            }
            }, 300, function(){
                plugin.settings.pane.west.realWidth = openToWidth;
                plugin.redraw();
            });
    };

    /**
     * CLOSE EAST PANE
     */
    plugin.closeEastPane = function(){
        if(plugin.settings.pane.east.realWidth > plugin.settings.pane.east.minWidth){
            plugin.settings.pane.east.lastWidth = plugin.settings.pane.east.realWidth;
            $eastPane.animate(
                { width: plugin.settings.pane.east.minWidth },
                { step: function(now){
                    plugin.settings.pane.east.realWidth = Math.round(now);
                    plugin.redraw();
                }
                }, 300, function(){
                    plugin.settings.pane.east.realWidth = plugin.settings.pane.east.minWidth;
                    plugin.redraw();
                });
        }
    };

    /**
     * OPEN EAST PANE
     */
    plugin.openEastPane = function(){
        var maxWidth = eastMaxWidth();
        var openToWidth = plugin.settings.pane.east.lastWidth > maxWidth ? maxWidth : plugin.settings.pane.east.lastWidth;
        $eastPane.animate(
            { width: openToWidth },
            { step: function(now){
                plugin.settings.pane.east.realWidth = Math.round(now);
                plugin.redraw();
            }
            }, 300, function(){
                plugin.settings.pane.east.realWidth = openToWidth;
                plugin.redraw();
            });
    };

    /**
     * CLOSE SOUTH PANE
     */
    plugin.closeSouthPane = function(){
        if(plugin.settings.pane.south.realHeight > plugin.settings.pane.south.minHeight){
            plugin.settings.pane.south.lastHeight = plugin.settings.pane.south.realHeight;
            $southPane.animate(
                { height: plugin.settings.pane.south.minHeight },
                { step: function(now){
                    plugin.settings.pane.south.realHeight = Math.round(now);
                    plugin.redraw();
                }
                }, 300, function(){
                    plugin.settings.pane.south.realHeight = plugin.settings.pane.south.minHeight;
                    plugin.redraw();
                });
        }
    };

    /**
     * OPEN SOUTH PANE
     */
    plugin.openSouthPane = function(){
        var maxHeight = southMaxHeight();
        var openToHeight = plugin.settings.pane.south.lastHeight > maxHeight ? maxHeight : plugin.settings.pane.south.lastHeight;
        $southPane.animate(
            { height: openToHeight },
            { step: function(now){
                plugin.settings.pane.south.realHeight = Math.round(now);
                plugin.redraw();
            }
            }, 300, function(){
                plugin.settings.pane.south.realHeight = openToHeight;
                plugin.redraw();
            });
    };

    /**
     * CLOSE NORTH PANE
     */
    plugin.closeNorthPane = function(){
        if(plugin.settings.pane.north.realHeight > plugin.settings.pane.north.minHeight){
            plugin.settings.pane.north.lastHeight = plugin.settings.pane.north.realHeight;
            $northPane.animate(
                { height: plugin.settings.pane.north.minHeight },
                { step: function(now){
                    plugin.settings.pane.north.realHeight = Math.round(now);
                    plugin.redraw();
                }
                }, 300, function(){
                    plugin.settings.pane.north.realHeight = plugin.settings.pane.north.minHeight;
                    plugin.redraw();
                });
        }
    };

    /**
     * OPEN NORTH PANE
     */
    plugin.openNorthPane = function(){
        var maxHeight = northMaxHeight();
        var openToHeight = plugin.settings.pane.north.lastHeight > maxHeight ? maxHeight : plugin.settings.pane.north.lastHeight;
        $northPane.animate(
            { height: openToHeight },
            { step: function(now){
                plugin.settings.pane.north.realHeight = Math.round(now);
                plugin.redraw();
            }
            }, 300, function(){
                plugin.settings.pane.north.realHeight = openToHeight;
                plugin.redraw();
            });
    };


    /**
     * REDRAW
     */
    plugin.redraw = function(){

        var padding = plugin.settings.padding;
        var spacing = plugin.settings.spacing;
        var border = plugin.settings.offset; //Border added to width or height

        var totalHeight = $element.parent().height();
        var totalWidth = $element.parent().width();

        //Nested inside another pane
//            if(plugin.settings.isNestedPane){
//
//            	if(plugin.settings.firstRun == null){
//                    var parentWidth = $element.parent().parent().width();
//                    $element.parent().parent().width(parentWidth+plugin.settings.offset);
//
//                    plugin.settings.firstRun = false;
//            	}
//
//                totalWidth += plugin.settings.offset;
//                $element.height(totalHeight + plugin.settings.offset);
//            }else {
//                $element.height(totalHeight);
//            }
        //if(plugin.settings.isNestedPane){
        //totalHeight -= border;
        //}

        var boundingHeight = totalHeight - padding*2;
        var boundingWidth = totalWidth - padding*2;


        //West width
        if(plugin.settings.pane.west.realWidth == null){
            if(typeof plugin.settings.pane.west.width == "string"){
                plugin.settings.pane.west.realWidth = (parseInt(plugin.settings.pane.west.width) * (boundingWidth - spacing - border) / 100);
            }else {
                plugin.settings.pane.west.realWidth = plugin.settings.pane.west.width;
            }
        }

        //East width
        if(plugin.settings.pane.east.realWidth == null){
            if(typeof plugin.settings.pane.east.width == "string"){
                plugin.settings.pane.east.realWidth = (parseInt(plugin.settings.pane.east.width) * (boundingWidth - spacing - border) / 100);
            }else {
                plugin.settings.pane.east.realWidth = plugin.settings.pane.east.width;
            }
        }

        //North height
        if(plugin.settings.pane.north.realHeight == null){
            if(typeof plugin.settings.pane.north.height == "string"){
                plugin.settings.pane.north.realHeight = (parseInt(plugin.settings.pane.north.height) * (boundingHeight - spacing - border) / 100);
            }else {
                plugin.settings.pane.north.realHeight = plugin.settings.pane.north.height;
            }
        }

        //South height
        if(plugin.settings.pane.south.realHeight == null){
            if(typeof plugin.settings.pane.south.height == "string"){
                plugin.settings.pane.south.realHeight = (parseInt(plugin.settings.pane.south.height) * (boundingHeight - spacing - border) / 100);
            }else {
                plugin.settings.pane.south.realHeight = plugin.settings.pane.south.height;
            }
        }

        //Center dimensions
        var centerWidth = totalWidth - padding*2;
        var centerHeight = totalHeight - padding*2;

        var centerTop = padding;
        var centerLeft = padding;

        //West
        if(plugin.settings.pane.west.enabled){

            var wMaxWidth = westMaxWidth();
            if(wMaxWidth < 0){
                plugin.settings.pane.west.realWidth = 0;
            }else if(wMaxWidth < plugin.settings.pane.west.realWidth){
                plugin.settings.pane.west.realWidth = wMaxWidth;
            }

            centerWidth = centerWidth - spacing - plugin.settings.pane.west.realWidth - plugin.settings.offset;
            centerLeft += plugin.settings.pane.west.realWidth + plugin.settings.offset + spacing;

            //Pane is closed
            if(plugin.settings.pane.west.realWidth == 0){
                $westPane.addClass("pane-closed");
            }else {
                $westPane.removeClass("pane-closed");
            }

            //Parent
            if(plugin.settings.pane.west.parent){
                $westPane.width(plugin.settings.pane.west.realWidth + border);
            }else {
                $westPane.width(plugin.settings.pane.west.realWidth);
            }

            //Nested
            if(plugin.settings.isNestedPane){
                $westPane.height(boundingHeight - border);
            }else {
                $westPane.height(boundingHeight);
            }

            $westPane.css({top: padding, left: padding});
            $westPane.find(".pane-container").trigger("sizeHasChanged");
        }

        //East
        if(plugin.settings.pane.east.enabled){

            var eMaxWidth = eastMaxWidth();
            if(eMaxWidth < 0){
                plugin.settings.pane.east.realWidth = 0;
            }else if(eMaxWidth < plugin.settings.pane.east.realWidth){
                plugin.settings.pane.east.realWidth = eMaxWidth;
            }

            centerWidth = centerWidth - plugin.settings.pane.east.realWidth - plugin.settings.offset - spacing;

            //Pane is closed
            if(plugin.settings.pane.east.realWidth == 0){
                $eastPane.addClass("pane-closed");
            }else {
                $eastPane.removeClass("pane-closed");
            }

            //Parent
            if(plugin.settings.pane.east.parent){
                $eastPane.width(plugin.settings.pane.east.realWidth + border);
            }else {
                $eastPane.width(plugin.settings.pane.east.realWidth);
            }

            //Nested
            if(plugin.settings.isNestedPane){
                $eastPane.height(boundingHeight - border);
            }else {
                $eastPane.height(boundingHeight);
            }

            $eastPane.css({top: padding, left: centerLeft + centerWidth + spacing});
            $eastPane.find(".pane-container").trigger("sizeHasChanged");
        }

        //North
        if(plugin.settings.pane.north.enabled){

            var nMaxHeight = northMaxHeight();
            if(nMaxHeight < 0){
                plugin.settings.pane.north.realHeight = 0;
            }else if(nMaxHeight < plugin.settings.pane.north.realHeight){
                plugin.settings.pane.north.realHeight = nMaxHeight;
            }

            centerHeight = centerHeight - plugin.settings.pane.north.realHeight - plugin.settings.offset - spacing;
            centerTop += plugin.settings.pane.north.realHeight + spacing + plugin.settings.offset;

            //Pane is closed
            if(plugin.settings.pane.north.realHeight == 0){
                $northPane.addClass("pane-closed");
            }else {
                $northPane.removeClass("pane-closed");
            }

            //Parent
            if(plugin.settings.pane.north.parent){
                $northPane.height(plugin.settings.pane.north.realHeight + border);
                $northPane.width(centerWidth);
            }else {
                $northPane.height(plugin.settings.pane.north.realHeight);
                $northPane.width(centerWidth - border);
            }

            $northPane.css({top: padding, left: centerLeft});
            $northPane.find(".pane-container").trigger('sizeHasChanged');
        }

        //South
        if(plugin.settings.pane.south.enabled){

            var sMaxHeight = southMaxHeight();
            if(sMaxHeight < 0){
                plugin.settings.pane.south.realHeight = 0;
            }else if(sMaxHeight < plugin.settings.pane.south.realHeight){
                plugin.settings.pane.south.realHeight = sMaxHeight;
            }

            centerHeight = centerHeight - plugin.settings.pane.south.realHeight - plugin.settings.offset - spacing;

            //Pane is closed
            if(plugin.settings.pane.south.realHeight == 0){
                $southPane.addClass("pane-closed");
            }else {
                $southPane.removeClass("pane-closed");
            }

            //Parent
            if(plugin.settings.pane.south.parent){
                $southPane.width(centerWidth);
                $southPane.height(plugin.settings.pane.south.realHeight + border);
            }else {
                $southPane.width(centerWidth - border);
                $southPane.height(plugin.settings.pane.south.realHeight);
            }

            $southPane.css({top: (totalHeight - plugin.settings.pane.south.realHeight - padding - border), left: centerLeft});
            $southPane.find(".pane-container").trigger('sizeHasChanged');
        }

        //Center (always present)
        if(centerHeight != $centerPane.height() || centerWidth != $centerPane.width()){

            //If center is parent
            if(plugin.settings.pane.center.parent){
                centerWidth += border;
                centerHeight += border;
            }

            $centerPane.width(centerWidth - border);
            $centerPane.height(centerHeight - border);
            $centerPane.css({top: centerTop, left: centerLeft});
            $centerPane.find(".pane-container").trigger('sizeHasChanged');
        }

    };


    //Initialize
    plugin.init();

};


$.fn.zupaPane = function(options) {
    return this.each(function() {
        if (undefined == $(this).data('zupaPane') || $(this).data('zupaPane') == "") {
            var plugin = new $.zupaPane(this, options);
            $(this).data('zupaPane', plugin);
        }
    });
};
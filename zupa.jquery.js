!(function ($) {

	

    /*****************************************************************************************
     *
     * CHILD
     *
     * This is just a tester object to see that it is beeing resized with the parent.
     *
     ****************************************************************************************/

    $.zupaChild = function(element, options) {

        var defaults = {};

        var plugin = this;
        plugin.settings = {};

        var $element = $(element);
        var $inner = null;

        /**
         * INITIALIZE
         */
        plugin.init = function() {

            //Extend default options
            plugin.settings = $.extend(true, {}, defaults, options);

            $element.addClass("testchild");
            $element.append('<div class="childinner"></div>');
            $inner = $element.find(".childinner");

            //Binding: Parent resize
            $element.parent().on('sizeHasChanged', function(event){
                if(event.target == $element.parent()[0]){
                    parentIsResized();
                }
            });

        };

        /**
         * CENTER TO PARENT
         */
        var parentIsResized = function(){

            var parentHeight = $element.parent().height();
            var parentWidth = $element.parent().width();

            $inner.width(parentWidth-20);
            $inner.height(parentHeight-20);
        };

        //Initialize
        plugin.init();

    };

    $.fn.zupaChild = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('zupaChild')) {
                var plugin = new $.zupaChild(this, options);
                $(this).data('zupaChild', plugin);
            }
        });
    };




    /*****************************************************************************************
     *
     * LOADER
     *
     * This is a spinner which is added to a container and shows
     * in the middle of it until it is removed.
     *
     ****************************************************************************************/

    $.zupaLoader = function(element, options) {

        var defaults = {};

        var plugin = this;
        plugin.settings = {};

        var $parent = $(element);
        var template =
            '<div class="gui-loader"><div class="loader-box"><div class="loader-progress">'+
            '<div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div>'+
            '</div><div class="loader-message"></div></div></div>';
        var $loader = $(template).hide();
        var $loaderBox = $loader.find(".loader-box");
        var $loaderMessage = $loader.find(".loader-message");

        /**
         * INITIALIZE
         */
        plugin.init = function() {

            //Extend default options
            plugin.settings = $.extend(true, {}, defaults, options);

            //Binding: Parent resize
            $parent.on('sizeHasChanged', function(event){
                if(event.target == $parent[0]){
                	updateAlignment();
                }
            });

            //Resize with parent
            updateAlignment();
        };


        /**
         * SHOW LOADER
         */
        plugin.showLoader = function(message){
        	plugin.setMessage(message);
        	
        	if(!$parent.find(".gui-loader").length > 0){
        		$parent.append($loader);
        	}
            
            updateAlignment();
            $loader.show();
        };


        /**
         * HIDE LOADER
         */
        plugin.hideLoader = function(){
            $parent.find(".gui-loader").remove();
        };
        
        
        /**
         * SET MESSAGE
         */
        plugin.setMessage = function(message){
        	if(message == null){
        		$loaderMessage.text("");
        		$loaderMessage.hide();
        	}else {
        		$loaderMessage.text(message);
        		$loaderMessage.show();
        	}
        };


        /**
         * CENTER TO PARENT
         */
        var updateAlignment = function(){

            var parentWidth = $parent.width();
            var parentHeight = $parent.height();

            $loader.width(parentWidth);
            $loader.height(parentHeight);

            //Position element as relative if parent is not relative or absolute
            var parentPositionProperty = $parent.css('position');
            if(parentPositionProperty !== 'absolute' && parentPositionProperty !== 'relative'){
                $loader.css("position", "relative");
            }

            var boxWidth = $loaderBox.outerWidth();
            var boxHeight = $loaderBox.outerHeight();

            if(boxLeft < 1 || boxTop < 1) {
                $loaderBox.hide();
            }else {
                $loaderBox.show();
            }

            var boxLeft = (parentWidth - boxWidth) / 2;
            var boxTop = (parentHeight - boxHeight) / 2;

            $loaderBox.css({left: boxLeft, top: boxTop});
        };

        //Initialize
        plugin.init();

    };

    $.fn.zupaLoader = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('zupaLoader')) {
                var plugin = new $.zupaLoader(this, options);
                $(this).data('zupaLoader', plugin);
            }
        });
    };





    /*****************************************************************************************
     *
     * PANE
     *
     * The pane let's you divide your frame up into separate sections.
     * Panes can be nested into each  other and for each pane you may have either
     * east/west or north/south panes.
     *
     ****************************************************************************************/

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








    /*****************************************************************************************
     *
     * TABLE
     *
     * The table enables you to specify a url to a web service and have
     * the table to all the dynamic calculations to lazyload rows as you scroll down.
     *
     ****************************************************************************************/

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







    /*****************************************************************************************
     *
     * TABS
     *
     * Tabs will create a tab container in which you can load content in to
     * seperate closable and rearrangeable tabs.
     *
     ****************************************************************************************/

    $.zupaTabs = function(element, options) {

        var defaults = {
            active:     0
//            tabs:       [{
//                            label: "Test",
//                            content: "#tab1",
//                            closeable: false,
//                            scrollVertical: true,
//                            scrollHorizontal: true
//                        }]
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element);

        var $tabPane = null;                // Tab pane area
        var $tabPaneContainer = null;       // Container to hold tabs
        var $tabPaneExpandButton = null;    // Expand button if there are invisible tabs
        var $tabPaneExpandMenu = null;      // Expand menu to hold excessive tabs

        var $tabContainer = null;           // Container for tab related content blocks

        /**
         * INITIALIZE
         */
        plugin.init = function() {

            //Extend default options
            plugin.settings = $.extend(true, {}, defaults, options);

            // Add HTML and assign selectors
            $element.addClass("gui-tabs");
            $element.wrapInner('<div class="tab-container"></div>');
            $element.prepend('<div class="tab-pane"></div>');
            $element.prepend('<ul class="tab-pane-expand-menu"><div class="top-border"></div></ul>');

            $tabPane = $element.find(".tab-pane");
            $tabPane.append('<div class="tab-pane-expand"></div>');
            $tabPane.append('<div class="tab-pane-container"></div>');

            $tabPaneExpandButton = $tabPane.find(".tab-pane-expand").hide();
            $tabPaneExpandMenu = $element.find(".tab-pane-expand-menu").hide();
            $tabPaneContainer = $tabPane.find(".tab-pane-container");
            $tabContainer = $element.find(".tab-container");

            //Draw tabs to pane
            drawTabs();

            //Draw size initially
            updateTabContainer();

            //Set default active
            plugin.selectTab(plugin.settings.active);


            // BIND: Expand toggle button/menu
            $tabPaneExpandButton.click(function(){
                $tabPaneExpandMenu.toggle();
                $tabPaneExpandButton.toggleClass("selected");
            });

            // BIND: Tabs in pane click
            $tabPane.on("click", ".gui-tab", function(event){
                if(!$(event.target).is('.tab-close-btn')){
                    plugin.selectTab($(this).index());
                    hideExpandMenu();
                }
            });

            // BIND: Tabs in expand click
            $tabPaneExpandMenu.on("click", "li", function(event){
                if(!$(event.target).is('.tab-close-btn')){
                    var index = $(this).attr("id").split("-")[1];
                    plugin.selectTab(index);
                }
            });

            // BIND: Close tab button
            $element.on("click", ".tab-close-btn", function(event){
                var index = $(this).parent().attr("id").split("-")[1];
                plugin.removeTab(index);
            });

            // BIND: Parent container has resized
            $element.parent().on('sizeHasChanged', function(event){
                if(event.target == $element.parent()[0]){
                    updateTabContainer();
                    drawTabs();
                }
            });

        };


        /**
         * DRAW INITIAL TABS
         * Adds the plugins initial tabs on startup
         */
        var drawTabs = function(){

            //Empty tab pane container
            $tabPaneContainer.empty();

            //Empty expand menu
            $tabPaneExpandMenu.find("li").remove();
            
            //Check if there are any tabs
            if(plugin.settings.tabs == null){
            	return false;
            }

            //Fill tab container with tabs
            $.each(plugin.settings.tabs, function(index, tab){
                drawTabToPane(index, tab.label, tab.content, tab.closeable);

                //If scrollable content
                var scrollAxis = null;
                if(tab.scrollVertical){
                    scrollAxis = "y";
                }
                if(tab.scrollHorizontal){
                    scrollAxis += "x";
                }

                if(scrollAxis != null){
                    $tabContainer.find(tab.content).mCustomScrollbar({
                        theme: "light-thick",
                        axis: scrollAxis,
                        setTop: 0,
                        contentTouchScroll: true,
                        mouseWheelPixels: "auto",
                        scrollButtons:{
                            enable: true
                        }
                    });
                }
            });

            //Move tabs to expand menu if pane is too small
            moveTabsToExpand();

            //Select active tab
            plugin.selectTab(plugin.settings.active);

        };


        /**
         * MOVE TABS TO EXPAND
         * Move excessive tabs to the expand menu.
         */
        var moveTabsToExpand = function(){

            var tabPaneWidth = $tabPane.width()-10;

            var tabsTotalWidth = 0;
            plugin.expandedTabs = false;

            $tabPaneContainer.find(".gui-tab").each(function(index, tab){
                tabsTotalWidth += $(tab).outerWidth();

                if(tabsTotalWidth > tabPaneWidth){
                    $(this).remove();
                    drawTabToExpand(index, plugin.settings.tabs[index].label, plugin.settings.tabs[index].content, plugin.settings.tabs[index].closeable);
                    plugin.expandedTabs = true;
                }
            });

            if(plugin.expandedTabs){
                $tabPaneExpandButton.show();
            }else {
                $tabPaneExpandButton.hide();
                $tabPaneExpandMenu.hide();
            }
        };


        /**
         * UPDATE SIZE OF TAB CONTAINER
         * Update sizes based on the parent elements dimensions.
         */
        var updateTabContainer = function(){
            var parentHeight = $element.parent().height();
            $tabContainer.height(parentHeight-34);
            $tabContainer.trigger("sizeHasChanged");
        };


        /**
         * DRAW TAB
         *
         * @param label
         * @param content
         */
        var drawTabToPane = function(index, label, content, closeable){
            var $tabElement = $('<div id="tab-'+index+'" class="gui-tab" rel="'+content+'"><div class="tab-left"></div><div class="tab-center">'+label+'</div><div class="tab-right"></div></div>');
            if(closeable){
                $tabElement.prepend('<div class="tab-close-btn"></div>');
            }
            $tabPaneContainer.append($tabElement);
        };

        var drawTabToExpand = function(index, label, content, closeable){
            var $tabElement = $('<li id="tab-'+index+'" rel="'+content+'">'+label+'</li>');
            if(closeable){
                $tabElement.append('<div class="tab-close-btn"></div>');
                $tabElement.addClass("tab-closeable");
            }
            $tabPaneExpandMenu.append($tabElement);
        };


        /**
         * HIDE EXPAND MENU
         */
        var hideExpandMenu = function(){
            $tabPaneExpandMenu.hide();
            $tabPaneExpandButton.removeClass("selected");
        };

        /**
         * Method:
         * ADD NEW TAB
         *
         * Takes object with values:
         * - "label": Label of tab
         * - "content": Selector for tab content
         * - "closeable": Weather or not the tab is closeable
         *
         */
        plugin.addTab = function(newTab){

        	//Check if tabs is null
        	if(plugin.settings.tabs == null){
        		plugin.settings.tabs = [];
        	}
        	
            //Add tab to list
            plugin.settings.tabs.push({
                label: newTab.label,
                content: newTab.content,
                closeable: newTab.closeable
            });

            var nextIndex = plugin.settings.tabs.length-1;

            //Draw tab
            if(plugin.expandedTabs){
                drawTabToExpand(nextIndex, newTab.label, newTab.content, newTab.closeable);
            }else {
                drawTabToPane(nextIndex, newTab.label, newTab.content, newTab.closeable);

                //Move tabs to expand menu if pane is too small
                moveTabsToExpand();
            }
            
            //Set added tab as selected
            plugin.selectTab(nextIndex);
        };
        
        
        /**
         * Method:
         * ADD TAB CONTAINER
         * @param container
         */
        plugin.addTabContent = function(content, scrollVertical, scrollHorizontal){
        	$tabContainer.append(content);
        	
            //If scrollable content
            var scrollAxis = null;
            if(scrollVertical){
                scrollAxis = "y";
            }
            if(scrollHorizontal){
                scrollAxis += "x";
            }

            if(scrollAxis != null){
            	content.mCustomScrollbar({
                    theme: "light-thick",
                    axis: scrollAxis,
                    setTop: 0,
                    contentTouchScroll: true,
                    mouseWheelPixels: "auto",
                    scrollButtons:{
                        enable: true
                    }
                });
            }
        };


        /**
         * Method:
         * SELECT TAB
         */
        plugin.selectTab = function(tabIndex){

            //Update setting
            plugin.settings.active = tabIndex;

            //Deselect all tabs
            plugin.deselectAll();

            //Find tab in pane
            var tabIsInExpand = false;
            var $selectedTab = $tabPaneContainer.find("#tab-"+tabIndex);

            //If not in pane check expand
            if(!$selectedTab.length){
                tabIsInExpand = true;
                $selectedTab = $tabPaneExpandMenu.find("#tab-"+tabIndex);
            }

            //There are special styles for tabs before and after selected tab in pane
            if(!tabIsInExpand){

                //Mark tab to the left of active tab
                if(tabIndex > 0){
                    $tabPaneContainer.find("#tab-"+(tabIndex-1)).addClass("tab-toleft");
                }

                //Mark tab to the right of active tab
                if(!$selectedTab.is(':last-child')){
                    $tabPaneContainer.find("#tab-"+(tabIndex+1)).addClass("tab-toright");
                }
            }

            //Show selected tabs content
            $selectedTab.addClass("active");
            var contentSelector = $selectedTab.attr("rel");
            $tabContainer.find(contentSelector).show();

            //Scroll to top
            $tabContainer.find(contentSelector).mCustomScrollbar("update");

            //Broadcast a size change in the container
            $tabContainer.trigger("sizeHasChanged");
        };

        /**
         * Method:
         * REMOVE TAB
         *
         * @param index
         */
        plugin.removeTab = function(tabIndex){

            var $selectedTab = $element.find("#tab-"+tabIndex);
            var contentSelector = $selectedTab.attr("rel");

            //Destroy scrollbar
            if(plugin.settings.tabs[tabIndex].scrollVertical || plugin.settings.tabs[tabIndex].scrollHorizontal){
                $tabContainer.find(contentSelector).mCustomScrollbar("destroy");
            }

            // Remove content
            $tabContainer.find(contentSelector).remove();

            // Remove from tab list
            plugin.settings.tabs.splice(tabIndex, 1);

            //Select adjacent tab if exists and this one was selected
            var numberOfTabs = plugin.settings.tabs.length;
            if(plugin.settings.active == tabIndex){
                if(numberOfTabs > tabIndex){
                    plugin.settings.active = tabIndex; //Select tab to the right
                }else if(tabIndex > 0){
                    plugin.settings.active = tabIndex-1; //Select tab to the left
                }
            }else if(tabIndex < plugin.settings.active){
            	plugin.settings.active = plugin.settings.active-1;
            }

            // Redraw tabs
            drawTabs();

        };

        /**
         * Method:
         * DESELECT ALL TABS
         */
        plugin.deselectAll = function(){

            //Deselect in expand
            $tabPaneExpandMenu.find(".active").removeClass("active");

            //Deselect in pane
            $tabPaneContainer.find(".active").removeClass("active");
            $tabPaneContainer.find(".tab-toleft").removeClass("tab-toleft");
            $tabPaneContainer.find(".tab-toright").removeClass("tab-toright");

            //Hide all content blocks
            $element.find(".tab-container").find("> div").hide();
        };


        /**
         * Method:
         * GET NUMBER OF TABS
         * @returns {number}
         */
        plugin.numberOfTabs = function(){
            return plugin.settings.tabs.length;
        };


        //Initialize
        plugin.init();

    };

    $.fn.zupaTabs = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('zupaTabs')) {
                var plugin = new $.zupaTabs(this, options);
                $(this).data('zupaTabs', plugin);
            }
        });
    };









    /*****************************************************************************************
     *
     * ACCORDION
     *
     * Type: GUI
     *
     * Description:
     * An accordion menu where each item can hold some content.
     *
     ****************************************************************************************/


    $.zupaAccordion = function(element, options) {

        var defaults = {
            active: 0,
            panes: null
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element);
        var $contentPanes = $element.find("> div");

        /**
         * INITIALIZE
         */
        plugin.init = function(){

            //Extend default options
            plugin.settings = $.extend(true, {}, defaults, options);

            //Class
            $element.addClass("gui-accordion");

            //Draw
            $.each(plugin.settings.panes, function(index, pane){
                var currentPane = $contentPanes.eq(index);

                //Create layout
                currentPane.addClass("accord");
                currentPane.wrapInner('<div class="contentpane">');
                currentPane.append('</div>');
                currentPane.prepend('<div class="titlebutton">'+pane.title+'</div>');

                //Hide if not set to default active
                if(plugin.settings.active != index){
                    currentPane.find(".contentpane").hide();
                }else {
                    currentPane.addClass("active");
                }

            });

            //Bind each titlebutton
            $contentPanes.find(".titlebutton").click(function(){
                var paneIndex = $(this).parent().index();
                plugin.setActive(paneIndex);
            });

            //BIND: Whenever the container is resized
            $element.parent().on('sizeHasChanged', function(event){
                if(event.target == $element.parent()[0]){
                    plugin.drawSize();
                }
            });

            //Draw size of active content pane
            plugin.drawSize();

        };


        /**
         * DRAW SIZE
         */
        plugin.drawSize = function(){

            var globalHeight = $element.height();
            var buttonHeight = $element.find(".accord:first .titlebutton").height()+1;
            var contentHeight = $contentPanes.length * buttonHeight;

            var contentPaneHeight = globalHeight - contentHeight - 4;
            var $activePane = $element.find(".active .contentpane");
            $activePane.height(contentPaneHeight).show();
            $activePane.trigger("sizeHasChanged");
        };


        /**
         * SET ACTIVE PANE
         */
        plugin.setActive = function(paneIndex){

            //Dont do anything if this pane is already active
            if(paneIndex == plugin.settings.active){
                return false;
            }

            //Hide active
            var currentActive = $contentPanes.eq(plugin.settings.active);
            var currentHeight = currentActive.find(".contentpane").height();

            //Sync
            $contentPanes.eq(paneIndex).find(".contentpane").show();
            currentActive.find(".contentpane").css("margin-top", "-5px");

            currentActive.removeClass("active");
            currentActive.find(".contentpane").animate({
                height: '0px'
            }, 200, function(){
                $(this).css("margin-top", "0px").hide();
            });

            //Set active
            plugin.settings.active = paneIndex;

            //Show new active
            $contentPanes.eq(paneIndex).find(".contentpane").animate({
                height: currentHeight+"px"
            }, 200, function(){
                $contentPanes.eq(paneIndex).addClass("active");
                $contentPanes.eq(paneIndex).find(".contentpane").trigger("sizeHasChanged");
            });

        };


        //Initialize
        plugin.init();

    };


    $.fn.zupaAccordion = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('zupaAccordion')) {
                var plugin = new $.zupaAccordion(this, options);
                $(this).data('zupaAccordion', plugin);
            }
        });
    };






    /*****************************************************************************************
     *
     * MAIN MENU
     *
     * A sidebarmenu
     *
     ****************************************************************************************/


    $.zupaMainMenu = function(element, options) {

        var defaults = {
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
        	}]
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element);
        var $menu = $('<ul class="gui-main-menu-buttons"></ul>')


        /**
         * INITIALIZE
         */
        plugin.init = function(){

            //Extend default options
            plugin.settings = $.extend(true, {}, defaults, options);

            //Draw
            $element.addClass("gui-main-menu");
            $element.append($menu);
            
            //Draw buttons
            drawButtons();

        };
        
        
        /**
         * DRAW BUTTONS
         */
        var drawButtons = function(){
        	$.each(plugin.settings.buttons, function(index, button){
        		var $buttonElement = $('<li>'+button.label+'</li>');
        		$menu.append($buttonElement);
        		
        		if(button.menu != null){
        			drawSubmenu($buttonElement, button.menu);
        		}
        	});
        };
        
        /**
         * DRAW SUBMENU
         */
        var drawSubmenu = function($buttonElement, menu){
        	var $submenuElement = $('<ul class="gui-main-menu-submenu"><li class="gui-main-menu-arrow"></li></ul>').hide();
        	$.each(menu, function(index, item){
        		$submenuElement.append('<li class="gui-main-menu-submenu-button">'+item.label+'</li>');
        	});
        	$element.append($submenuElement);
        	
        	$buttonElement.mouseenter(function(){
        		$submenuElement.show();
        	});
        	
        	$buttonElement.mouseleave(function(e){
        		if($(e.relatedTarget).closest(".gui-main-menu-submenu").length == 0){
        			$submenuElement.hide();
        		}
        	});

        };


        //Initialize
        plugin.init();

    };


    $.fn.zupaMainMenu = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('zupaMainMenu')) {
                var plugin = new $.zupaMainMenu(this, options);
                $(this).data('zupaMainMenu', plugin);
            }
        });
    };
    
    
    
    
	/*****************************************************************************************
	*
	* THUMBNAIL
	*
	* A thumbnail image with functions to delete, replace and alter metadata.
	*
	****************************************************************************************/

    $.zupaThumb = function(element, options) {

       var defaults = {
           url: null,                      // Url location of thumb
           title: "Picture title",         // Picture title
           size: 120                       // Width/height in pixels
       };

       var plugin = this;
       plugin.settings = {};

       var $element = $(element);
       var template = '<div class="thumb-image"></div><div class="thumb-menu"></div>';

       /**
        * INITIALIZE
        */
       plugin.init = function(){

           //Extend default options
           plugin.settings = $.extend(true, {}, defaults, options);

           //Element
           if(element == null){
               $element = $('<div class="gui-thumb">'+template+'</div>');
           }else {
               $element.addClass("gui-thumb");
               $element.append(template);
           }
           plugin.$image = $element.find(".thumb-image");
           plugin.$menu = $element.find(".thumb-menu");

           //Size
           plugin.$image.width(plugin.settings.size);
           plugin.$image.height(plugin.settings.size);

           //Load image
           plugin.loadImage();

       };


       /**
        * ON IMAGE LOADED
        */
       plugin.loadImage = function(){
           $('<img src="'+ plugin.settings.url +'">').load(function(){

               $(this).appendTo(plugin.$image);
               $(this).css("max-width", plugin.settings.size);

               var imageWidth = $(this).width();
               var imageHeight = $(this).height();

               var marginLeft = (plugin.settings.size - imageWidth) / 2;
               var marginTop = (plugin.settings.size - imageHeight) / 2;

               if(marginLeft > 1){
                   $(this).css("margin-left", marginLeft);
               }

               if(marginTop > 1){
                   $(this).css("margin-top", marginTop);
               }
           });
       };



       /**
        * ADD TO CONTAINER ELEMENT
        */
       plugin.addTo = function(container){
           container.append($element);
       };



       //Initialize
       plugin.init();

   };


   $.fn.zupaThumb = function(options) {
       return this.each(function() {
           if (undefined == $(this).data('zupaThumb')) {
               var plugin = new $.zupaThumb(this, options);
               $(this).data('zupaThumb', plugin);
           }
       });
   };


   
   
   
   /*****************************************************************************************
   *
   * BUTTON MENU
   *
   * A horizontal menu with buttons and submenus
   *
   ****************************************************************************************/
   
   /**
    * TODO:
    * - All buttons that dont fit gets either hidden or put in a corner menu
    * - Button divider element
    */
   
   $.zupaButtonMenu = function(element, options) {

	   var defaults = {
		   buttons: [{
			   label: "",				// Button text
			   icon: "",				// Button icon class (added  to <i> element)
			   onClick: null,			// Click handler function
			   menu: [{					// 2. level menu
				   label: "",
				   icon: "",
				   onClick: null,
				   menu: []				// 3. level menu
			   }]
		   }],
		   paddingHorizontal: 10,
		   bolder: false,
		   browsingMenus: false,		// Flag the indicates when menus should be opened on hover'
		   expandedButtonMenu: null,	// Index of which buttons menu that is expanded
		   menuDelay: 400				// Number of milliseconds delay before opening submenu
	   };

	   var plugin = this;
	   plugin.settings = {};
	   
	   var $element = $(element);
	   var $buttonContainer = $('<ul class="gui-button-menu-main"></ul>');

	   
	   /**
	    * INITIALIZE
	    */
	   plugin.init = function() {

		   //Extend default options
		   plugin.settings = $.extend(true, {}, defaults, options);

		   //Add class
		   $element.addClass("gui-button-menu");
		   $element.empty();
		   $element.append($buttonContainer);
		   
		   //Draw buttons
		   drawButtons();
		   
		   //Binding: Parent resize
		   $element.parent().on('sizeHasChanged', function(event){
			   if(event.target == $element.parent()[0]){
				   drawButtons();
			   }
		   });
		   
		   // BIND: Main button click
		   $buttonContainer.on("click", "li", function(){
			   
			   //Custom callback
			   if(typeof plugin.settings.onClick  == "function"){
				   plugin.settings.onClick();
			   }
		   });
		   
		   //BIND: Main button mouse down
		   $buttonContainer.on("mousedown", "li", function(){
			   //Button has menu
			   var buttonIndex = $(this).index();
				   
			   //Open menu
			   if(plugin.settings.expandedButtonMenu == buttonIndex){
				   plugin.closeAllMenus(true);
			   }else {
				   openMenu(buttonIndex, $(this));
			   }
		   });
		   
		   // BIND: Main button hover
		   $buttonContainer.on("mouseover", "li", function(){

			   //Button index
			   var buttonIndex = $(this).index();

			   //Menu not active
			   if(plugin.settings.browsingMenus && plugin.settings.expandedButtonMenu != buttonIndex){

				   //Close all menu's
				   plugin.closeAllMenus();

				   //Open menu
				   openMenu(buttonIndex, $(this));
			   }
		   });
		   
		   // BIND: Close menus if click anywhere else
		   $(document).on("mousedown", "body", function(e){
			   
			   var parentMenus = $(e.target).closest(".gui-button-menu-submenu");
			   var parentButtons = $(e.target).closest(".gui-button-menu-button");
			   
			   if(parentMenus.length == 0 && plugin.settings.expandedButtonMenu != null && parentButtons.length == 0){

				   //Close all menus and stop browsing
				   plugin.closeAllMenus(true);
			   }				
		   });
			

	   };

	   
	   /**
	    * DRAW BUTTONS
	    */
	   var drawButtons = function(){
		   
		   //Empty container
		   $buttonContainer.empty();
		   
		   var parentHeight = $element.parent().height();
		   var parentWidth = $element.parent().width();

		   //Height
		   $element.outerHeight(parentHeight);
		   $buttonContainer.outerHeight(parentHeight);
		   
		   //Each button
		   $.each(plugin.settings.buttons, function(index, button){
			   
			   //Add element
			   var buttonTemplate = $('<li class="gui-button-menu-button"><span class="button-label">'+button.label+'</span></li>');
			   
			   //Icon
			   if(button.icon != null){
				   buttonTemplate.prepend('<i class="'+button.icon+'"></i>');
			   }
			   
			   //Render
			   $buttonContainer.append(buttonTemplate);
			   
			   //Padding horizontal
			   buttonTemplate.css("padding", plugin.settings.paddingHorizontal);
			   
			   //Padding vertical
			   var labelHeight = buttonTemplate.find(".button-label").outerHeight();
			   
			   //Button size
			   var buttonHeight = 0;
			   if(parentHeight >= 60){
				   
				   //Add bigger class
				   buttonTemplate.addClass("button-bigger");
				   
				   //Bolder
				   if(plugin.settings.bolder){
					   buttonTemplate.addClass("button-bolder");
				   }
				   
				   //Find icon height/width
				   var iconHeight = button.icon != null ? buttonTemplate.find("i").outerHeight() : 0;
				   var iconWidth = button.icon != null ? buttonTemplate.find("i").outerWidth() : 0;
				   
				   buttonHeight = labelHeight+iconHeight;
				   
				   if(iconWidth > 0){
					   buttonTemplate.find("i").after("<br />");
					   buttonTemplate.css("line-height", 1);
				   }
			   }else {
				   var iconHeight = button.icon != null ? buttonTemplate.find("i").outerHeight() : 0;
				   if(labelHeight > iconHeight){
					   buttonHeight = labelHeight;
				   }else {
					   buttonHeight = iconHeight;
					   buttonTemplate.find(".button-label").css("line-height", iconHeight+"px");
				   }
			   }
			   
			   var paddingVertical = (parentHeight - buttonHeight - 2) / 2;
			   buttonTemplate.css({"padding-top": paddingVertical, "padding-bottom": paddingVertical});

		   });
	   };
	   
	   /**
	    * OPEN MENU
	    */
	   var openMenu = function(buttonIndex, $buttonElement){
		   
		   //Fetch menu
		   var menu = plugin.settings.buttons[buttonIndex].menu;
		   if(menu == null || menu.length < 1 || plugin.settings.expandedButtonMenu == buttonIndex){
			   return false;
		   }
		   
		   //Close all menus
		   if(plugin.settings.expandedButtonMenu != null){
			   plugin.closeAllMenus();
		   }
		   
		   //Set variable that automatically opens menu on hover
		   plugin.settings.browsingMenus = true;
		   
		   //Set current expanded button menu index
		   plugin.settings.expandedButtonMenu = buttonIndex;
		   
		   //Set button state
		   $buttonElement.addClass("expanded");
		   
		   //Generate menu
		   var menuLevel = 1;
		   var topPosition = $element.parent().height();
		   var leftPosition = $buttonElement.position().left;
		   generateMenu(menu, topPosition, leftPosition, menuLevel);
	   }
	   
	   /**
	    * GENERATE MENU
	    * Generates tree of menus
	    */
	   var generateMenu = function(menu, topPosition, leftPosition, menuLevel){
		   
		   //Main element
		   var $menuElement  = $('<ul class="gui-button-menu-submenu gui-button-menu-submenu-level-'+menuLevel+'"></ul>').hide();
		   
		   //Level 1 - add bridge between button and menu
		   if(menuLevel == 1){

			   //Find with of parent button
			   var parentButtonWidth = $buttonContainer.find("li").eq(plugin.settings.expandedButtonMenu).outerWidth();

			   //If first button subtract 1px else subtract 2px
			   if(plugin.settings.expandedButtonMenu == 0){
				   parentButtonWidth -= 1;
			   }else {
				   parentButtonWidth -= 2;
			   }

			   var $buttonMenuBridge = $('<li class="gui-button-menu-bridge"></li>');
			   $buttonMenuBridge.outerWidth(parentButtonWidth);

			   $menuElement.append($buttonMenuBridge);

			   
		   }else if(menuLevel > 1){
			   $menuElement.hide();
		   }
		   
		   //Items
		   $.each(menu, function(index, button){
			   
			   //Label
			   var $buttonElement = $('<li class="gui-button-submenu-button">'+button.label+'</li>');
			   
			   //Icon
			   if(button.icon != null){
				   $buttonElement.append('<i class="'+button.icon+'"></i>');
			   }
			   
			   //Append to menu
			   $menuElement.append($buttonElement);
			   
			   //Continue down the menu tree
			   if(button.menu != null && button.menu.length > 0){
				   
				   //Generate this buttons submenu
				   var submenu = generateMenu(button.menu, topPosition, leftPosition, menuLevel+1);
				   
				   //Add expand arrow
				   $buttonElement.append('<span class="gui-button-expand-indicator"></span>')
				   $buttonElement.append('<span class="gui-button-expand-arrow"></span>');
				   
				   //Show Submenu: On mouseover with delay
				   $buttonElement.mouseover(function(){
					   clearTimeout(this.hovertimer);
					   this.hovertimer = setTimeout(function(){
						   openSubmenu($buttonElement, submenu);
					   }, plugin.settings.menuDelay);
				   });
				   
				   //Show Submenu: On click
				   $buttonElement.click(function(){
					   clearTimeout(this.hovertimer);
					   openSubmenu($buttonElement, submenu);
				   });
				   
				   //Leave button
				   $buttonElement.mouseleave(function(){
					   clearTimeout(this.hovertimer);
				   });
			   }else {
				   
				   //Ordinary click: returns parameters and element
				   $buttonElement.click(function(){
					   
					   //Custom callback
					   if(typeof button.onClick == "function"){
						   button.onClick(button, $buttonElement);
					   }
					   
					   //Close all menus
					   plugin.closeAllMenus(true);
				   });
			   }
			   
			   //Mouseenter submenu button: close submenus on lower levels
			   $buttonElement.mouseenter(function(){
				   $buttonElement.siblings().removeClass("expanded");
				   closeSubmenus(submenu, menuLevel+1);
			   });
			   
		   });
		   
		   //If 1. level menu, at first position, set -1px left
		   if(menuLevel == 1 && leftPosition == 0){
			   leftPosition = -1;
		   }
		   
		   //Set Position
		   $menuElement.css({top: topPosition, left: leftPosition});
		   
		   //Render menu
		   $element.append($menuElement);
		   
		   if(menuLevel == 1){
			   $menuElement.fadeIn("fast");  
		   }
		   
		   
		   //Return menu
		   return $menuElement;
	   }
	   
	   
	   /**
	    * OPEN A SUBMENU
	    */
	   var openSubmenu = function($buttonElement, submenu){
		   
		   //Set button state
		   $buttonElement.addClass("expanded");
		   
		   //Show submenu
		   var distanceFromParent = 1;
		   var submenuLeft = $buttonElement.parent().position().left + $buttonElement.parent().outerWidth() + distanceFromParent;
		   var submenuTop = $buttonElement.position().top + $buttonElement.parent().position().top;
		   submenu.css({left: submenuLeft, top: submenuTop});
		   submenu.fadeIn("fast");
	   };
	   
	   /**
	    * CLOSE A SUBMENU
	    */
	   var closeSubmenus = function($ownersSubmenu, fromLevel){
		   $.each($element.find(".gui-button-menu-submenu:visible"), function(index, submenu){
			   
			   //Check that not owners submenu
			   if($(submenu).is($ownersSubmenu)){
				   $(submenu).find(".expanded").removeClass("expanded");
				   return;
			   }
			   
			   var classes = $(submenu).attr("class");
			   var level = classes.substring(classes.indexOf("level-") + 6);
			   
			   if(level >= fromLevel){
				   $(submenu).fadeOut("fast");
				   $(submenu).find(".expanded").removeClass("expanded");
			   }
		   });
	   }
	   
	   
	   
	   /**
	    * Method:
	    * CLOSE ALL MENUS
	    * Closes all open menus
	    */
	   plugin.closeAllMenus = function(stopBrowsingMenus){
		   
		   //Reset current expanded button menu index
		   plugin.settings.expandedButtonMenu = null;
		   
		   //Set variable that automatically opens menu on hover
		   if(stopBrowsingMenus){
			   plugin.settings.browsingMenus = false;
		   }
		   
		   //Remove all menus
		   $element.find(".gui-button-menu-submenu").remove();
		   
		   //Set all buttons as retracted
		   $buttonContainer.find(".expanded").removeClass("expanded");
	   }
	   

	   //Initialize
	   plugin.init();

   };

   $.fn.zupaButtonMenu = function(options) {
	   return this.each(function() {
		   if (undefined == $(this).data('zupaButtonMenu')) {
			   var plugin = new $.zupaButtonMenu(this, options);
			   $(this).data('zupaButtonMenu', plugin);
		   }
	   });
   };

   
   
   
   
   
	/*****************************************************************************************
	 * 
	 * WINDOW
	 * 
	 * Type: GUI
	 * 
	 ****************************************************************************************/
		
	$.zupaWindow = function(element, options) {
		
		//Default options
		var defaults = {
			title: "",			//	Window title
			icon: null,			//	Window icon
			content: null,		//	Initial content
			width: 700,			//	Initial width
			height: 500,		//	Initial height
			xpos: 100,			//	Initial y-position
			ypos: 100,			//	Initial x-position
			overlay: false,		//	Add an overlay to force the user to deal with the window
			maximized: false,	//	Is window maximized
			minimized: false,	//	Is window minimized
			maximizable: true,	//	Enable maximize button
			minimizable: true,	//	Enable minimize button
			closable: true,		//	Enable close button
			draggable: true,	//	Enable draggable window
			resizable: true,	//	Enable resizable window
			centered: false,	//	Center window
			onClose: null		//	Close-button callback
		};
		
		var plugin = this;
		plugin.settings = {};
		
		var $element = $(element);
		var $frame = null;
		
		
		/**
		 * INITIALIZE
		 */
		init = function(){
			
			//Extend default options
			plugin.settings = $.extend(true, {}, defaults, options);
			
			//Element
			$element = $(	'<div class="gui-window">'+
							'<div class="titlebuttons"></div>'+
							'<div class="titlebar"><div class="title">'+plugin.settings.title+'</div></div>'+	
							'<div class="frame"></div>'+
							'</div>').hide();
			
			$element.width(plugin.settings.width);
			$element.height(plugin.settings.height);
			$element.css("left", plugin.settings.xpos);
			$element.css("top", plugin.settings.ypos);
			$titlebar = $element.find(".titlebar");
			$frame = $element.find(".frame");
			
			//Append
			$(document.body).append($element);
			
			//Set custom icon
			if(plugin.settings.icon != null){
				$element.find(".titlebar").prepend('<i class="icon"></i>');
				$element.find(".titlebar .icon").css("background-image", "url("+plugin.settings.icon+")");
			}

			//Add overlay
			if(plugin.settings.overlay){
				$element.before('<div class="gui-overlay">');
				$element.after('</div>');
			}
			
			//Set to centered
			if(plugin.settings.centered){
				plugin.center();
			}
			
			//Set to maximized
			if(plugin.settings.maximized){
				plugin.maximize();
			}
			
			//Binding: Resizable
			if(plugin.settings.resizable){
				$element.resizable({
					minWidth: 200,
					helper: "gui-window-helper",
					start: function(event, ui){
						$(".gui-window-helper").css("z-index", parseInt($(this).css("z-index"))+1);
						$(document).find("iframe").each(function() {
							$('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
							.css({
								width: this.offsetWidth+"px", height: this.offsetHeight+"px",
								position: "absolute", opacity: "0.001", zIndex: 1000
							})
							.css($(this).offset())
							.appendTo("body");
						});					
					},
					stop: function(){
						$("div.ui-resizable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
						plugin.settings.width = $element.find(".frame").width();
						plugin.settings.height = $element.find(".frame").height();
					}
				});
			}

			//Binding: Draggable
			if(plugin.settings.draggable){
				$element.draggable({ 
					handle: ".titlebar",
					cursor: "move",
					stack: ".gui-window",
					iframeFix: true,
					start: function(event){
						$element.css("opacity","0.8");
					},
					stop: function(){
						$element.css("opacity", "1");
						plugin.settings.xpos = $element.position().left;
						plugin.settings.ypos = $element.position().top;
					}
				});			
			}

			
			//Binding: Titlebar doubleclick
			$titlebar.dblclick(function(){
				if($element.hasClass("maximized")){
					plugin.unmaximize();
				}else {
					plugin.maximize();
				}
			});
			
			//Binding: Focus on click
			$element.mousedown(function(){		
				plugin.bringToFront();
			});
			
			
			//Binding: Closable
			if(plugin.settings.closable){
				$element.find(".titlebuttons").append('<div class="close-btn"></div>');
				$element.find(".titlebuttons .close-btn").click(function(){
					plugin.close();
				});			
			}

			
			//Binding: Maximizable
			if(plugin.settings.maximizable){
				$element.find(".titlebuttons").append('<div class="maximize-btn"></div>');
				$element.find(".titlebuttons .maximize-btn").click(function(){
					if($element.hasClass("maximized")){
						plugin.unmaximize();
					}else {
						plugin.maximize();
					}
					
				});
			}

			
			//Binding: Minimizable
			if(plugin.settings.minimizable){
				$element.find(".titlebuttons").append('<div class="minimize-btn"></div>');
				$element.find(".titlebuttons .minimize-btn").click(function(){
					plugin.minimize();				
				});
			}
			
			
			//Binding: Browser size change
			$(window).resize(function(event, ui){
				if(event.target == window){
					plugin.update();
				}
			});
			
            //Binding: Parent resize
            $element.parent().on('sizeHasChanged', function(event){
                if(event.target == $element.parent()[0]){
                	plugin.update();
                }
            });

			
			//Loading initial content if set
			if(plugin.settings.content != null){
				plugin.loadContent(plugin.settings.content);
			}
			
		};
		


		/**
		 * LOAD CONTENT
		 */
		plugin.loadContent = function(viewPath){
			$frame.empty();
			$frame.append('<iframe scrolling="no" src="'+viewPath+'"></iframe>');

		};
		
		
		/**
		 * RELOAD CONTENT
		 */
		plugin.reloadContent = function(){
			$frame.empty();
			$frame.append('<iframe scrolling="no" src="'+plugin.settings.content+'"></iframe>');
		};
		
		
		/**
		 * SET CUSTOM ICON
		 */
		plugin.setIcon = function(iconPath){
			plugin.settings.icon = iconPath;
			$element.find(".titlebar .icon").css("background-image", "url("+plugin.settings.icon+")");
		};

		
		/**
		 * UPDATE SIZE AND POSITION OF WINDOW
		 */
		plugin.update = function(){
			
			//If maximized
			if($element.hasClass("maximized")){
				$element.outerWidth($(window).width());
				$element.outerHeight($(window).height());	
			}else if(plugin.settings.centered){
				plugin.center();
			}
		};
		
		
		/**
		 * CENTER WINDOW
		 * Center window to browser width and height
		 */
		plugin.center = function(){
			plugin.settings.xpos = ($(window).width() - $element.outerWidth()) / 2;
			plugin.settings.ypos = ($(window).height() - $element.outerHeight()) / 2;
			
			$element.css("left", plugin.settings.xpos);
			$element.css("top", plugin.settings.ypos);

		};
		
		
		/**
		 * CLOSE WINDOW
		 */
		plugin.close = function(){

			plugin.settings.state = 0;
			$element.fadeOut(100, function(){
				$(this).remove();
			});
			
			//Callback
			if(typeof plugin.settings.onClose == "function"){
				plugin.settings.onClose();
			}
		};
		
		
		/**
		 * OPEN WINDOW
		 */
		plugin.open = function(){
			plugin.bringToFront();
			$element.fadeIn(100);
		};
		

		/**
		 * MAXIMIZE WINDOW
		 */
		plugin.maximize = function(){
			if(!$element.hasClass("maximized")){
				
				$element.css("left", 0);
				$element.css("top", 0);
				
				var parentWidth = $(window).width();
				var parentHeight = $(window).height();
				$element.outerWidth(parentWidth);
				$element.outerHeight(parentHeight);
				$element.addClass("maximized");
				
				//Disable resize
				plugin.resizable(false);
				
				//Trigger size change
				$frame.trigger("sizeHasChanged");
				
			}
		};
		
		
		/**
		 * UNMAXIMIZE
		 */
		plugin.unmaximize = function(){
			if($element.hasClass("maximized")){
				$element.css("width", plugin.settings.width);
				$element.css("height", plugin.settings.height);
				$element.css("left", plugin.settings.xpos);
				$element.css("top", plugin.settings.ypos);
				$element.removeClass("maximized");
				
				//Disable resize
				plugin.resizable(true);
				
				//Trigger size change
				$frame.trigger("sizeHasChanged");
			}
		}
		
		
		/**
		 * MINIMIZE
		 */
		plugin.minimize = function(){
			$element.animate({
				top: '+=100',
				opacity: 0
			}, 200, function(){
				$element.hide();
				plugin.settings.minimized = true;
			});
			
		};

		
		
		/**
		 * UNMINIMIZE
		 */
		plugin.unminimize = function(){
			$element.show();
			$element.animate({
				top: '-=100',
				opacity: 1
			}, 200, function(){
				plugin.settings.minimized = false;
			});
			
		};
		
		
		
		/**
		 * TURN ON/OFF RESIZABLE
		 */
		plugin.resizable = function(value){
			if(plugin.settings.resizable){
				$element.resizable("option", "disabled", !value );
			}
		};
		
		
		/**
		 * BRING TO FRONT
		 */
		plugin.bringToFront = function(){
			
			var highest = -999;

			$("*").each(function() {
			    var current = parseInt($(this).css("z-index"), 10);
			    if(current && highest < current) highest = current;
			});

			$element.css("z-index", highest+1);
		};
		
		
		//Initialize
		init();


	};

	
	$.fn.zupaWindow = function(options) {
		return this.each(function() {
			if (undefined == $(this).data('zupaWindow')) {
				var plugin = new $.zupaWindow(this, options);
				$(this).data('zupaWindow', plugin);
			}
		});
	};
   
   ZupaWindow = function(options){
	   return new $.zupaWindow(this, options);
   }
   
   

})( jQuery );







/**
 * Override 'dblclick' event to support doubbletap on touch devices
 */
jQuery.event.special.dblclick = {
    setup: function(data, namespaces) {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 || agent.indexOf('ipod') >= 0) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.bind('touchend.dblclick', jQuery.event.special.dblclick.handler);
        } else {
            var elem = this,
                $elem = jQuery(elem);
            $elem.bind('click.dblclick', jQuery.event.special.dblclick.handler);
        }
    },
    teardown: function(namespaces) {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 || agent.indexOf('ipod') >= 0) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.unbind('touchend.dblclick');
        } else {
            var elem = this,
                $elem = jQuery(elem);
            $elem.unbind('click.dblclick', jQuery.event.special.dblclick.handler);
        }
    },
    handler: function(event) {
        var elem = event.target,
            $elem = jQuery(elem),
            lastTouch = $elem.data('lastTouch') || 0,
            now = new Date().getTime();
        var delta = now - lastTouch;
        if (delta > 20 && delta < 500) {
            $elem.data('lastTouch', 0);
            $elem.trigger('dblclick');
        } else {
            $elem.data('lastTouch', now);
        }
    }
};

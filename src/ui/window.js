/*!
 * Zupa UI - Window
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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
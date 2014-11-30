/*!
 * Zupa UI - Button Menu
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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
            }else if(plugin.settings.buttons[buttonIndex].contextMenu != null){
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
                if(plugin.settings.buttons[buttonIndex].contextMenu != null){
                    openMenu(buttonIndex, $(this));
                }

            }
        });

        // BIND: Close menus if click anywhere else
        $(document).on("mousedown", "body", function(e){

            var parentMenus = $(e.target).closest(".gui-context-menu");
            var parentButtons = $(e.target).closest(".gui-context-menu-button");

            if(parentMenus.length == 0 && plugin.settings.expandedButtonMenu != null && parentButtons.length == 0){

                //Close all menus and stop browsing
                //plugin.closeAllMenus(true);
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

            //Context menu
            if(button.menu != null && button.menu.length > 0){
                button.contextMenu = ZupaContextMenu({
                    menu: button.menu,
                    trigger: 'parent',
                    parentSelector: '.gui-button-menu-button'
                });
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

        //Check if already open
        if(plugin.settings.expandedButtonMenu == buttonIndex){
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
        var topPosition = $buttonElement.offset().top + $buttonElement.outerHeight();
        var leftPosition = $buttonElement.offset().left;

        plugin.settings.buttons[buttonIndex].contextMenu.openMenu(leftPosition, topPosition);
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
        $.each(plugin.settings.buttons, function(index, button){
            if(button.contextMenu != null){
                button.contextMenu.closeMenu();
            }
        });

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

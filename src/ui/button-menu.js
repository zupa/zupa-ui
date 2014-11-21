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

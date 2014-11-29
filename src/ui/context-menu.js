/*!
 * Zupa UI - Context Menu
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */


$.zupaContextMenu = function(element, options) {

    var defaults = {
        menu: [{
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
        trigger: 'leftclick',       // What opens the menu: leftclick | rightclick | doubleclick | none
        browsingMenus: false,		// Flag the indicates when menus should be opened on hover'
        expandedMenuIndex: null,	// Index of which buttons menu that is expanded
        menuDelay: 400				// Number of milliseconds delay before opening submenu
    };

    var plugin = this;
    plugin.settings = {};

    var $element = $(element);
    var $container = null;


    /**
     * INITIALIZE
     */
    plugin.init = function() {

        //Extend default options
        plugin.settings = $.extend(true, {}, defaults, options);

        //Binding: Parent resize
        $element.parent().on('sizeHasChanged', function(event){
            if(event.target == $element.parent()[0]){
                //drawButtons();
            }
        });

        // BIND: Close menus if click anywhere else
        $(document).on("mousedown", "body", function(e){

            var parentMenus = $(e.target).closest(".gui-context-menu");
            var parentButtons = $(e.target).closest(".gui-context-menu-button");

            if(parentMenus.length == 0 && parentButtons.length == 0){

                //Close all menus and stop browsing
                plugin.closeAllMenus(true);
            }
        });



        $element.on('contextmenu', function(e){
            openMenu(e.pageX, e.pageY);
            return false;
        });



    };



    /**
     * OPEN MENU
     */
    var openMenu = function(xPos, yPos){

        //Fetch menu
//        var menu = plugin.settings.buttons[buttonIndex].menu;
//        if(menu == null || menu.length < 1 || plugin.settings.expandedButtonMenu == buttonIndex){
//            return false;
//        }
//
//        //Close all menus
//        if(plugin.settings.expandedButtonMenu != null){
//            plugin.closeAllMenus();
//        }
//
//        //Set variable that automatically opens menu on hover
//        plugin.settings.browsingMenus = true;
//
//        //Set current expanded button menu index
//        plugin.settings.expandedButtonMenu = buttonIndex;
//
//        //Set button state
//        $buttonElement.addClass("expanded");
//
//        //Generate menu
//        var menuLevel = 1;
//        var topPosition = $element.parent().height();
//        var leftPosition = $buttonElement.position().left;

        // Create container
        $container = $('<div class="gui-context-menu-container"></div>');
        $container.css({top: yPos, left: xPos});

        //Generate menutree
        var $menu = generateMenu(plugin.settings.menu, 1);

        //Render menu
        $(document.body).append($container);

        //Show first level
        $menu.fadeIn("fast");

    }

    /**
     * GENERATE MENU
     * Generates tree of menus
     */
    var generateMenu = function(menu, menuLevel){



        //Level 1 - add bridge between button and menu
//        if(menuLevel == 1){
//
//            //Find with of parent button
//            var parentButtonWidth = $buttonContainer.find("li").eq(plugin.settings.expandedButtonMenu).outerWidth();
//
//            //If first button subtract 1px else subtract 2px
//            if(plugin.settings.expandedButtonMenu == 0){
//                parentButtonWidth -= 1;
//            }else {
//                parentButtonWidth -= 2;
//            }
//
//            var $buttonMenuBridge = $('<li class="menu-bridge"></li>');
//            $buttonMenuBridge.outerWidth(parentButtonWidth);
//
//            $menuElement.append($buttonMenuBridge);
//
//
//        }else if(menuLevel > 1){
//            $menuElement.hide();
//        }

        //Main element
        var $menuElement  = $('<table class="gui-context-menu gui-context-menu-level-'+menuLevel+'"><tbody></tbody></table>').hide();

        //Draw menu items
        $.each(menu, function(index, button){

            //Label
            var $buttonElement = $('<tr class="gui-context-menu-button"><td>'+button.label+'</td></tr>');

            //Icon
            if(button.icon != null){
                $buttonElement.find("td").append('<i class="'+button.icon+'"></i>');
            }

            //Append to menu
            $menuElement.find("tbody").append($buttonElement);

            //Continue down the menu tree
            if(button.menu != null && button.menu.length > 0){

                //Generate this buttons submenu
                var submenu = generateMenu(button.menu, menuLevel+1);

                //Add expand arrow
                $buttonElement.find("td").append('<span class="expand-indicator"></span>');
                $buttonElement.find("td").addClass("expand-arrow");

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

        //Render menu
        $container.append($menuElement);

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
        var distanceFromParent = 5;

        var submenuLeft = $buttonElement.closest("table").position().left + $buttonElement.parent().outerWidth() + distanceFromParent;
        var submenuTop = $buttonElement.position().top + $buttonElement.closest("table").position().top;
        submenu.css({left: submenuLeft, top: submenuTop});
        submenu.fadeIn("fast");
    };

    /**
     * CLOSE A SUBMENU
     */
    var closeSubmenus = function($ownersSubmenu, fromLevel){
        $.each($container.find(".gui-context-menu:visible"), function(index, submenu){

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
        $(document.body).find(".gui-context-menu-container").remove();

        //Set all buttons as retracted
        //$buttonContainer.find(".expanded").removeClass("expanded");
    }

    //Initialize
    plugin.init();

};

$.fn.zupaContextMenu = function(options) {
    return this.each(function() {
        if (undefined == $(this).data('zupaContextMenu')) {
            var plugin = new $.zupaContextMenu(this, options);
            $(this).data('zupaContextMenu', plugin);
        }
    });
};

ZupaContextMenu = function(options){
    return new $.zupaContextMenu(this, options);
}
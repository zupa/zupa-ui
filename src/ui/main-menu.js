/*!
 * Zupa UI - Main Menu
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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

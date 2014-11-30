/*!
 * Zupa UI - Placeholder
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

$.zupaPlaceholder = function(element, options) {

    var defaults = {
        message: "PLACEHOLDER"
    };

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

        $element.addClass("gui-placeholder");
        $element.append('<div class="gui-placeholder-inner"></div>');
        $inner = $element.find(".gui-placeholder-inner");

        //Message
        if(plugin.settings.message != null){
            $inner.text(plugin.settings.message);
        }

        //Binding: Parent resize
        $element.parent().on('sizeHasChanged', function(event){
            if(event.target == $element.parent()[0]){
                updateSize();
            }
        });

        updateSize();
    };

    /**
     * CENTER TO PARENT
     */
    var updateSize = function(){

        var parentHeight = $element.parent().height();
        var parentWidth = $element.parent().width();

        $inner.width(parentWidth-22);
        $inner.height(parentHeight-22);

        $inner.css("line-height", parentHeight-22+"px");
    };

    //Initialize
    plugin.init();

};

$.fn.zupaPlaceholder = function(options) {
    return this.each(function() {
        if (undefined == $(this).data('zupaPlaceholder')) {
            var plugin = new $.zupaPlaceholder(this, options);
            $(this).data('zupaPlaceholder', plugin);
        }
    });
};
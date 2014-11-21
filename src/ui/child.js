/*!
 * Zupa UI - Child
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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
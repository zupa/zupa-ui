/*!
 * Zupa UI - Thumb
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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

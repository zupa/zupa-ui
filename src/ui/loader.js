/*!
 * Zupa UI - Loader
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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
/*!
 * Zupa UI - Accordion
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

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

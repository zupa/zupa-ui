/*!
 * Zupa UI - Tabs
 * http://www.zupa.io
 *
 * Zupa UI is licensed under a
 * Creative Commons Attribution-NonCommercial 4.0 International License.
 * Permissions beyond the scope of this license may be available at http://www.zupa.io.
 *
 * http://creativecommons.org/licenses/by-nc/4.0/
 *
 */

$.zupaTabs = function(element, options) {

    var defaults = {
        active:     0
//            tabs:       [{
//                            label: "Test",
//                            content: "#tab1",
//                            closeable: false,
//                            scrollVertical: true,
//                            scrollHorizontal: true
//                        }]
    };

    var plugin = this;
    plugin.settings = {};

    var $element = $(element);

    var $tabPane = null;                // Tab pane area
    var $tabPaneContainer = null;       // Container to hold tabs
    var $tabPaneExpandButton = null;    // Expand button if there are invisible tabs
    var $tabPaneExpandMenu = null;      // Expand menu to hold excessive tabs

    var $tabContainer = null;           // Container for tab related content blocks

    /**
     * INITIALIZE
     */
    plugin.init = function() {

        //Extend default options
        plugin.settings = $.extend(true, {}, defaults, options);

        // Add HTML and assign selectors
        $element.addClass("gui-tabs");
        $element.wrapInner('<div class="tab-container"></div>');
        $element.prepend('<div class="tab-pane"></div>');
        $element.prepend('<ul class="tab-pane-expand-menu"><div class="top-border"></div></ul>');

        $tabPane = $element.find(".tab-pane");
        $tabPane.append('<div class="tab-pane-expand"></div>');
        $tabPane.append('<div class="tab-pane-container"></div>');

        $tabPaneExpandButton = $tabPane.find(".tab-pane-expand").hide();
        $tabPaneExpandMenu = $element.find(".tab-pane-expand-menu").hide();
        $tabPaneContainer = $tabPane.find(".tab-pane-container");
        $tabContainer = $element.find(".tab-container");

        //Draw tabs to pane
        drawTabs();

        //Draw size initially
        updateTabContainer();

        //Set default active
        plugin.selectTab(plugin.settings.active);


        // BIND: Expand toggle button/menu
        $tabPaneExpandButton.click(function(){
            $tabPaneExpandMenu.toggle();
            $tabPaneExpandButton.toggleClass("selected");
        });

        // BIND: Tabs in pane click
        $tabPane.on("click", ".gui-tab", function(event){
            if(!$(event.target).is('.tab-close-btn')){
                plugin.selectTab($(this).index());
                hideExpandMenu();
            }
        });

        // BIND: Tabs in expand click
        $tabPaneExpandMenu.on("click", "li", function(event){
            if(!$(event.target).is('.tab-close-btn')){
                var index = $(this).attr("id").split("-")[1];
                plugin.selectTab(index);
            }
        });

        // BIND: Close tab button
        $element.on("click", ".tab-close-btn", function(event){
            var index = $(this).parent().attr("id").split("-")[1];
            plugin.removeTab(index);
        });

        // BIND: Parent container has resized
        $element.parent().on('sizeHasChanged', function(event){
            if(event.target == $element.parent()[0]){
                updateTabContainer();
                drawTabs();
            }
        });

    };


    /**
     * DRAW INITIAL TABS
     * Adds the plugins initial tabs on startup
     */
    var drawTabs = function(){

        //Empty tab pane container
        $tabPaneContainer.empty();

        //Empty expand menu
        $tabPaneExpandMenu.find("li").remove();

        //Check if there are any tabs
        if(plugin.settings.tabs == null){
            return false;
        }

        //Fill tab container with tabs
        $.each(plugin.settings.tabs, function(index, tab){
            drawTabToPane(index, tab.label, tab.content, tab.closeable);

            //If scrollable content
            var scrollAxis = null;
            if(tab.scrollVertical){
                scrollAxis = "y";
            }
            if(tab.scrollHorizontal){
                scrollAxis += "x";
            }

            if(scrollAxis != null){
                $tabContainer.find(tab.content).mCustomScrollbar({
                    theme: "light-thick",
                    axis: scrollAxis,
                    setTop: 0,
                    contentTouchScroll: true,
                    mouseWheelPixels: "auto",
                    scrollButtons:{
                        enable: true
                    }
                });
            }
        });

        //Move tabs to expand menu if pane is too small
        moveTabsToExpand();

        //Select active tab
        plugin.selectTab(plugin.settings.active);

    };


    /**
     * MOVE TABS TO EXPAND
     * Move excessive tabs to the expand menu.
     */
    var moveTabsToExpand = function(){

        var tabPaneWidth = $tabPane.width()-10;

        var tabsTotalWidth = 0;
        plugin.expandedTabs = false;

        $tabPaneContainer.find(".gui-tab").each(function(index, tab){
            tabsTotalWidth += $(tab).outerWidth();

            if(tabsTotalWidth > tabPaneWidth){
                $(this).remove();
                drawTabToExpand(index, plugin.settings.tabs[index].label, plugin.settings.tabs[index].content, plugin.settings.tabs[index].closeable);
                plugin.expandedTabs = true;
            }
        });

        if(plugin.expandedTabs){
            $tabPaneExpandButton.show();
        }else {
            $tabPaneExpandButton.hide();
            $tabPaneExpandMenu.hide();
        }
    };


    /**
     * UPDATE SIZE OF TAB CONTAINER
     * Update sizes based on the parent elements dimensions.
     */
    var updateTabContainer = function(){
        var parentHeight = $element.parent().height();
        $tabContainer.height(parentHeight-34);
        $tabContainer.trigger("sizeHasChanged");
    };


    /**
     * DRAW TAB
     *
     * @param label
     * @param content
     */
    var drawTabToPane = function(index, label, content, closeable){
        var $tabElement = $('<div id="tab-'+index+'" class="gui-tab" rel="'+content+'"><div class="tab-left"></div><div class="tab-center">'+label+'</div><div class="tab-right"></div></div>');
        if(closeable){
            $tabElement.prepend('<div class="tab-close-btn"></div>');
        }
        $tabPaneContainer.append($tabElement);
    };

    var drawTabToExpand = function(index, label, content, closeable){
        var $tabElement = $('<li id="tab-'+index+'" rel="'+content+'">'+label+'</li>');
        if(closeable){
            $tabElement.append('<div class="tab-close-btn"></div>');
            $tabElement.addClass("tab-closeable");
        }
        $tabPaneExpandMenu.append($tabElement);
    };


    /**
     * HIDE EXPAND MENU
     */
    var hideExpandMenu = function(){
        $tabPaneExpandMenu.hide();
        $tabPaneExpandButton.removeClass("selected");
    };

    /**
     * Method:
     * ADD NEW TAB
     *
     * Takes object with values:
     * - "label": Label of tab
     * - "content": Selector for tab content
     * - "closeable": Weather or not the tab is closeable
     *
     */
    plugin.addTab = function(newTab){

        //Check if tabs is null
        if(plugin.settings.tabs == null){
            plugin.settings.tabs = [];
        }

        //Add tab to list
        plugin.settings.tabs.push({
            label: newTab.label,
            content: newTab.content,
            closeable: newTab.closeable
        });

        var nextIndex = plugin.settings.tabs.length-1;

        //Draw tab
        if(plugin.expandedTabs){
            drawTabToExpand(nextIndex, newTab.label, newTab.content, newTab.closeable);
        }else {
            drawTabToPane(nextIndex, newTab.label, newTab.content, newTab.closeable);

            //Move tabs to expand menu if pane is too small
            moveTabsToExpand();
        }

        //Set added tab as selected
        plugin.selectTab(nextIndex);
    };


    /**
     * Method:
     * ADD TAB CONTAINER
     * @param container
     */
    plugin.addTabContent = function(content, scrollVertical, scrollHorizontal){
        $tabContainer.append(content);

        //If scrollable content
        var scrollAxis = null;
        if(scrollVertical){
            scrollAxis = "y";
        }
        if(scrollHorizontal){
            scrollAxis += "x";
        }

        if(scrollAxis != null){
            content.mCustomScrollbar({
                theme: "light-thick",
                axis: scrollAxis,
                setTop: 0,
                contentTouchScroll: true,
                mouseWheelPixels: "auto",
                scrollButtons:{
                    enable: true
                }
            });
        }
    };


    /**
     * Method:
     * SELECT TAB
     */
    plugin.selectTab = function(tabIndex){

        //Update setting
        plugin.settings.active = tabIndex;

        //Deselect all tabs
        plugin.deselectAll();

        //Find tab in pane
        var tabIsInExpand = false;
        var $selectedTab = $tabPaneContainer.find("#tab-"+tabIndex);

        //If not in pane check expand
        if(!$selectedTab.length){
            tabIsInExpand = true;
            $selectedTab = $tabPaneExpandMenu.find("#tab-"+tabIndex);
        }

        //There are special styles for tabs before and after selected tab in pane
        if(!tabIsInExpand){

            //Mark tab to the left of active tab
            if(tabIndex > 0){
                $tabPaneContainer.find("#tab-"+(tabIndex-1)).addClass("tab-toleft");
            }

            //Mark tab to the right of active tab
            if(!$selectedTab.is(':last-child')){
                $tabPaneContainer.find("#tab-"+(tabIndex+1)).addClass("tab-toright");
            }
        }

        //Show selected tabs content
        $selectedTab.addClass("active");

        var contentSelector = $selectedTab.attr("rel");
        var $selectedTabContainer = $tabContainer.find(contentSelector);

        //Show container
        $selectedTabContainer.show();

        //Scroll to top
        $selectedTabContainer.mCustomScrollbar("update");

        //Broadcast a size change in the container
        $tabContainer.trigger("sizeHasChanged");
        $selectedTabContainer.trigger("sizeHasChanged");
    };

    /**
     * Method:
     * REMOVE TAB
     *
     * @param index
     */
    plugin.removeTab = function(tabIndex){

        var $selectedTab = $element.find("#tab-"+tabIndex);
        var contentSelector = $selectedTab.attr("rel");

        //Destroy scrollbar
        if(plugin.settings.tabs[tabIndex].scrollVertical || plugin.settings.tabs[tabIndex].scrollHorizontal){
            $tabContainer.find(contentSelector).mCustomScrollbar("destroy");
        }

        // Remove content
        $tabContainer.find(contentSelector).remove();

        // Remove from tab list
        plugin.settings.tabs.splice(tabIndex, 1);

        //Select adjacent tab if exists and this one was selected
        var numberOfTabs = plugin.settings.tabs.length;
        if(plugin.settings.active == tabIndex){
            if(numberOfTabs > tabIndex){
                plugin.settings.active = tabIndex; //Select tab to the right
            }else if(tabIndex > 0){
                plugin.settings.active = tabIndex-1; //Select tab to the left
            }
        }else if(tabIndex < plugin.settings.active){
            plugin.settings.active = plugin.settings.active-1;
        }

        // Redraw tabs
        drawTabs();

    };

    /**
     * Method:
     * DESELECT ALL TABS
     */
    plugin.deselectAll = function(){

        //Deselect in expand
        $tabPaneExpandMenu.find(".active").removeClass("active");

        //Deselect in pane
        $tabPaneContainer.find(".active").removeClass("active");
        $tabPaneContainer.find(".tab-toleft").removeClass("tab-toleft");
        $tabPaneContainer.find(".tab-toright").removeClass("tab-toright");

        //Hide all content blocks
        $element.find(".tab-container").find("> div").hide();
    };


    /**
     * Method:
     * GET NUMBER OF TABS
     * @returns {number}
     */
    plugin.numberOfTabs = function(){
        return plugin.settings.tabs.length;
    };


    //Initialize
    plugin.init();

};

$.fn.zupaTabs = function(options) {
    return this.each(function() {
        if (undefined == $(this).data('zupaTabs')) {
            var plugin = new $.zupaTabs(this, options);
            $(this).data('zupaTabs', plugin);
        }
    });
};

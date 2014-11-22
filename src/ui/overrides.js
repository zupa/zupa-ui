/**
 * Override 'dblclick' event to support doubbletap on touch devices
 */
$.event.special.dblclick = {
    setup: function(data, namespaces) {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 || agent.indexOf('ipod') >= 0) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.bind('touchend.dblclick', jQuery.event.special.dblclick.handler);
        } else {
            var elem = this,
                $elem = jQuery(elem);
            $elem.bind('click.dblclick', jQuery.event.special.dblclick.handler);
        }
    },
    teardown: function(namespaces) {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0 || agent.indexOf('ipod') >= 0) {
            var elem = this,
                $elem = jQuery(elem);
            $elem.unbind('touchend.dblclick');
        } else {
            var elem = this,
                $elem = jQuery(elem);
            $elem.unbind('click.dblclick', jQuery.event.special.dblclick.handler);
        }
    },
    handler: function(event) {
        var elem = event.target,
            $elem = jQuery(elem),
            lastTouch = $elem.data('lastTouch') || 0,
            now = new Date().getTime();
        var delta = now - lastTouch;
        if (delta > 20 && delta < 500) {
            $elem.data('lastTouch', 0);
            $elem.trigger('dblclick');
        } else {
            $elem.data('lastTouch', now);
        }
    }
};



$(function() {
    $("#scroller").draggable({scroll: false, containment: 'parent', stop: function(){map.refresh() }});
});



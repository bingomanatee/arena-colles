var Map = function(hs, ws){
    this.mr = $('#map_region');
    this.scroller = $('#scroller');
    this.zr = $('#zoom_region_tiles');
    
    this.scroll_width = this.mr.width() - this.scroller.width();
    this.scroll_height = this.mr.height() - this.scroller.height();
    this.x = 0;   // left cell of zoom
    this.y = 0;   // top cell of zoom
    this.hs = hs; // number of cells high
    this.ws = ws; // number of cells wide
    this.data = []
    this.randomize();
    this.refresh_topo();
}

Map.CELL_SCALE = 50;

Map.prototype.refresh_topo = function(){
    this.zr.empty();
    for (var x = 0; x < 600/Map.CELL_SCALE; ++x)
    for (var y = 0; y < 300/Map.CELL_SCALE; ++y){
        var id = "cell_" + x + '_' + y;
        var h = this.data[this.x + x][this.y + y];
       // console.log('x: ', x, ', y:', y, ', h:', h);
        $.tmpl("cell", {id: id, scale: Map.CELL_SCALE, h: h, x: 20 + x * Map.CELL_SCALE, y: 20 + y * Map.CELL_SCALE}).appendTo( "#zoom_region_tiles" );
    }
}

Map.prototype.move = function(x, y){
    console.log('move ', x, ',',  y);
    this.x += x;
    this.y += y;
    this.move_thumb();
    this.refresh_topo();
}

Map.prototype.random = function(){
    var r = ( Math.random() + Math.random() );
    return Math.round(r * 5);
}

Map.prototype.randomize = function(){
    for (var x = 0; x < this.ws; ++x)
    for (var y = 0; y < this.hs; ++y){
        if (y == 0){
            this.data[x] = [this.random()];
        } else {
            this.data[x].push(this.random());
        }
        
        if ((!(x % 10)) || (!(y % 5))){
            this.data[x][y] = 10 + (x + y) % 5;
        }
    }
}

Map.prototype.refresh = function(){
    this.refresh_coords();
    this.refresh_topo();
}

Map.prototype.move_thumb = function(){
    var sp_x = Math.round(this.scroll_width * this.x_percent());
    var sp_y = Math.round(this.scroll_height * this.y_percent());
    
    console.log('moving sp to ', sp_x, ',', sp_y);
    this.scroller.css('left', sp_x + 'px');
    this.scroller.css('top', sp_y + 'px');
    this.report();
}

Map.prototype.report = function(){
    var lon = Math.round(this.x_percent() * 360)-180;
    var lat = Math.round(this.y_percent() * 180)-90;
    $('#scroller_x').html(this.x + ' of ' + this.ws + '(' + lon + '&deg;)' + Math.round(this.x_percent() * 100) + '%');
    $('#scroller_y').html(this.y + ' of ' + this.hs + '(' + lat + '&deg;)' + Math.round(this.y_percent() * 100) + '%')
}

Map.prototype.x_percent = function(){
    return this.x / this.ws;
}

Map.prototype.y_percent = function(){
    return this.y / this.hs;
}

Map.prototype.refresh_coords = function(){
    
    var sp = this.scroller.position();
    var zp = this.mr.position();
    
    var x = sp.left - ( 1 + zp.left);
    
    this.x = Math.round(this.ws * x / 180);
    
    var y = sp.top - ( 1 + zp.top);
    
    this.y = Math.round(this.hs * y / 90);
    this.report();
}
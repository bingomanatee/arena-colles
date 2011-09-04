MARS_ANI._config_exe = function() {
    MARS_ANI.log_flags.push('config','animate_frame', 'mat', ['Map_Tile',  'measure']);
    MARS_ANI.unlog_flags.push('clear');

    MARS_ANI.log(['config'],'MARS_ANI._config_exe');

    MARS_ANI._init_objects = function() {
        MARS_ANI.log(['init', 'objects'],'creating Map Tile');
        MARS_ANI.tile = new MARS_ANI.Map_Tile({north: 15, south: -15, east: 60, west: 0, zoom: 64, deg_size: 10 });
        MARS_ANI.tile.create();
    }

    MARS_ANI.log(['config', 'clear'],'MARS_ANI._config_exe done');

    setTimeout(function() {
        delete MARS_ANI._config_exe;
        MARS_ANI.log(['clear', 'config'],'_config_exe cleared')
    }, 1);
};

try {
    MARS_ANI._config_exe();
} catch (err) {
    MARS_ANI.log_err('error in initializing objects', err)
}
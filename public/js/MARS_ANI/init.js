if (! Detector.webgl) Detector.addGetWebGLMessage();

MARS_ANI.init = function() {
    MARS_ANI.container_name = "#terrain_preview";
    MARS_ANI._init_renderer();
    MARS_ANI.log(['init'], 'init: renderer initialized');
    MARS_ANI._init_scene();
    MARS_ANI.log(['init'], 'init: scene initialized');
    MARS_ANI._init_lights();
    MARS_ANI.log(['init'], 'init: lights initialized');
    MARS_ANI._init_objects();
    MARS_ANI.log(['init'], 'init: objects initialized');
    MARS_ANI._init_camera();
    MARS_ANI.log(['init'], 'init: camera initialized');
    //MARS_ANI._init_stats();
    MARS_ANI.log(['init'], '_____ DONE WITH INIT ____');
}

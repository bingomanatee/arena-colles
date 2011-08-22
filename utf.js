var forever = require('forever');

  var child = new (forever.Monitor)('update_tiles.js', {
    max: 4,
    silent: false,
    options: []
  });

  child.on('exit', function(){
      console.log('forever stopped');
  });
  child.start();
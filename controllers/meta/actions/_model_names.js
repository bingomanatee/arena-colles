var fs = require('fs');
var inflect = require('inflect');

var jsreg = /^[^_].*\.js$/;

function _un_js(item){return item.replace(/\.js$/, '')};

function _model_select(item){ return jsreg.test(item); }

module.exports = function model_names(){
  //  console.log(__filename, ': model names start');
    var models          = fs.readdirSync(MVC_MODELS);
  //  console.log(__filename, ': models: ', models);
    models = _.select(models, _model_select);
    models              = _.map(models, _un_js);
    
   // console.log(__filename, ': models _un_js, ', models);
    var controllers     = fs.readdirSync(MVC_CONTROLLERS);
    controllers         = _.select(controllers, _model_select);
   // console.log(__filename, ': controllers, ', controllers);
    controllers         = _.map(controllers, _un_js);
 //   console.log(__filename, ': controllers, _un_js: ', controllers);
    controllers         = _.map(controllers, inflect);
    //console.log(__filename, ': controllers, inflected: ', controllers);
    
    models = models.concat(controllers);
    models = _.uniq(models);
    models = _.sortBy(models, function(n){ return n;});
    return _.map(models, function(n){
       return {value: n, label: n}; 
    });
}
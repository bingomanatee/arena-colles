

module.exports = function(context){
    var member = context.member();
    
    function _char_finder(err, chars){
        context,render({chars: chars});
    }
    
    if (member){
        this.model.find({player: member._id}, _char_finder);
    } else {
        context.render();
    }
}
module.exports = function(context) {
    console.log(__filename);

    context.render('error/error.html', context.request);

}
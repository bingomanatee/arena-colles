module.exports = function(Context, gate) {
    Context.prototype.req_params = function(merge_params) {
        var out = this.request.body ? this.request.body : {};
        //  console.log(__filename, ': this = ', this, '; this.request = ', this.request, '; out = ', out);
        if (merge_params && this.request.hasOwnProperty('params')) {
             // console.log(__filename, ': merging params ', this.request.params);
             _.defaults(out, this.request.params);
        }
        if (merge_params && this.request.hasOwnProperty('query')){
           _.defaults(out, this.request.query);
        }
        return out;
    }
    gate.task_done();
}
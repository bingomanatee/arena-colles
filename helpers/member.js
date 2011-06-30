module.exports = function(Context, gate) {
    Context.prototype.member = function() {
        if (this.request.hasOwnProperty('session') && this.request.session.hasOwnProperty('member')) {
            return this.request.session.member;
        } else {
            return false;
        }
    }
    gate.task_done();
}
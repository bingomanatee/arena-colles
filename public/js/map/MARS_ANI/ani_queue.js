MARS_ANI._create_queue = function() {

    MARS_ANI.Ani_Queue = function (animator) {
        this.animator = animator;
        this._tasks = [];
    }

    MARS_ANI.Ani_Queue.prototype = {
        run: function() {
              MARS_ANI.log(['ani_queue', 'run'], 'running ');
            var self = this;
            var primary_tasks = _.select(this._tasks, _primary_tasks);

            _.sortBy(primary_tasks, _order_tasks)
                .forEach(function(task) {
                    task.run(self);
                });

              MARS_ANI.log(['ani_queue', 'run', 'clear'], 'done running ');
        },

        get_tasks: function() {
            return this._tasks;
        },

        add_task: function (name, handler, order, parent) {
            var dupe = 0;
            this._tasks.forEach(function(t) {
                if (t.name == name) {
                    ++dupe;
                }
            });

            if (dupe > 0) {
                throw new Error(dupe + ' tasks named ' + name + ' in queue');
            }

            if (_.isNull(order)) {

                var primary_tasks = _.select(this._tasks, _primary_tasks);
                if (primary_tasks.length) {
                    order = null;
                    _.sortBy(primary_tasks, _order_tasks)
                        .forEach(function(task) {
                            if (_.isNull(order) || order < task.order) {
                                order = task.order;
                            }
                        });
                } else {
                    order = 0;
                }

            }

            this._tasks.push(new MARS_ANI.Ani_Task(this, handler, order, parent));
        }
    }

    MARS_ANI.Ani_Task = function (queue, name, handler, order, parent) {
        if (!order) {
            order = 0;
        }

        if (!name) {
            throw new Error('unnamed task added');
        }

        if (parent && (order == 0)) {
            throw new Error('added task ' + name + ' with parent ' + parent + 'and order 0; must hae nonzero order');
        }

        this.name = name;
        this._handler = handler;
        this.order = order;
        this.parent = parent;
        this.queue = queue;
    }

    MARS_ANI.Ani_Task.prototype = {
        run: function() {
            try {
                var self = this;

                var pre_children = [];
                var post_children = [];

                this.queue._tasks.forEach(function(t) {
                    if (t.parent == self.name) {
                        if (t.order > 0) {
                            pre_children.push(t);
                        } else if (t.order < 0) {
                            post_children.push(t);
                        }
                    }
                })

                _.sortBy(pre_children, _order_tasks)
                    .forEach(function(t) {
                        t.run()
                    });

                this._handler();

                _.sortBy(post_children, _order_tasks)
                    .forEach(function(t) {
                        t.run()
                    });

                return false;
            } catch (err) {
                return err;
            }
        }
    }


    function _order_tasks(task) {
        return task.order;
    }

    function _primary_tasks(t) {
        return t.parent ? false : true;
    }

    setTimeout(function() {
      //  delete MARS_ANI._create_queue
    }, 1);
}

MARS_ANI._create_queue();
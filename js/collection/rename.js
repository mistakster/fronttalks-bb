(function () {

  App.RenameRegion = Backbone.View.extend({

    initialize: function () {
      this.currentView = null;
    },

    show: function (view) {
      if (view != this.currentView) {
        if (this.currentView && _.isFunction(this.currentView.kill)) {
          this.currentView.kill();
        }
        this.currentView = view;
        view.setElement(this.el);
        view.render();
      }
    }

  });


  App.RenameView = Backbone.View.extend({

    events: {
      "submit form": "update",
      "click .btn-cancel": "kill"
    },

    render: function () {
      this.$("input, button").removeAttr("disabled");
      this.$("#file-name").val(this.model.get("name"));
      return this;
    },

    update: function (e) {
      e.preventDefault();
      this.model.set("name", this.$("#file-name").val());
      return this.kill();
    },

    kill: function () {
      this.model.trigger("kill", this.model);
      this.undelegateEvents();
      this.$("input, button").attr("disabled", true);
      this.$("#file-name").val("");
      return this;
    }

  });

}());

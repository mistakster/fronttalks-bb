(function () {

  App.RenameRegion = Backbone.View.extend({

    initialize: function () {
      this.currentView = null;
    },

    show: function (view) {
      if (view != this.currentView) {
        if (this.currentView && _.isFunction(this.currentView.destroy)) {
          this.currentView.destroy();
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
      "click .btn-cancel": "destroy"
    },

    render: function () {
      this.$("input, button").removeAttr("disabled");
      this.$("#file-name").val(this.model.get("name"));
      return this;
    },

    update: function (e) {
      e.preventDefault();
      this.model.set("name", this.$("#file-name").val());
      return this.destroy();
    },

    destroy: function () {
      this.model.trigger("destroy", this.model);
      this.undelegateEvents();
      this.$("input, button").attr("disabled", true);
      this.$("#file-name").val("");
      return this;
    }

  });

}());

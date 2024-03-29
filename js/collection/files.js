(function () {

  App.Files = Backbone.Collection.extend({

    model: App.File,

    initialize: function () {
      var collection = this;
      this.on("activate", function (model) {
        var id = collection.lastActiveId = model.id;
        this.forEach(function (model) {
          if (model.id != id) {
            model.deactivate();
          }
        });
      });
      this.on("deactivate", function (model) {
        if (this.lastActiveId == model.id) {
          this.lastActiveId = null;
        }
      });
      return this;
    }

  });

  App.FilesView = Backbone.View.extend({

    tagName: "ul",

    className: "nav nav-tabs nav-stacked",

    initialize: function (options) {
      _.bindAll(this, "addItem", "render");
      options.root.html(this.$el);
      return this
        .listenTo(this.collection, "add", this.addItem)
        .listenTo(this.collection, "reset", this.resetItems)
        .render();
    },

    render: function () {
      this.$el.empty(); // just for sure
      this.collection.forEach(this.addItem);
      return this;
    },

    addItem: function (model) {
      var itemView = new App.FileView({
        model: model
      });
      if (this.collection.lastActiveId == model.id) {
        model.activate();
      }
      this.$el.append(itemView.$el);
      return this;
    },

    resetItems: function (collection, options) {
      if (options.previousModels) {
        _.forEach(options.previousModels, function (model) {
          model.trigger("remove");
        });
      }
      this.render();
    }

  });

}());

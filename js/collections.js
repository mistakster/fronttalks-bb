var App = {};

(function () {

  App.File = Backbone.Model.extend({
    activate: function () {
      this.set("active", true);
    },

    deactivate: function () {
      this.set("active", false);
    },

    rename: function () {
      this.activate();
      this.trigger("rename", this);
    }
  });

  App.FileView = Backbone.View.extend({

    tagName: "li",

    events: {
      "click .name": function (e) {
        e.preventDefault();
        this.model.rename();
      }
    },

    initialize: function () {
      this.listenTo(this.model, "change", this.render);
      this.model.on("remove", this.remove);
      this.render();
      return this;
    },

    render: function () {
      this.$el
        .html($('<a href="#" class="name"></a>').append(this.model.get("name")))
        .toggleClass("active", !!this.model.get("active"));
      return this;
    }

  });

  App.Files = Backbone.Collection.extend({

    model: App.File,

    initialize: function () {
      this.on("change:active", function (model, value) {
        if (value) {
          var id = model.id;
          this.forEach(function (model) {
            if (model.id != id) {
              model.deactivate();
            }
          });
        }
      });
    }

  });

  App.FilesView = Backbone.View.extend({

    tagName: "ul",

    className: "nav nav-tabs nav-stacked",

    initialize: function (options) {

      _.bindAll(this, "addItem", "render");

      this.listenTo(this.collection, "add", this.addItem);
      this.listenTo(this.collection, "reset", this.render);

      options.root.html(this.$el);

      this.render();

      return this;
    },

    render: function () {
      this.$el.empty();
      this.collection.forEach(this.addItem);
      return this;
    },

    addItem: function (model) {
      var itemView = new App.FileView({
        model: model
      });
      this.$el.append(itemView.$el);
      return this;
    }

  });

}());


(function () {

  App.RenameView = Backbone.View.extend({

    events: {
      "submit form": function (e) {
        e.preventDefault();
        this.update();
        this.destroy();
      },
      "click .btn-cancel": "destroy"

    },

    initialize: function () {
      _.bindAll(this, "render", "destroy");
      this.render();
      return this;
    },

    render: function () {
      this.$("input, button").removeAttr("disabled");
      this.$("#file-name").val(this.model.get("name"));
      return this;
    },

    update: function () {
      this.model.set("name", this.$("#file-name").val());
    },

    destroy: function () {
      this.undelegateEvents();
      this.$("input, button").attr("disabled", true);
      this.$("#file-name").val("");
    }

  });

}());


(function () {

  var data = [
    {"id": 1, "name": "File 1"},
    {"id": 2, "name": "File 2"},
    {"id": 2, "name": "File 2"},
    {"id": 3, "name": "File 3"},
    {"id": 4, "name": "File 4"},
    {"id": 5, "name": "File 5"},
    {"id": 6, "name": "File 6"}
  ];

  var files = new App.Files(data);

  new App.FilesView({
    collection: files,
    root: $("#panel-left")
  });

  files.on("rename", function (model) {
    new App.RenameView({
      model: model,
      el: "#panel-right"
    });
  });

  $("#refresh").on("click", function () {
    var brandNewData = data.slice();
    for (var i = 0; i < Math.random() * 3; i++) {
      brandNewData.push({
        id: i + 7,
        name: "File " + (i + 7)
      });
    }
    files.reset(brandNewData);
  });

}());
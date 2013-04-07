var App = {};

(function () {

  App.File = Backbone.Model.extend({
    activate: function () {
      this.active = true;
      this.trigger("activate", this);
    },

    deactivate: function () {
      this.active = false;
      this.trigger("deactivate", this);
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
      this.listenTo(this.model, "activate", this.activate);
      this.listenTo(this.model, "deactivate", this.deactivate);
      this.model.on("remove", this.remove);
      this.render();
      return this;
    },

    render: function () {
      this.$el
        .html($('<a href="#" class="name"></a>').append(this.model.get("name")))
        .toggleClass("active", !!this.active);
      return this;
    },

    activate: function () {
      this.$el.addClass("active");
    },

    deactivate: function () {
      this.$el.removeClass("active");
    }

  });

  App.Files = Backbone.Collection.extend({

    model: App.File,

    initialize: function () {
      this.on("activate", function (model) {
        var id = model.id;
        this.forEach(function (model) {
          if (model.id != id) {
            model.deactivate();
          }
        });
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
        this.update().destroy();
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
      return this;
    },

    destroy: function () {
      this.model.deactivate();
      this.undelegateEvents();
      this.$("input, button").attr("disabled", true);
      this.$("#file-name").val("");
      return this;
    }

  });

}());


(function () {

  var data = JSON.parse(localStorage.getItem("files"));
  data = _.isArray(data) ? data : [];

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



  $("#refresh-files").on("click", function () {
    var data = files.toJSON();
    var maxId = 0;
    if (data.length) {
      maxId = _.chain(data).map(function (file) {
        return file.id;
      }).max().value();
    }
    for (var i = 0; i < Math.random() * 3; i++) {
      var id = i + maxId + 1;
      data.push({
        id: id,
        name: "File " + id
      });
    }
    files.reset(data);
    localStorage.setItem("files", JSON.stringify(data));
  });

  $("#clear-files").on("click", function () {
    localStorage.removeItem("files");
    files.reset();
  });

}());
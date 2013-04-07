(function () {

  App.File = Backbone.Model.extend({
    activate: function () {
      this.active = true;
      return this.trigger("activate", this);
    },
    deactivate: function () {
      this.active = false;
      return this.trigger("deactivate", this);
    }
  });

  App.FileView = Backbone.View.extend({

    tagName: "li",

    events: {
      "click .name": function (e) {
        e.preventDefault();
        this.model.activate();
      }
    },

    initialize: function () {
      return this
        .listenTo(this.model, "change", this.render)
        .listenTo(this.model, "activate", this.renderActive)
        .listenTo(this.model, "deactivate", this.renderActive)
        .listenTo(this.model, "remove", this.remove)
        .render();
    },

    render: function () {
      this.$el.html($('<a href="#" class="name"></a>').append(this.model.get("name")));
      return this.renderActive();
    },

    renderActive: function () {
      this.$el.toggleClass("active", !!this.model.active);
      return this;
    }

  });

}());
(function (Backbone) {

  App.ItemView = Backbone.View.extend({

    className: "item",

    initialize: function () {
    },

    getTemplate: function () {
      return _.template('<%- text %>');
    },

    render: function () {
      this.$el.html(this.getTemplate()(this.model.toJSON()));
      return this;
    }

  });


  function getClassName(type) {
    var base = App.ItemView.prototype.className;
    return base + " " + base + "_type_" + type ;
  }


  App.ItemNewsView = App.ItemView.extend({

    className: getClassName("news"),

    initialize: function () {
      App.ItemView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<h2><%- head %></h2><div><%- text %></div>');
    }

  });

  App.ItemActionView = App.ItemView.extend({

    className: getClassName("action"),

    initialize: function () {
      App.ItemView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<% if (action == "like") { %><i class="icon-heart"></i> <% } %>' +
        '<strong><%- user %></strong> <%' +
        'if (action == "like") { print("likes your post"); }' +
        'else if (action == "unfollow") { print("is not follow you anymore"); }' +
        'else { print("makes unknown action with you"); }' +
        '%>');
    }

  });

  App.ItemMessageView = App.ItemView.extend({

    className: getClassName("message"),

    events: {
      "click .item__reply": function () {
        alert("reply to item #" + this.model.id);
      }
    },

    initialize: function () {
      App.ItemView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<span class="pull-right btn item__reply">Reply</span> ' +
        '<strong><%- user %></strong><div><%- text %></div>');
    }

  });


  App.ItemViewFactory = App.Factory(
    function (options) {
      return options.model.get("type");
    },
    {
      0: App.ItemView,
      "news": App.ItemNewsView,
      "action": App.ItemActionView,
      "message": App.ItemMessageView
    }
  );

}(Backbone));
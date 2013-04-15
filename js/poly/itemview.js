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

  App.ItemReplyView = App.ItemView.extend({

    className: getClassName("reply"),

    initialize: function () {
      App.ItemView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<strong><%- user %></strong><div><%- text %></div>');
    }

  });



  var F = App.ItemViewFactory = function () {
    return F.createItemView.apply(this, arguments);
  };

  F.createItemView = function (options) {
    var ctor;
    switch (options.model.get("type")) {
      case 'news':
        ctor = App.ItemNewsView;
        break;
      case 'action':
        ctor = App.ItemActionView;
        break;
      case 'reply':
        ctor = App.ItemReplyView;
        break;
      default:
        ctor = App.ItemView;
    }
    return new ctor(options);
  };

}(Backbone));
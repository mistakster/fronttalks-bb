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
      return _.template('<strong><%- user %></strong> makes unknown action on you');
    }

  });

  App.ItemActionLikeView = App.ItemActionView.extend({

    initialize: function () {
      App.ItemActionView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<i class="icon-heart"></i> <strong><%- user %></strong> likes your post');
    }

  });

  App.ItemActionUnfollowView = App.ItemActionView.extend({

    initialize: function () {
      App.ItemActionView.prototype.initialize.apply(this, arguments);
    },

    getTemplate: function () {
      return _.template('<strong><%- user %></strong> is not follow you anymore');
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
      "action": App.Factory(
        function (options) {
          return options.model.get("action");
        },
        {
          0: App.ItemActionView,
          "like": App.ItemActionLikeView,
          "unfollow": App.ItemActionUnfollowView
        }
      ),
      "message": App.ItemMessageView
    }
  );

}(Backbone));
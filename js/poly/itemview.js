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
    getTemplate: function () {
      return _.template('<h2><%- head %></h2><div><%- text %></div>');
    }
  });


  App.ItemActionView = App.ItemView.extend({
    className: function getActionClassName() {
      var action = this.model.get("action");
      return [getClassName("action"), "item-action", action ? "item-action_" + action : ""].join(" ");
    },
    getTemplate: function () {
      return _.template('<a class="item__user" href="#"><%- user %></a> makes unknown action on you');
    }
  });

  App.ItemActionLikeView = App.ItemActionView.extend({
    getTemplate: function () {
      return _.template('<i class="icon-heart"></i> <a class="item__user" href="#"><%- user %></a> likes your post');
    }
  });

  App.ItemActionUnfollowView = App.ItemActionView.extend({
    getTemplate: function () {
      return _.template('<a class="item__user" href="#"><%- user %></a> is not follow you anymore');
    }
  });


  App.ItemMessageView = App.ItemView.extend({
    className: getClassName("message"),
    events: {
      "click .item__reply": function () {
        alert("reply to item #" + this.model.id);
      }
    },
    getTemplate: function () {
      return _.template('<span class="pull-right btn item__reply">Reply</span> ' +
        '<div><a class="item__user" href="#"><%- user %></a></div><div><%= text %></div>');
    }
  });


  App.ItemViewFactory = App.Factory(
    function (options) {
      return options.model.get("type");
    },
    {
      "news": App.ItemNewsView,
      "action": App.Factory(
        function (options) {
          return options.model.get("action");
        },
        {
          "like": App.ItemActionLikeView,
          "unfollow": App.ItemActionUnfollowView
        },
        App.ItemActionView
      ),
      "message": App.ItemMessageView
    },
    App.ItemView
  );

}(Backbone));
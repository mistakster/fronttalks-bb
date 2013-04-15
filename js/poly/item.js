(function (Backbone) {

  App.Item = Backbone.Model.extend({
    initialize: function () {
      console.log("initialize for generic item");
    }
  });

  App.ItemNews = App.Item.extend({
    initialize: function () {
      console.log("initialize for news");
    }
  });

  App.ItemAction = App.Item.extend({
    initialize: function () {
      console.log("initialize for action");
    }
  });

  App.ItemMessage = App.Item.extend({
    initialize: function () {
      console.log("initialize for message");
    }
  });


  App.ItemFactory = App.Factory(
    function (attributes) {
      return attributes.type;
    },
    {
      0: App.Item,
      "news": App.ItemNews,
      "action": App.ItemAction,
      "message": App.ItemMessage
    }
  );

}(Backbone));
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



  var F = App.ItemFactory = function () {
    return F.createItem.apply(this, arguments);
  };

  F.createItem = function (attributes, options) {
    var ctor;
    switch (attributes.type) {
      case 'news':
        ctor = App.ItemNews;
        break;
      case 'action':
        ctor = App.ItemAction;
        break;
      case 'message':
        ctor = App.ItemMessage;
        break;
      default:
        ctor = App.Item;
    }
    return new ctor(attributes, options);
  };

}(Backbone));
(function (Backbone) {

  App.Items = Backbone.Collection.extend({
    model: App.ItemFactory
  });

}(Backbone));
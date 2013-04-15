$(function () {

  var data = App.Data();

  var items = new App.Items(data);

  items.forEach(function (model) {
    var view = App.ItemViewFactory.createItemView({
      model: model
    });
    $("#list").append(view.render().$el);
  });



  /*
  items.forEach(function (model) {
    console.log([
      model instanceof App.Item,
      model instanceof App.ItemNews,
      model instanceof App.ItemAction,
      model instanceof App.ItemReply
    ]);
  });
  */



});
$(function () {

  var data = App.Data();

  var items = new App.Items(data);

  items.forEach(function (model) {
    var view = App.ItemViewFactory.createItemView({
      model: model
    });
    $("#list").append(view.render().$el);
  });

});
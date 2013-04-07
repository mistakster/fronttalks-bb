$(function () {

  var data = JSON.parse(localStorage.getItem("files"));
  data = _.isArray(data) ? data : [];

  var files = new App.Files(data);

  new App.FilesView({
    collection: files,
    root: $("#panel-left")
  });

  var renameRegion = new App.RenameRegion({
    el: "#panel-right"
  });

  var renameModel;

  files.on("activate", function (model) {

    if (renameModel && model.id == renameModel.id) {
      return;
    }

    renameModel = new Backbone.Model(_.clone(model.attributes));

    renameModel.on("change", function (model) {
      files.get(model.id).set(model.attributes).deactivate();
    });

    renameRegion.show(
      new App.RenameView({
        model: renameModel
      })
    );
  });


  $("#refresh-files").on("click", function () {
    var data = files.toJSON();
    var maxId = 0;
    if (data.length) {
      maxId = _.chain(data).map(function (file) {
        return file.id;
      }).max().value();
    }
    for (var i = 0; i < Math.random() * 3; i++) {
      var id = i + maxId + 1;
      data.push({
        id: id,
        name: "File " + id
      });
    }
    files.reset(data);
    localStorage.setItem("files", JSON.stringify(data));
  });

  $("#clear-files").on("click", function () {
    localStorage.removeItem("files");
    files.reset();
  });

});
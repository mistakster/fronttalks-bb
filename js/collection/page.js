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
      files.get(model.id).set(model.attributes);
    });

    renameModel.on("kill", function (model) {
      files.get(model.id).deactivate();
      renameModel = null;
    });

    renameRegion.show(
      new App.RenameView({
        model: renameModel
      })
    );
  });

  // init data helpers
  App.Data(files);

});
if (!localStorage.getItem("files")) {
  localStorage.setItem("files", JSON.stringify([
    {"id": 1, "name": "File 1"},
    {"id": 2, "name": "File 2"},
    {"id": 2, "name": "File 2"},
    {"id": 3, "name": "File 3"},
    {"id": 4, "name": "File 4"},
    {"id": 5, "name": "File 5"},
    {"id": 6, "name": "File 6"}
  ]));
}
var App = {};

App.Data = function (files) {

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

};

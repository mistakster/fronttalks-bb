/**
 * User: mista_k
 * Date: 05.04.13
 * Time: 11:06
 */

module("simple model", {});

test("should not have", function () {

  var model = new Backbone.Model({
    "date": new Date("2013/04/05 11:11:00 +06:00"),
    "air.temperature": 5.1,
    "air.humidity": 41,
    "air.pressure": 750
  });

  ok(!model.get("air"), "there is no air attribute");

});

test("they are store it as plain object", function () {

  var model = new Backbone.Model({
    "date": new Date("2013/04/05 11:11:00 +06:00"),
    "air": {
      "temperature": 5.1,
      "humidity": 41,
      "pressure": 750
    }
  });

  ok(model.get("air"), "model has air attribute");
  ok(!model.get("air.temperature"), "model hasn't air temperature attribute");

  deepEqual(model.get("air"), {
    "temperature": 5.1,
    "humidity": 41,
    "pressure": 750
  }, "just a plain object");

});


module("deep model", {});

test("deep model has a nested attributes", function () {

  var model = new Backbone.DeepModel({
    "date": new Date("2013/04/05 11:11:00 +06:00"),
    "air.temperature": 5.1,
    "air.humidity": 41,
    "air.pressure": 750
  });

  ok(model.get("air"), "model has an air attribute");
  ok(model.get("air.temperature"), "model has an air temperature attribute");

  deepEqual(model.get("air"), {
    "temperature": 5.1,
    "humidity": 41,
    "pressure": 750
  }, "and it still a plain object");

});

asyncTest("emit correct events", 13, function () {

  var model = new Backbone.DeepModel({
    "date": new Date("2013/04/05 11:11:00 +06:00"),
    "air.temperature": 5.1
  });

  function testTimer(dfd) {
    setTimeout(dfd.reject, 1000);
  }

  var wildcardFixtures = [
    [
      {
        "humidity": 41,
        "temperature": 5.1
      },
      "first update"
    ],
    [
      {
        "humidity": 41,
        "pressure": 750,
        "temperature": 5.1
      },
      "second update"
    ],
    [
      {
        "wind": {
          "angle": 90,
          "velocity": 10
        }
      },
      "third update"
    ]
  ];

  var allEvents = [
    "change:air.humidity",
    "change:air.*",
    "change",
    "change:air.pressure",
    "change:air.*",
    "change",
    "change:air",
    "change"
  ];


  model.on("all", function (eventName) {
    equal(eventName, allEvents.shift(), "even: '" + eventName + "'");
  });

  $.when(
    $.Deferred(function (resolver) {
      testTimer(resolver);
      model.on("change:air.*", function (obj, value) {
        var fixture = wildcardFixtures.shift();
        deepEqual(value, fixture[0], fixture[1]);
        this.resolve();
      }, resolver);
    }),
    $.Deferred(function (resolver) {
      testTimer(resolver);
      model.on("change:air.humidity", function (obj, value) {
        ok(value, 41, "air humidity attribute");
        this.resolve();
      }, resolver);
    }),
    $.Deferred(function (resolver) {
      testTimer(resolver);
      model.on("change:air.pressure", function (obj, value) {
        ok(value, 750, "air pressure attribute");
        this.resolve();
      }, resolver);
    }),
    $.Deferred(function (resolver) {
      testTimer(resolver);
      model.on("change:air", function (obj, value) {
        deepEqual(value, {}, "empty object");
        this.resolve();
      }, resolver);
    })
  ).then(start, start);

  model.set("air.humidity", 41);

  model.set("air", {
    "pressure": 750
  });

  model.set("air", {});

});
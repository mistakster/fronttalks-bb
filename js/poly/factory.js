(function () {

  /**
   * Factory of polymorphic classes
   * @param getter
   * @param hash
   * @returns {Function}
   * @constructor
   */
  App.Factory = function (getter, hash) {

    return function () {
      var value = getter.apply(this, arguments);
      var ctor = value && hash[value] ? hash[value] : hash[0];
      return new ctor(arguments[0], arguments[1]);
    };

  };

}());
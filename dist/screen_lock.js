(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.screenLock = mod.exports;
  }
})(this, function () {
  "use strict";

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var ScreenLock = function () {
    //原点半径
    function ScreenLock() {
      _classCallCheck(this, ScreenLock);

      this.radius = 30;
      this.padding = 20;
      this.screenWidth = document.body.offsetWidth;
      this.ninePoint = [];
      this.selectedPoint = [];
      this.defaultColor = "#92ca02";

      this.init();
    } //边距


    _createClass(ScreenLock, [{
      key: "init",
      value: function init() {
        var canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext("2d");

        this.getRatio();
        this.ctx.scale(this.ratio, this.ratio);
        this.ctx.translate(0.5, 0.5);

        canvas.width = canvas.height = this.screenWidth * this.ratio;
        this.canvas = canvas;

        this.caculateNinePoint();
        this.drawPoint();
        this.selectedPoint = [];
      }
    }, {
      key: "getRatio",
      value: function getRatio() {
        var ctx = this.ctx;
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        this.ratio = devicePixelRatio / backingStoreRatio;
      }
    }, {
      key: "cavulateOverPoint",
      value: function cavulateOverPoint(point) {
        for (var i = 0, len = this.ninePoint.length; i < len; i++) {
          var item = this.ninePoint[i];
          var _x = Math.abs(item.x - point.pageX * this.ratio);
          var _y = Math.abs(item.y - point.pageY * this.ratio);
          var _z = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));

          if (_z <= this.radius && !this.selectedPoint.includes(item)) {
            this.selectedPoint.push(item);
            break;
          }
        }
      }
    }, {
      key: "drawLine",
      value: function drawLine() {
        var data = this.selectedPoint;
        var ctx = this.ctx;
        if (!data.length) {
          return;
        }
        ctx.beginPath();
        ctx.strokeStyle = this.defaultColor;
        ctx.lineWidth = 10 * this.ratio;
        this.selectedPoint.map(function (item) {
          ctx.lineTo(item.x, item.y);
        });
        ctx.stroke();
        ctx.closePath();
      }
    }, {
      key: "drawSelectPoint",
      value: function drawSelectPoint() {
        var _this = this;

        var data = this.selectedPoint;
        var ctx = this.ctx;
        if (!data.length) {
          return;
        }
        data.map(function (item) {
          _this.drawCircle(ctx, _this.defaultColor, item, _this.radius);
          _this.drawCircle(ctx, '#fff', item, _this.radius - 2);
          _this.drawCircle(ctx, _this.defaultColor, item, _this.radius - 16);
        });
      }
    }, {
      key: "drawCircle",
      value: function drawCircle(ctx, color, item, radius) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, radius * this.ratio, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
    }, {
      key: "drawPoint",
      value: function drawPoint() {
        var _this2 = this;

        var ctx = this.ctx;
        this.ninePoint.map(function (item, k) {
          _this2.drawCircle(ctx, '#ccc', item, _this2.radius);
          _this2.drawCircle(ctx, '#fff', item, _this2.radius - 3);
          // this.drawSelectPoint(k, item)
        });
      }
    }, {
      key: "caculateNinePoint",
      value: function caculateNinePoint() {
        var arr = [];
        var space = (this.screenWidth - this.radius * 2 * 3 - this.padding * 2) * this.ratio / 2;
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            arr.push({
              x: this.padding * this.ratio + (i * 2 + 1) * this.radius * this.ratio + space * i,
              y: this.padding * this.ratio + (j * 2 + 1) * this.radius * this.ratio + space * j
            });
          }
        }
        this.ninePoint = arr;
      }
    }]);

    return ScreenLock;
  }();

  var screen_lock = new ScreenLock();

  screen_lock.canvas.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    screen_lock.cavulateOverPoint(touch);
  }, false);
  screen_lock.canvas.addEventListener('touchmove', function (e) {
    e.stopPropagation();
    var touch = e.touches[0];
    screen_lock.cavulateOverPoint(touch);
    screen_lock.drawLine();
    screen_lock.drawSelectPoint();
  }, false);
  screen_lock.canvas.addEventListener('touchend', function (e) {
    console.log(screen_lock.selectedPoint);
    screen_lock.init();
  }, false);
});
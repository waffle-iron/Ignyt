(function(){
  var __, this$ = this;
  __ = function(factory){
    'use strict';
    var moduleValue, g, old;
    if (typeof module === 'object' && typeof module.exports === 'object') {
      moduleValue = factory(require, exports);
      if (moduleValue !== void 8) {
        return module.exports = moduleValue;
      }
    } else if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else if (window !== void 8 || self !== void 8) {
      g = window !== void 8 ? window : self;
      old = g.Ignyt;
      g.Ignyt = factory();
      return g.Ignyt.noConflict = function(){
        g.Ignyt = old;
        return this;
      };
    } else {
      throw new Error("Unexpected environment. Please submit a bug report");
    }
  };
  __(function(){
    var Util, Ignyt;
    Util = (function(){
      Util.displayName = 'Util';
      var prototype = Util.prototype, constructor = Util;
      function Util(){
        throw Error('unimplemented');
      }
      Util.padZero = function(num){
        if (10 > num) {
          return "0" + num;
        } else {
          return num;
        }
      };
      Util.parseDate = function(date){
        var e;
        if (!(date instanceof Date)) {
          if (typeof date === 'number') {
            return date = new Date(date);
          } else if (typeof date === 'string') {
            try {
              return date = new Date(date);
            } catch (e$) {
              e = e$;
              throw new Error("Cannot convert type " + typeof date + " to a Date instance.");
            }
          } else {
            throw new Error("Cannot convert type " + typeof date + " to a Date instance.");
          }
        }
      };
      return Util;
    }());
    return Ignyt = (function(){
      Ignyt.displayName = 'Ignyt';
      var prototype = Ignyt.prototype, constructor = Ignyt;
      function Ignyt(date, onInterval, interval){
        var this$ = this instanceof ctor$ ? this : new ctor$;
        if (2 > arguments.length) {
          throw new Error("No overload of Ignyt accepts fewer than 2 arguments.");
        }
        date = Util.parseDate(date);
        if (typeof onInterval !== 'function') {
          throw new Error("Expected 'onInterval' to be a function. " + typeof onInterval + " given.");
        }
        if (typeof interval !== 'number') {
          interval = parseFloat(interval + "");
          if (typeof interval !== 'number') {
            interval = 1e3;
          }
        }
        this$._date = date;
        this$._onInterval = onInterval;
        this$._interval = interval;
        this$._util = Util;
        this$._clock = void 8;
        this$.start();
        return this$;
      } function ctor$(){} ctor$.prototype = prototype;
      Object.defineProperty(Ignyt.prototype, 'onInterval', {
        get: function(){
          return this._onInterval;
        },
        set: function(onInterval){
          if (typeof onInterval !== 'function') {
            throw new Error("Expected 'onInterval' to be a function. " + typeof onInterval + " given.");
          }
          this._onInterval = onInterval;
        },
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(Ignyt.prototype, 'date', {
        get: function(){
          return this._date;
        },
        set: function(date){
          if (date !== void 8) {
            this._date = this.util.parseDate(date);
          }
        },
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(Ignyt.prototype, 'interval', {
        get: function(){
          return this._interval;
        },
        set: function(interval){
          if (typeof interval !== 'number') {
            interval = parseFloat(interval + "");
            if (typeof interval !== 'number') {
              interval = 1e3;
            }
          }
          this._interval = interval;
          this.restart();
        },
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(Ignyt.prototype, 'util', {
        get: function(){
          return this._util;
        },
        configurable: true,
        enumerable: true
      });
      Object.defineProperty(Ignyt.prototype, 'running', {
        get: function(){
          return !!this._clock;
        },
        configurable: true,
        enumerable: true
      });
      Ignyt.prototype._calc = function(){
        var milliseconds, dir, days, hours, minutes, seconds;
        milliseconds = this.date - +new Date;
        dir = milliseconds < 0 ? 'up' : 'down';
        days = Math.abs(parseInt(milliseconds / 864e5 + "", 10));
        milliseconds %= 864e5;
        hours = Math.abs(parseInt(milliseconds / 36e5 + "", 10));
        milliseconds %= 36e5;
        minutes = Math.abs(parseInt(milliseconds / 6e4 + "", 10));
        milliseconds %= 6e4;
        seconds = Math.abs(parseInt(milliseconds / 1e3 + "", 10));
        milliseconds = Math.abs(parseInt(milliseconds % 1e3 + "", 10));
        return {
          dir: dir,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          milliseconds: milliseconds
        };
      };
      Ignyt.prototype.toggle = function(){
        if (this.running) {
          return this.pause();
        } else {
          return this.start();
        }
      };
      Ignyt.prototype.restart = function(){
        this.pause();
        return this.start();
      };
      Ignyt.prototype.pause = function(){
        return this._clock = clearInterval(this._clock);
      };
      Ignyt.prototype.start = function(){
        var this$ = this;
        return this._clock = setInterval(function(){
          return this$.onInterval.call(this$, this$._calc.call(this$));
        }, this.interval);
      };
      Ignyt.init = constructor;
      return Ignyt;
    }());
  });
}).call(this);

(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = (function () {
        function Util() {
        }
        Util.padZero = function (num) {
            return 10 > num ? '0' + num : num;
        };
        Util.parseDate = function (date) {
            if (!(date instanceof Date)) {
                if (typeof date === 'number') {
                    date = new Date(date);
                }
                else if (typeof date === 'string') {
                    try {
                        date = new Date(date);
                    }
                    catch (e) {
                        throw new Error("Cannot convert string \"" + date + "\" to a date instance.");
                    }
                }
                else {
                    throw new Error("Cannot convert type \"" + (typeof date) + "\" to a date instance.");
                }
            }
            return date;
        };
        return Util;
    }());
    return (function () {
        function Ignyt(date, callback, interval) {
            if (interval === void 0) { interval = 1000; }
            if (2 > arguments.length)
                throw new Error('No overload of Ignyt accepts fewer than 2 arguments.');
            date = Util.parseDate(date);
            if (typeof callback !== 'function') {
                throw new Error("Expected \"callback\" to be a function, \"" + (typeof callback) + "\" given.");
            }
            if (typeof interval !== 'number') {
                interval = parseFloat("" + interval);
                if (typeof interval !== 'number') {
                    interval = 1000;
                }
            }
            this._date = +date;
            this._callback = callback;
            this._interval = interval;
            this._util = Util;
            this.start();
        }
        Object.defineProperty(Ignyt.prototype, "callback", {
            get: function () {
                return this._callback;
            },
            set: function (callback) {
                if (typeof callback !== 'function') {
                    throw new Error("Expected \"callback\" to be a function, \"" + (typeof callback) + "\" given.");
                }
                this._callback = callback;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ignyt.prototype, "date", {
            get: function () {
                return this._date;
            },
            set: function (date) {
                if (date !== void 0) {
                    this._date = Util.parseDate(date);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ignyt.prototype, "interval", {
            get: function () {
                return this._interval;
            },
            set: function (interval) {
                if (typeof interval !== 'number') {
                    interval = parseFloat("" + interval);
                    if (typeof interval !== 'number') {
                        interval = 1000;
                    }
                }
                this._interval = interval;
                this.restart();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ignyt.prototype, "util", {
            get: function () {
                return this._util;
            },
            enumerable: true,
            configurable: true
        });
        Ignyt.prototype._calc = function () {
            var milliseconds, seconds, minutes, hours, days;
            milliseconds = (this.date - (+new Date));
            days = parseInt("" + (milliseconds / 86400000), 10);
            milliseconds %= 86400000;
            hours = parseInt("" + (milliseconds / 3600000), 10);
            milliseconds %= 3600000;
            minutes = parseInt("" + (milliseconds / 60000), 10);
            milliseconds %= 60000;
            seconds = parseInt("" + (milliseconds / 1000), 10);
            milliseconds = parseInt("" + (milliseconds % 1000), 10);
            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
                milliseconds: milliseconds
            };
        };
        Object.defineProperty(Ignyt.prototype, "isRunning", {
            get: function () {
                return this._clock > 0;
            },
            enumerable: true,
            configurable: true
        });
        Ignyt.prototype.toggle = function () {
            return this.isRunning ? this.pause() : this.start();
        };
        Ignyt.prototype.restart = function () {
            this.pause();
            this.start();
        };
        Ignyt.prototype.pause = function () {
            clearInterval(this._clock);
            this._clock = 0;
        };
        Ignyt.prototype.start = function () {
            return this._clock = setInterval(function (callback, calc, self) {
                return callback.call(self, calc.call(self));
            }, this._interval, this._callback, this._calc, this);
        };
        Ignyt.init = function (date, callback, interval) {
            if (interval === void 0) { interval = 1000; }
            return new Ignyt(date, callback, interval);
        };
        return Ignyt;
    }());
});

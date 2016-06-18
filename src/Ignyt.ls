__ = (factory)~>
    'use strict';
    #   CommonJS
    if typeof module is 'object' and typeof module.exports is 'object'
        module-value = factory require, exports
        if module-value isnt void
            module.exports = module-value
    #   AMD
    else if typeof define is 'function' and define.amd
        define factory
    # <script>
    else if window isnt void or self isnt void
        g = if window isnt void then window else self
        old = g.Ignyt
        g.Ignyt = factory!
        g.Ignyt.no-conflict = ->
            g.Ignyt = old
            @
    else
        throw new Error "Unexpected environment. Please submit a bug report"
__ ->
    class Util
        @pad-zero = (num)->
            if 10 > num then "0#{num}" else num
        @parse-date = (date)->
            if date not instanceof Date
                if typeof date is 'number'
                    date = new Date date
                else if typeof date is 'string'
                    try
                        date = new Date date
                    catch {message}
                        throw new Error "Cannot convert type #{typeof date} to a Date instance. #{message}"
                else
                    throw new Error "Cannot convert type #{typeof date} to a Date instance."
    class Ignyt
        (date, on-interval, interval)~>
            if 2 > arguments.length
                throw new Error "No overload of Ignyt accepts fewer than 2 arguments."
            date = Util.parse-date date
            if typeof on-interval isnt 'function'
                throw new Error "Expected 'onInterval' to be a function. #{typeof on-interval} given."
            if typeof interval isnt 'number'
                interval = parse-float "#{interval}"
                if typeof interval isnt 'number'
                    interval = 1e3
            @_date = date
            @_on-interval = on-interval
            @_interval = interval
            @_util = Util
            @_clock = void
            @start!
        on-interval:~
            -> @_on-interval
            (on-interval)->
                if typeof on-interval isnt 'function'
                    throw new Error "Expected 'onInterval' to be a function. #{typeof on-interval} given."
                @_on-interval = on-interval
        date:~
            -> @_date
            (date)->
                if date isnt void
                    @_date = @util.parse-date date
        interval:~
            -> @_interval
            (interval)->
                if typeof interval isnt 'number'
                    interval = parse-float "#{interval}"
                    if typeof interval isnt 'number'
                        interval = 1e3
                @_interval = interval
                @restart!
        util:~
            -> @_util
        running:~
            -> !!@_clock
        _calc: ->
            milliseconds = @date - +new Date
            dir = if milliseconds < 0 then 'up' else 'down'
            days = Math.abs parse-int "#{milliseconds/864e5}", 10
            milliseconds %= 864e5
            hours = Math.abs parse-int "#{milliseconds/36e5}", 10
            milliseconds %= 36e5
            minutes = Math.abs parse-int "#{milliseconds/6e4}", 10
            milliseconds %= 6e4
            seconds = Math.abs parse-int "#{milliseconds/1e3}", 10
            milliseconds = Math.abs parse-int "#{milliseconds%1e3}", 10
            {dir, days, hours, minutes, seconds, milliseconds}
                
        toggle: ->
            if @running then @pause! else @start!
        restart: ->
            @pause!
            @start!
        pause: ->
            @_clock = clear-interval @_clock
        start: ->
            @_clock = set-interval ~> 
                @on-interval.call @, @_calc.call @
            , @interval
        @init = @@
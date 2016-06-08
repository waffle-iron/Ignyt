class Util{
    static padZero(num:number){
        return 10 > num? '0' + num : num;
    }
    static parseDate(date:any){
        if(!(date instanceof Date)){
            if(typeof date === 'number'){
                date = new Date(date);  
            } else if(typeof date === 'string'){
                try{
                    date = new Date(date);
                } catch(e){
                    throw new Error(`Cannot convert string "${date}" to a date instance.`);
                }
            } else {
                throw new Error(`Cannot convert type "${(typeof date)}" to a date instance.`);
            }
        }
        return date;
    }
}
export = class Ignyt{
    protected _date:number;
    protected _callback:Function;
    protected _interval:number;
    protected _util:Util;
    protected _clock:number;
    constructor(date:any, callback:Function, interval:number = 1000){
        if(2 > arguments.length ) throw new Error('No overload of Ignyt accepts fewer than 2 arguments.');
        date = Util.parseDate(date);
        if(typeof callback !== 'function'){
            throw new Error(`Expected "callback" to be a function, "${(typeof callback)}" given.`);
        }
        if(typeof interval !== 'number'){
            interval = parseFloat("" + interval);
            if(typeof interval !== 'number'){
                interval = 1000;
            }
        }
        
        this._date = + date;
        this._callback = callback;
        this._interval = interval;
        this._util = Util;
        this.start();
    }
    get callback():Function{
        return this._callback;
    }
    set callback(callback:Function){
        if(typeof callback !== 'function'){
            throw new Error(`Expected "callback" to be a function, "${(typeof callback)}" given.`);
        }
        this._callback = callback;
    }
    get date():any{
        return this._date;
    }
    set date(date:any){
        if(date !== void 0){
            this._date = Util.parseDate(date);
        }
    }
    get interval():number{
        return this._interval;
    }
    set interval(interval:number){
        if(typeof interval !== 'number'){
            interval = parseFloat("" + interval);
            if(typeof interval !== 'number'){
                interval = 1000;
            }
        }
        this._interval = interval;
        this.restart();
    }
    get util(){
        return this._util;
    }
    protected _calc(){
        let milliseconds:number, seconds:number, minutes:number, hours:number, days:number;
        milliseconds = (this.date - (+new Date));
        days = parseInt("" + (milliseconds / 86400000), 10);
        milliseconds %= 86400000;
        hours = parseInt("" + (milliseconds / 3600000), 10);
        milliseconds %= 3600000;
        minutes = parseInt("" + (milliseconds / 60000), 10);
        milliseconds %= 60000
        seconds = parseInt("" + (milliseconds / 1000), 10);
        milliseconds = parseInt("" + (milliseconds % 1000), 10);
        return {
            days: days, 
            hours: hours, 
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds
        };
    }
    get isRunning(){
        return this._clock > 0;
    }
    
    toggle(){
        return this.isRunning ? this.pause() : this.start();
    }
    restart(){
        this.pause();
        this.start();
    }
    pause(){
        clearInterval(this._clock);
        this._clock = 0;
    }
    start(){
        return this._clock = setInterval((callback, calc, self)=>{
            return callback.call(self, calc.call(self));
        }, this._interval, this._callback, this._calc, this);
    }
    static init(date:any, callback:Function, interval:number = 1000){
        return new Ignyt(date, callback, interval);
    }
}
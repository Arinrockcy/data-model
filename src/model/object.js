class Objetcs{
    constructor(value, oldvalue){
        this.value = value;
        this.oldvalue = oldvalue;
    }
    set value(value){
        this._value = value;
    }
    set oldvalue(oldvalue){
        this._oldvalue = typeof oldvalue !== 'undefined' ? oldvalue : null;
    }
    get value(){
        return this._value;
    }
    get oldvalue(){
        return this._oldvalue;
    }
}
export default Objetcs;
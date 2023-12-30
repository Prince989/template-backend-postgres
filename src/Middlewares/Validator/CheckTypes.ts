export class CheckType{
    Message : string
    Name : string
    constructor(message : string,name : string){
        this.Name = name;
        this.Message = message;
    }
}

export class MinCheck extends CheckType{
    Min : number
    constructor(min : number){
        const message = `The {{field}} length, should be more than ${min}`
        const name = "MinCheck"
        super(message,name);
        this.Min = min;
    }
}

export class MaxCheck extends CheckType{
    Max : number
    constructor(max : number){
        const message = `The {{field}} length, should be less than ${max}`
        const name = "MaxCheck"
        super(message,name);
        this.Max = max;
    }
}

export class RangeCheck extends CheckType{
    Max : number
    Min : number

    constructor(min : number , max : number){
        const message = `The {{field}} length, should be more than ${min} and less than ${max}`
        const name = "RangeCheck"
        super(message,name);
        this.Max = max;
        this.Min = min;
    }
}

export class RequiredCheck extends CheckType{
    constructor(){
        const name = "RequiredCheck"
        const message = `The {{field}} is required`
        super(message,name)
    }
}

export class EmailCheck extends CheckType{
    constructor(){
        const name = "EmailCheck"
        const message = `Invalid Email Format`
        super(message,name)
    }
}

export class EmptyCheck extends CheckType{
    constructor(){
        const name = "EmptyCheck"
        const message = "The {{field}} cannot be empty"
        super(message,name)
    }
}

export class NumberCheck extends CheckType{
    constructor(){
        const name = "NumberCheck"
        const message = "The {{field}} should be number"
        super(message,name)
    }
}
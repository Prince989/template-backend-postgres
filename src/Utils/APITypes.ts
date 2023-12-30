import { CheckType } from "../Middlewares/Validator/CheckTypes"

export enum APIMethod{
    get,
    post,
    put,
    delete
}

export enum PayloadType{
    body,
    params,
    query
}

export interface Field{
    name : string
    checks : CheckType[]
    payload : PayloadType
}


interface Problem{
    [key : string] : string[]
}

export interface APIResponse {
    problem : Problem
    message : string
    data : any
}

export class API{
    Path : string
    Fields : Field[]
    Method : APIMethod
    Permissions : string[]
    Controller : any

    constructor(path : string,fields : Field[],method : APIMethod,permissions : string [],controller : any){
        this.Path = path
        this.Fields = fields
        this.Method = method
        this.Permissions = permissions
        this.Controller = controller
    }
}

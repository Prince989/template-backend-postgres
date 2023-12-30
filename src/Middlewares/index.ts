import { API } from "../Utils/APITypes";
import PermissionCheck from "./PermissionChecker";
import Validate, { CheckErrors } from "./Validator/Validator";

const middlewares : Array<Function> = [
    Validate,
    CheckErrors,
    PermissionCheck
]

export function getMiddlewares (route : API) : Array<Function> {
    let tempMiddlewares : Array<Function> = [] ;

    for(let mid of middlewares){
        tempMiddlewares.push(mid(route));
    }

    return tempMiddlewares;
}

export default getMiddlewares;
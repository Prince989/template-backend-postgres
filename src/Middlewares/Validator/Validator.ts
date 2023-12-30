import { NextFunction, Request, Response } from "express";
import { API } from "../../Utils/APITypes";
import { EmptyCheck, MaxCheck, MinCheck, NumberCheck, RangeCheck, RequiredCheck } from "./CheckTypes";
import { check, validationResult, CustomValidator } from "express-validator"
import { APIResponse } from "../../Utils/APITypes";

export default function Validate(api: API) {
    let returningChecks = [];
    for (let field of api?.Fields) {
        for (let checkItem of field?.checks) {
            let checkParam = check(field.name);
            switch (checkItem.Name) {
                case "RequiredCheck":
                    let requiredCheck = checkItem as RequiredCheck;
                    checkParam.exists().withMessage(requiredCheck.Message.replace("{{field}}", field.name))
                    break;
                case "EmailCheck":
                    checkParam = checkParam.isEmail().withMessage(checkItem.Message);
                    break;
                case "MaxCheck":
                    let maxCheck = checkItem as MaxCheck;
                    checkParam.isLength({ max: maxCheck.Max }).withMessage(maxCheck.Message.replace("{{field}}", field.name))
                    break;
                case "MinCheck":
                    let minCheck = checkItem as MinCheck;
                    checkParam.isLength({ min: minCheck.Min }).withMessage(minCheck.Message.replace("{{field}}", field.name))
                    break;
                case "RangeCheck":
                    let rangeCheck = checkItem as RangeCheck;
                    checkParam.isLength({ min: rangeCheck.Min }).withMessage(rangeCheck.Message.replace("{{field}}", field.name))
                    break;
                case "EmptyCheck":
                    let emptyCheck = checkItem as EmptyCheck;
                    checkParam.trim().notEmpty().custom(isEmptyWithTrim).withMessage(emptyCheck.Message.replace("{{field}}", field.name))
                    break;
                case "NumberCheck":
                    let numberCheck = checkItem as NumberCheck;
                    checkParam.trim().optional().isNumeric().withMessage(numberCheck.Message.replace("{{field}}", field.name));
            }
            returningChecks.push(checkParam);
        }
    }
    return returningChecks;
}

export function CheckErrors(api: API) {
    return function (req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const result = optimizeError(errors.array());
        if (!errors.isEmpty()) {
            return res.status(400).json( result );
        }
        return next();
    }
}

function optimizeError(errors: any[]) {
    const result = errors.reduce((acc, d) => {
        const found = acc.find((a: any) => a.param === d.param);
        const value = { msg: d.msg, param: d.param };
        if (!found) {
            acc.push({ param: d.param, msg: d.msg });
        }
        return acc;
    }, []);
    const res: APIResponse = {
        problem: {},
        message: "Validation error",
        data: []
    }
    let problems = {}
    // @ts-ignore
    result.forEach(item => {
        // @ts-ignore
        problems[item.param] = [item.msg];
    })
    res.problem = problems;
    return res;
}

const isEmptyWithTrim: CustomValidator = (value: any) => {
    if (value.trim() === "") {
        return Promise.reject("It is Empty");
    }
    else {
        return Promise.resolve();
    }
}
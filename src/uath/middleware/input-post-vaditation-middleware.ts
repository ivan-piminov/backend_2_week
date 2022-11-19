import {Response, Request, NextFunction} from "express";
import {customValidationResult} from "../../helpers/custom-validation-result";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ message: string, field: string }> = customValidationResult(req).array();
    if (errors.length) {
        return res.status(400).send({errorsMessages: errors});
    }
    return next()
}

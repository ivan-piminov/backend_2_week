import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../helpers/HTTP-statuses";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    return req.headers.authorization === 'Basic YWRtaW46cXdlcnR5'
        ? next()
        : res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
}

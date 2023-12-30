import { EmailCheck, EmptyCheck, MinCheck, NumberCheck, RequiredCheck } from "../Middlewares/Validator/CheckTypes";
import { API, APIMethod, PayloadType } from "../Utils/APITypes";

import {
    sign_up,
    login,
    sendForgotVerificationCode,
    validateEmail,
    resetPassword
} from "../Controller/AuthController";

const routes: Array<API> = [


    /*     new API("/cat/store", [
            {
                name: "name",
                checks: [
                    new RequiredCheck(),
                    new EmptyCheck(),
                ],
                payload: PayloadType.body
            },
        ], APIMethod.post, ["store_category"], storeCategory), */

    // Authentications

  /**
   * @openapi
   * '/api/sign_up':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      400:
   *        description: Bad request
   */

    new API("/sign_up", [
        {
            name: "email",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
                new EmailCheck()
            ],
            payload: PayloadType.body
        },
        {
            name: "password",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
                new MinCheck(8)
            ],
            payload: PayloadType.body
        },
        {
            name: "confirmation_password",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
            ],
            payload: PayloadType.body
        },
        {
            name: "username",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
            ],
            payload: PayloadType.body
        },
        {
            name: "name",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
            ],
            payload: PayloadType.body
        },
    ], APIMethod.post, [], sign_up),

    new API("/login", [
        {
            name: "username",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
            ],
            payload: PayloadType.body
        },
        {
            name: "password",
            checks: [
                new RequiredCheck(),
                new EmptyCheck(),
            ],
            payload: PayloadType.body
        }
    ], APIMethod.post, [], login),

    new API("/send/verify", [
        {
            name: "email",
            checks: [
                new RequiredCheck(),
                new EmailCheck()
            ],
            payload: PayloadType.body
        }
    ], APIMethod.post, [], sendForgotVerificationCode),

    new API("/user/validate", [
        {
            name: "token",
            checks: [
                new RequiredCheck(),
                new EmptyCheck()
            ],
            payload: PayloadType.body
        }
    ], APIMethod.post, [], validateEmail),

    new API("/user/reset/pass", [
        {
            name: "password",
            checks: [
                new RequiredCheck(),
                new EmptyCheck()
            ],
            payload: PayloadType.body
        },
        {
            name: "token",
            checks: [
                new RequiredCheck(),
                new EmptyCheck()
            ],
            payload: PayloadType.body
        }
    ], APIMethod.post, [], resetPassword),
]

export default routes;
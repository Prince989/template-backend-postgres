/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - username
 *        - confirmation_password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        username:
 *          type: string
 *          default: JaneDoe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        confirmation_password:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        problem:
 *          type: object
 *        message:
 *          type: string
 *        data:
 *          type: object
 */

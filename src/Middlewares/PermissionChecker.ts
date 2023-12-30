import { PrismaClient } from ".prisma/client";
import { NextFunction, Request, Response } from "express";
import { API } from "../Utils/APITypes";
import jwt from 'jsonwebtoken'

export default function PermissionCheck(route: API) {
    return async function (req: Request, res: Response, next: NextFunction) {

        if (route.Permissions.length < 1)
            return next();

        let token = req.headers?.token as string;

        if (token === undefined) {
            return res.status(401).json({
                Message: "Unauthenticated"
            })
        }

        token = token.replace("Bearer ", "");

        const private_key = process.env.PRIVATE_KEY as string;
        try {
            jwt.verify(token, private_key);
        }
        catch (e) {
            return res.status(401).json({
                Message: "Unauthenticated"
            })
        }

        const prisma = new PrismaClient();

        const user = await prisma.user.findFirst({
            where: {
                token: {
                    equals: token
                }
            },
            include: {
                role: {
                    include: {
                        permissionsOnRoles: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        })

        if (user == null){
            prisma.$disconnect();
            return res.status(401).json({
                Message: "Unauthenticated"
            })
        }

        const permissionsOnRoles = user.role?.permissionsOnRoles;

        let userPerms: string[] = []

        if (permissionsOnRoles !== undefined)
            for (let permissionOnRole of permissionsOnRoles) {
                userPerms.push(permissionOnRole.permission.name)
            }

        let found = 0;
        let granted = false;

        for (let perm of route.Permissions) {
            for (let userPerm of userPerms) {
                if (perm == userPerm) {
                    found++;
                    break;
                }
            }
            if (found === route.Permissions.length) {
                granted = true;
                break;
            }
        }


        if (!granted){
            prisma.$disconnect();
            return res.status(403).json({
                Message: "Access Denied"
            })
        }

        res.locals.user = user

        next();
    }
}
import { Prisma } from '.prisma/client'
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { prismaClient } from "../Utils/PrismaClient";
import { APIResponse } from "../Utils/APITypes"
import nodemailer from "nodemailer"
import EmailTemplate from "../Email/EmailTemplate";

const prisma = prismaClient;

type EmailCallback = (err: string, success: any) => void

export const login = async (req: Request, res: Response<APIResponse>) => {
    const body = req.body;

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    email: {
                        equals: body.username
                    }
                },
                {
                    username: {
                        equals: body.username
                    }
                }
            ]
        }
    })

    if (user == null) {
        prisma.$disconnect();
        return res.json({
            problem: {
                username: [
                    "Invalid username"
                ]
            },
            message: "User Not Exists",
            data: []
        })
    }

    const isValidPasword = bcrypt.compareSync(body.password, user.password);

    if (!isValidPasword) {
        prisma.$disconnect();
        return res.json({
            problem: {
                password: [
                    "Invalid password"
                ]
            },
            message: "Wrong Password,Did You Forget Password",
            data: []
        })
    }

    const private_key = process.env.PRIVATE_KEY as string;
    const u = user.username;
    const p = user.password;

    const token = jwt.sign(
        { u, p },
        private_key,
        {
            algorithm: "HS256",
            expiresIn: "2h",
        }
    ) as string;

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            token: token
        }
    })
    prisma.$disconnect();

    return res.json({
        problem: {},
        message: "Welcome",
        data: {
            token: token
        }
    })
}

export const sign_up = async (req: Request, res: Response<APIResponse>) => {
    try {
        if (req.body.confirmation_password !== req.body.password) {
            return res.status(400).json({
                data: [],
                message: "Validation error",
                problem: {
                    confirmation_password: [
                        "Confirmation password doesn't match"
                    ]
                }
            })
        }
        const hashedPass = bcrypt.hashSync(req.body.password, 10);
        const token = generateRandomChars(55);
        const user = await prisma.user.create({
            data: {
                name: req.body?.name,
                email: req.body?.email,
                username: req.body?.username,
                password: hashedPass,
                verificationCode: token
            }
        })
        const id = user.id;

        const email = req.body?.email;

        //@ts-ignore
        sendEmail(user?.name, token, email, 'sign', (err, success) => {
            if (success === null)
                return res.status(500).json({
                    problem: {},
                    message: "Internal server",
                    data: []
                })

            return res.json({
                problem: {},
                message: "Sign up Done!",
                data: {
                    id: id
                }
            })
        });

        prisma.$disconnect();

    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // @ts-ignore
            if (e.code === 'P2002') {
                prisma.$disconnect();
                res.status(409).json({
                    problem: {
                        username: [
                            "Invalid username, Username already exists"
                        ]
                    },
                    message: "User Already Exists, Did you forget your password",
                    data: []
                })
            }
        }
    }
}

export const sendForgotVerificationCode = async (req: Request, res: Response<APIResponse>) => {
    const email = req.body.email;
    const client = prismaClient;

    const user = await client.user.findFirst({
        where: {
            email: email
        }
    });


    if (!user)
        return res.status(400).json({
            problem: {
                email: [
                    "Email not found"
                ]
            },
            message: "Validation error",
            data: []
        })

    const token = generateRandomChars(55);

    const result = await client.user.update({
        where: {
            email: email
        },
        data: {
            verificationCode: token
        }
    })

    if (!result)
        return res.status(500).json({
            problem: {},
            message: "Server Error",
            data: []
        })

    //@ts-ignore
    sendEmail(user?.name, token, email, 'forget', (err, success) => {
        if (success === null)
            return res.status(500).json({
                problem: {},
                message: 'Validation error',
                data: []
            })

        return res.status(200).json();
    });

}

export const validateEmail = async (req: Request, res: Response<APIResponse>) => {
    const token = req.body.token;

    const user = await prismaClient.user.findFirst({
        where: {
            verificationCode: token
        }
    })

    if (!user)
        return res.status(400).json({
            problem: {},
            message: "Invalid Token",
            data: []
        })

    try {
        await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                validate: true,
            }
        })

        return res.status(200).json({
            problem: {},
            message: "Email validated",
            data: []
        });
    }
    catch (e) {
        return res.status(502).json({
            problem: {},
            message: "Internal server error",
            data: []
        })
    }

}

export const resetPassword = async (req: Request, res: Response<APIResponse>) => {
    const token = req.body.token as string;
    const password = req.body.password as string;
    const hashedPass = bcrypt.hashSync(password, 10);

    const user = await prismaClient.user.findFirst({
        where: {
            verificationCode: token
        }
    })

    if (!user) {
        return res.status(400).json({
            problem: {
                token: [
                    "Invalid token"
                ]
            },
            message: "Inavlid Token",
            data: []
        })
    }

    try {
        const result = await prismaClient.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPass,
                verificationCode: ""
            }
        })
        if (!result)
            return res.status(502).json({
                problem: {},
                message: "Something went wrong",
                data: []
            })
        return res.json({
            problem: {},
            message: "Password changed successfully",
            data: []
        })
    }
    catch (e) {
        return res.status(502).json({
            problem: {},
            message: "Internal server error",
            data: []
        })
    }

}

function sendEmail(name: string, token: string, email: string, mode: 'forget' | 'sign', callback: EmailCallback) {
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
        }
    )

    const url = process.env.FORGET_PASSWORD_LINK + "token=" + token;
    const emailTemplate = new EmailTemplate(name, url, mode);
    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: "Verification",
        html: emailTemplate.getHTML()
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return callback(err.message, null);
        }
        callback("", info);
    })
}

function generateRandomChars(number: number) {

    let c = ""
    for (let i = 0; i < number; i++) {

        let temp = Math.floor(Math.random() * 25) + 97;

        c += String.fromCharCode(temp);
    }

    return c;

}
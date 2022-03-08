import { Controller, Post, UseGuards, Res, Req, Get, HttpCode } from "@nestjs/common";
import { RequestWithUser } from "../../global/base/RequestWithUser";
import { LocalAuthGuard } from "../guard/LocalAuthGuard";
import { AuthLogic } from "../providers/AuthLogic";
import { Response } from 'express';
import { UserDetailVM } from "@futbolyamigos/data";
import { Auth } from "../decorators/AuthComposition";

@Controller('auth')
export class AuthController {

    constructor (private authLogic: AuthLogic) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login (@Req() req: RequestWithUser, @Res() response: Response<UserDetailVM>) {
        const { user } = req;
        const cookie = this.authLogic.CreateCookieWithJwtToken(user.Doc._id);
        response.setHeader('Set-Cookie', cookie);
        return response.send({
            _id: user.Doc._id,
            Email: user.Doc.Email,
            RoleID: user.Doc.Role._id,
            Nombre: user.Doc.Nombre,
            Apellidos: user.Doc.Apellidos
        });
    }

    @Auth([])
    @Post('logout')
    async logOut (@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authLogic.DeleteCookieForLogOut());
        return response.sendStatus(200);
    }

    @Auth([])
    @Get()
    @HttpCode(200)
    async authenticate (@Req() request: RequestWithUser, @Res() response: Response<UserDetailVM>) {
        const { user } = request;
        return response.send({
            _id: user.Doc._id,
            Email: user.Doc.Email,
            RoleID: user.Doc.Role._id,
            Nombre: user.Doc.Nombre,
            Apellidos: user.Doc.Apellidos
        })
    }
}
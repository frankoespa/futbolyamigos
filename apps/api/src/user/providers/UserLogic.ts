import { Injectable } from "@nestjs/common";
import { RoleDomain } from "../../role/domain/RoleDomain";
import { Roles } from "@futbolyamigos/data";
import { Role } from "../../role/schema/RoleSchema";
import { DocumentLoaderDomainService } from "../../shared/providers/DocumentLoaderDomainService";
import { UserDomain } from "../domain/UserDomain";
import { UserRepository } from "../repository/UserRepository";
import { User } from "../schema/UserSchema";
import { hash } from 'bcrypt'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserLogic {

    constructor (
        private readonly userRepository: UserRepository,
        private readonly documentLoaderService: DocumentLoaderDomainService,
        private readonly configService: ConfigService) {}

    async FindWithEmail (email: string): Promise<UserDomain> {
        return this.userRepository.FindWithEmail(email);
    }

    async CreateFirstAdmin () {

        const userAdmin = await this.userRepository.FindWithEmail(this.configService.get<string>('ADMIN_EMAIL'));

        if (userAdmin) return;

        const userAdminDomain = this.documentLoaderService.Create<User, UserDomain>(User.name, UserDomain);
        const roleAdmin = await this.documentLoaderService.GetById(Role.name, RoleDomain, Roles.Admin);
        const passwordHashed = await hash(this.configService.get<string>('ADMIN_PASS'), 10);

        userAdminDomain.CreateNew(this.configService.get<string>('ADMIN_EMAIL'), passwordHashed, roleAdmin);

        await userAdminDomain.Save()
    }
}
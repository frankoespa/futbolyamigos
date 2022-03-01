import { compare } from 'bcrypt';
import { DomainBase } from '../../global/base/domain/DomainBase';
import { ValidationException } from '../../global/base/exceptions/ValidationException';
import { RoleDomain } from '../../role/domain/RoleDomain';
import { User } from '../schema/UserSchema';

export class UserDomain extends DomainBase<User> {

    CreateNew (email: string, password: string, role: RoleDomain): void {
        this.doc.Email = email;
        this.doc.Password = password;
        this.doc.Role = role.Doc;
        this.doc.Nombre = 'Admin';
        this.doc.Apellidos = 'Admin';
    }

    async VerifyPassword (password: string): Promise<void> {

        const passwordOK = await compare(
            password,
            this.doc.Password
        );

        if (!passwordOK)
        {
            throw new ValidationException('Credenciales inválidas');
        }
    }
}
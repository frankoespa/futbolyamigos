import { Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../global/base/repository/RepositoryBase';
import { UserDomain } from '../domain/UserDomain';
import { User } from '../schema/UserSchema';

@Injectable()
export class UserRepository extends RepositoryBase<User, UserDomain> {

    constructor (@InjectModel(User.name) userModel: Model<User>) {
        super(userModel, UserDomain);
    }

    async FindWithEmail (email: string): Promise<UserDomain> {
        const doc = await this.model
            .findOne({
                Email: email
            })
            .exec();

        return doc ? new UserDomain(doc) : null;
    }

}
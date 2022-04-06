import { registerDecorator, ValidationOptions, isInt, isMongoId } from 'class-validator';

export function RequiredMongoId (validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'RequiredMongoId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [propertyName],
            options: {
                always: validationOptions?.always,
                context: validationOptions?.context,
                each: validationOptions?.each,
                groups: validationOptions?.groups,
                message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo Mongo Id'
            },
            validator: {
                validate (value: any) {
                    return isMongoId(value);
                }
            }
        });
    };
}

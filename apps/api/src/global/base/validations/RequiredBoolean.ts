import { registerDecorator, ValidationOptions, isInt, isBoolean } from 'class-validator';

export function RequiredBoolean (validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'RequiredBoolean',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [propertyName],
            options: {
                always: validationOptions?.always,
                context: validationOptions?.context,
                each: validationOptions?.each,
                groups: validationOptions?.groups,
                message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo boolean'
            },
            validator: {
                validate (value: any) {
                    return isBoolean(value);
                }
            }
        });
    };
}

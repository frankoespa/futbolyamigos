import { registerDecorator, ValidationOptions, isInt, isBoolean, isDateString } from 'class-validator';

export function RequiredDate (validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: 'RequiredDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [propertyName],
            options: {
                always: validationOptions?.always,
                context: validationOptions?.context,
                each: validationOptions?.each,
                groups: validationOptions?.groups,
                message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo fecha'
            },
            validator: {
                validate (value: any) {
                    return isDateString(value);
                }
            }
        });
    };
}

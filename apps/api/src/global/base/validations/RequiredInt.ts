import { registerDecorator, ValidationOptions, isInt } from 'class-validator';

export function RequiredInt(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string): void {
		registerDecorator({
			name: 'RequiredInt',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [propertyName],
			options: {
				always: validationOptions?.always,
				context: validationOptions?.context,
				each: validationOptions?.each,
				groups: validationOptions?.groups,
				message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo número'
			},
			validator: {
				validate(value: any) {
					return isInt(value);
				}
			}
		});
	};
}

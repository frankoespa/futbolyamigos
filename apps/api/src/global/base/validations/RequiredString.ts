import { registerDecorator, ValidationOptions, ValidationArguments, isString, isNotEmpty } from 'class-validator';

export function RequiredString(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string): void {
		registerDecorator({
			name: 'RequiredString',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				always: validationOptions?.always,
				context: validationOptions?.context,
				each: validationOptions?.each,
				groups: validationOptions?.groups,
				message: validationOptions?.message ?? 'El campo $property debe contener un valor y ser de tipo texto'
			},
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value === 'string') {
						value = value.trim();
						args.object[args.property] = value;
					}
					return isString(value) && isNotEmpty(value);
				}
			}
		});
	};
}

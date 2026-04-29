"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = IsPassword;
const class_validator_1 = require("class-validator");
function IsPassword(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    return value.length >= 8;
                },
                defaultMessage() {
                    return 'Password must be at least 8 characters long';
                },
            },
        });
    };
}
//# sourceMappingURL=is-password.decorator.js.map
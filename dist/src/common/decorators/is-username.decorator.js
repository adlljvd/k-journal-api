"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUsername = IsUsername;
const class_validator_1 = require("class-validator");
function IsUsername(validationOptions) {
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
                    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
                    return usernameRegex.test(value);
                },
                defaultMessage() {
                    return 'Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores';
                },
            },
        });
    };
}
//# sourceMappingURL=is-username.decorator.js.map
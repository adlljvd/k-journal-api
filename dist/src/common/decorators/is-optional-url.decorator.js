"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOptionalUrl = IsOptionalUrl;
const class_validator_1 = require("class-validator");
function IsOptionalUrl(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (value === null || value === undefined || value === '') {
                        return true;
                    }
                    if (typeof value !== 'string') {
                        return false;
                    }
                    try {
                        const url = new URL(value);
                        return url.protocol === 'http:' || url.protocol === 'https:';
                    }
                    catch {
                        return false;
                    }
                },
                defaultMessage() {
                    return 'If provided, must be a valid URL (http or https)';
                },
            },
        });
    };
}
//# sourceMappingURL=is-optional-url.decorator.js.map
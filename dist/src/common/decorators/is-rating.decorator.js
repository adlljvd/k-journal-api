"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsRating = IsRating;
const class_validator_1 = require("class-validator");
function IsRating(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (value === null || value === undefined) {
                        return true;
                    }
                    if (typeof value !== 'number') {
                        return false;
                    }
                    if (value < 0.5 || value > 5.0) {
                        return false;
                    }
                    const scaledValue = value * 2;
                    return Number.isInteger(scaledValue) && scaledValue % 1 === 0;
                },
                defaultMessage() {
                    return 'Rating must be between 0.5 and 5.0 in 0.5 increments';
                },
            },
        });
    };
}
//# sourceMappingURL=is-rating.decorator.js.map
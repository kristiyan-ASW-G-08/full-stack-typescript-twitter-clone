"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const RESTError_1 = require("../utilities/RESTError");
const validationHandler = (validators) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var e_1, _a;
        try {
            try {
                for (var validators_1 = __asyncValues(validators), validators_1_1; validators_1_1 = yield validators_1.next(), !validators_1_1.done;) {
                    const { schema, target } = validators_1_1.value;
                    //@rs-ignore
                    const validationTarget = req[target];
                    yield schema.validate(validationTarget, {
                        abortEarly: false,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (validators_1_1 && !validators_1_1.done && (_a = validators_1.return)) yield _a.call(validators_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            next();
        }
        catch (err) {
            // @ts-ignore
            const validationErrors = err.inner.map(({ path, message }) => ({
                path,
                message,
            }));
            const { status } = RESTError_1.errors.BadRequest;
            res.status(status).json({ data: validationErrors });
        }
    });
};
exports.default = validationHandler;

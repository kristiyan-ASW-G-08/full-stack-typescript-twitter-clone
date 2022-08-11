"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const includesId_1 = __importDefault(require("@utilities/includesId"));
describe('includesId', () => {
    const id = mongoose_1.default.Types.ObjectId();
    const stringId = id.toString();
    const idArr = [
        mongoose_1.default.Types.ObjectId(),
        mongoose_1.default.Types.ObjectId(),
        mongoose_1.default.Types.ObjectId(),
    ];
    it(`should return true if the array includes the objectId`, () => {
        const newIdArr = [...idArr, id];
        expect((0, includesId_1.default)(newIdArr, stringId)).toBeTruthy();
    });
    it(`should return false if the array doesn't include the objectId`, () => {
        const newIdArr = [...idArr];
        expect((0, includesId_1.default)(newIdArr, stringId)).toBeFalsy();
    });
});

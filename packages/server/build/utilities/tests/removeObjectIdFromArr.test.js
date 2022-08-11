"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const removeId_1 = __importDefault(require("@utilities/removeId"));
describe('removeFromArr', () => {
    const id = mongoose_1.default.Types.ObjectId();
    const stringId = id.toString();
    const idArr = [
        mongoose_1.default.Types.ObjectId(),
        mongoose_1.default.Types.ObjectId(),
        mongoose_1.default.Types.ObjectId(),
    ];
    it(`should return true`, () => {
        const newIdArr = [...idArr, id];
        const removedIdArr = (0, removeId_1.default)(newIdArr, stringId);
        expect(removedIdArr).toHaveLength(3);
        expect(removedIdArr).toEqual(idArr);
    });
});

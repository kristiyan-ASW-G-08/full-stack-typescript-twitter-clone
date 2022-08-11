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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const deleteFromCloudinary_1 = __importDefault(require("utilities/deleteFromCloudinary"));
jest.mock('cloudinary');
// @ts-ignore
const cloudinaryMock = cloudinary_1.default;
describe('deleteFromCloudinary', () => {
    it('should call upload', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const filename = 'fileName';
        // @ts-ignore
        (0, deleteFromCloudinary_1.default)(filename);
        // @ts-ignore
        expect(cloudinary_1.default.uploader.destroy).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(cloudinary_1.default.uploader.destroy).toHaveBeenCalledWith(filename);
    }));
});

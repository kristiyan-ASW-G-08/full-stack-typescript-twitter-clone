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
const mock_fs_1 = __importDefault(require("mock-fs"));
const deleteFile_1 = __importDefault(require("utilities/deleteFile"));
describe('deleteFile', () => {
    afterEach(mock_fs_1.default.restore);
    it('should delete a file', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        (0, mock_fs_1.default)({
            '/images': {
                'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
            },
        });
        const path = '/images/test.jpg';
        yield expect((0, deleteFile_1.default)(path)).resolves.toBeUndefined();
    }));
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const removeId = (itemsArr, stringId) => itemsArr.filter((id) => !id.equals(mongoose_1.default.Types.ObjectId(stringId)));
exports.default = removeId;

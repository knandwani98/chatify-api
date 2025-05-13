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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(process === null || process === void 0 ? void 0 : process.env.MONGODB_URI)
            .then(() => {
            console.log(`MongoDB connected successfully`);
        })
            .catch(() => {
            console.log("MongoDB connection failed");
        });
    }
    catch (error) {
        console.log("DB connection failed", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;

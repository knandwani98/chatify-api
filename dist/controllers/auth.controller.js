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
exports.loggedInUser = exports.logout = exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullname, password } = req.body;
        if (!username.trim() || !fullname.trim() || !password.trim()) {
            return res.status(400).send({ message: "All fields are required" });
        }
        if (username.length < 3) {
            return res.status(400).send({
                success: false,
                message: "Username must be at least 3 characters",
            });
        }
        if (password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }
        const existingUser = yield user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already existed",
            });
        }
        const newUser = yield user_model_1.default.create({ username, fullname, password });
        const newUserObj = newUser.toObject();
        delete newUserObj.password;
        return res.status(201).send({
            success: true,
            message: "User created successfully",
            data: newUserObj,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: error || "Internal Server Error",
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isVerified = yield user.verifyPassword(password);
        const newUserObj = user.toObject();
        delete newUserObj.password;
        if (!isVerified) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });
        return res.status(200).json({
            success: true,
            data: newUserObj,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: error || "Internal Server Error",
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || null;
    try {
        if (!token) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            message: "User logout successfully",
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: error || "Internal Server Error",
        });
    }
});
exports.logout = logout;
const loggedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
});
exports.loggedInUser = loggedInUser;

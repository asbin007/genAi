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
const generative_ai_1 = require("@google/generative-ai");
require("dotenv/config");
const API_KEY = process.env.GEMINI_API;
if (!API_KEY) {
    console.error("GEMINI_API environment variable is not set.");
    process.exit(1);
}
const genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
const input = require("prompt-sync")({ sigint: true });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const history = [
            {
                role: "user",
                parts: [{ text: "You are a helpful assistant." }],
            },
            {
                role: "model",
                parts: [{ text: "Okay, I am ready to assist you. What can I do for you?" }],
            },
        ];
        const chat = model.startChat({ history });
        while (true) {
            let userInput = input("You: ");
            if (userInput.toLowerCase() === "exit") {
                console.log("Exiting chat.");
                break;
            }
            if (!userInput.trim()) {
                console.log("Please enter a message.");
                continue;
            }
            try {
                console.log("Thinking...");
                const result = yield chat.sendMessage(userInput);
                const response = yield result.response;
                const text = response.text();
                console.log(`Gemini: ${text}`);
            }
            catch (error) {
                console.error("Error calling Gemini API:", error);
            }
        }
    });
}
main();

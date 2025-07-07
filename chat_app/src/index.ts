import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const API_KEY = process.env.GEMINI_API as string;

if (!API_KEY) {
  console.error("GEMINI_API environment variable is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const input = require("prompt-sync")({ sigint: true });

async function main() {
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
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const text = response.text();
      console.log(`Gemini: ${text}`);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  }
}

main();

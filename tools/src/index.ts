import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API as string;

if (!apiKey) {
  console.error("GEMINI_API environment variable is not set.");
  process.exit(1);
}

const genAi = new GoogleGenerativeAI(apiKey);
const prompt = require("prompt-sync")({ sigint: true });

function getTimeByCountry(country: string): string | null {
  const timezones: Record<string, string> = {
    nepal: "Asia/Kathmandu",
    india: "Asia/Kolkata",
    usa: "America/New_York",
    uk: "Europe/London",
  };

  const tz = timezones[country.toLowerCase()];
  if (!tz) {
    return null;
  }
  const time = new Date().toLocaleString("en-US", {
    timeZone: tz,

    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return `The current time in ${country} is ${time}.`;
}

async function main() {
  const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
  const history = [
    {
      role: "user",
      parts: [{ text: "You are a helpful assistant." }],
    },
    {
      role: "model",
      parts: [
        { text: "Okay, I am ready to assist you. What can I do for you?" },
      ],
    },
  ];

  const chat = model.startChat({ history });

  while (true) {
    const userInput = prompt("You: ");
    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting chat.");
      break;
    }
    if (!userInput.trim()) {
      console.log("Please enter a message.");
      continue;
    }
    // Very simple check for "time in"
if (userInput.toLowerCase().includes("time in")) {
  const words = userInput.toLowerCase().split(" ");
  const index = words.indexOf("in");
  const country = words[index + 1];

  if (country) {
    const time = getTimeByCountry(country);
    if (time) {
      console.log(` ${time}`);
    } else {
      console.log(`I don't know the time zone for "${country}".`);
    }
    continue; 
  }
}
    console.log("Thinking...");

    try {
      const result = await chat.sendMessage(userInput);
      const response= await result.response;
      const text = response.text();
        console.log(`Gemini: ${text}`);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

main();
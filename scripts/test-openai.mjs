import OpenAI from "openai";
import fs from "fs";
import path from "path";

async function testOpenAI() {
  console.log("Testing OpenAI API connectivity...");
  
  let apiKey;
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const match = envFile.match(/GROQ_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
  } catch (e) {
    console.error("Could not read .env.local");
    return;
  }

  if (!apiKey) {
    console.error("GROQ_API_KEY not found in .env.local");
    return;
  }

  const openai = new OpenAI({ 
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Hello, say 'Groq is working' if you receive this." }],
      max_tokens: 10,
    });
    console.log("Success! Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API Error:");
    console.error("Message:", error.message);
    
    if (error.message.includes("429") || error.message.includes("quota")) {
      console.log("\nReason: You have likely exceeded your OpenAI quota or your billing is not set up correctly.");
    } else if (error.message.includes("ENOTFOUND") || error.message.includes("timeout") || error.message.includes("UND_ERR_CONNECT_TIMEOUT")) {
      console.log("\nReason: Network connectivity issue (DNS or Timeout).");
    } else if (error.message.includes("401")) {
        console.log("\nReason: Invalid API Key.");
    }
  }
}

testOpenAI();

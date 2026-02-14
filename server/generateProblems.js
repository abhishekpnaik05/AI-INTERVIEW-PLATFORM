require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const axios = require("axios");
const CodingQuestion = require("./models/CodingQuestion");

/* ---------------- ENV CHECK ---------------- */

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

/* ---------------- CONNECT DB ---------------- */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* ---------------- STRONG JSON CLEANER ---------------- */

function extractJSON(text) {
  try {
    // Remove markdown
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    // Remove text before first {
    const firstBrace = text.indexOf("{");
    if (firstBrace !== -1) {
      text = text.substring(firstBrace);
    }

    // Remove text after last }
    const lastBrace = text.lastIndexOf("}");
    if (lastBrace !== -1) {
      text = text.substring(0, lastBrace + 1);
    }

    return JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON returned from model");
  }
}

/* ---------------- SANITIZER ---------------- */

function sanitizeProblem(problem, category) {
  // Normalize difficulty
  if (problem.difficulty) {
    const diff = problem.difficulty.toLowerCase();
    if (diff.includes("easy")) problem.difficulty = "Easy";
    else if (diff.includes("medium")) problem.difficulty = "Medium";
    else if (diff.includes("hard")) problem.difficulty = "Hard";
    else problem.difficulty = "Medium";
  } else {
    problem.difficulty = "Medium";
  }

  // Ensure description exists
  if (!problem.description || problem.description.trim() === "") {
    problem.description = "Solve the given problem.";
  }

  // Ensure constraints is array
  if (!Array.isArray(problem.constraints)) {
    problem.constraints = ["No specific constraints."];
  }

  // Ensure testCases exist
  if (!Array.isArray(problem.testCases)) {
    problem.testCases = [];
  }

  // Normalize testCases
  problem.testCases = problem.testCases.map((tc, index) => ({
    input: tc.input || {},
    expectedOutput: tc.expectedOutput ?? null,
    isHidden: index >= 2,
  }));

  // Ensure at least 5 test cases
  while (problem.testCases.length < 5) {
    problem.testCases.push({
      input: {},
      expectedOutput: null,
      isHidden: true,
    });
  }

  problem.category = category;

  return problem;
}

/* ---------------- GENERATE USING OLLAMA ---------------- */

async function generateProblem(category) {
  const prompt = `
You are a strict JSON generator.

Return ONLY valid JSON.
No markdown.
No explanations.
The response must start with { and end with }.

Generate ONE coding interview problem with:

title: string
difficulty: "Easy" | "Medium" | "Hard"
description: string (must not be empty)
constraints: array of strings
starterCode: string (JavaScript function only)
testCases: array of 5 objects:
{
  input: object,
  expectedOutput: any,
  isHidden: boolean
}
`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "deepseek-coder",
    prompt: prompt,
    stream: false,
  });

  const content = response.data.response;

  return extractJSON(content);
}

/* ---------------- MAIN LOOP ---------------- */

async function run() {
  const categories = [
    "Array",
    "String",
    "Graph",
    "Tree",
    "Dynamic Programming",
  ];

  for (let i = 0; i < 20; i++) {
    const category = categories[i % categories.length];

    try {
      const rawProblem = await generateProblem(category);

      const problem = sanitizeProblem(rawProblem, category);

      problem.slug = problem.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      await CodingQuestion.create(problem);

      console.log(`✅ Inserted: ${problem.title}`);
    } catch (err) {
      console.log("❌ Error:", err.message);
    }
  }

  console.log("🎉 Done generating problems");
  await mongoose.disconnect();
  process.exit();
}

run();

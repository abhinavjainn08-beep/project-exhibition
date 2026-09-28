require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("."));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.post("/compare", async (req, res) => {

    const {
        crime,
        country1,
        country2,
        country3,
        details
    } = req.body;

    console.log("AI comparison requested:");
    console.log("Crime:", crime);
    console.log("Countries:", country1, country2, country3);


    try {

        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: `
You are an AI legal research assistant.

The user wants an informational comparison of the criminal law
relating to the following offence:

OFFENCE:
${crime}

COUNTRY 1:
${country1}

COUNTRY 2:
${country2}

COUNTRY 3:
${country3}

ADDITIONAL CASE DETAILS:
${details || "No additional details provided."}

For each country, explain:

1. Potentially applicable law
2. Possible punishment
3. Possible fines
4. Important circumstances
5. Important limitations or jurisdiction differences

Do NOT invent laws, sections, penalties or case outcomes.

Clearly state when the exact jurisdiction or circumstances are
needed for a precise answer.

This is informational legal research, not legal advice.

Return a concise comparison suitable for a website.
`
        });


        const answer = response.output_text;


        res.json({
            success: true,
            answer: answer
        });


    } catch (error) {

        console.error("AI ERROR:", error);

        res.status(500).json({
            success: false,
            error: "The AI request failed."
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `PENALTY//COMPARE running at http://localhost:${PORT}`
    );

});
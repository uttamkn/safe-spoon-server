import Together from "together-ai";
import { jsonSchema } from "./jsonSchema";
import { IUser } from "../models/User";
import { TOGETHER_API_KEY } from "../env";

const together = new Together({ apiKey: TOGETHER_API_KEY });

export const fetchReport = async (ocrText: string, user: IUser) => {
  const prompt = `
  You are a health assistant. You will be given a text extracted from an OCR scan of food ingredients. 
  The text may contain inaccuracies due to the OCR process, so please be cautious and only extract the list of ingredients, ignoring any irrelevant text like marketing slogans, quantities, or unrelated data. 
  If no valid ingredients can be extracted, set the \`is_valid\` field to \`false\`.

  Do not assume or invent any health conditions or ingredients. Only use the information provided in the prompt and user data.
  In addition to extracting the ingredients, validate the user's health information (age, weight, gender, allergies, and diseases):
  - If the allergies or diseases provided by the user are not recognized, set \`is_valid\` to \`false\`, but \`is_safe\` to \`true\` because there is no valid health data to determine risks. 
    In this case, skip generating the \`ingredient_risks\` field.
  - If you do not find any valid ingredients in the OCR text, set the \`is_valid\` field to \`false\` and do not generate any ingredient-related information. In this case, skip generating the \`is_safe\`, \`ingredient_risks\`, and \`overall_suggestion\` fields. 
  - Do not assume that user has any allergies or diseases if they are not provided in User Information.
  
  After extracting the ingredients and validating the health information, analyze the ingredients based on the user's personal health details, including their age, weight, gender, allergies, and diseases.

  Please provide a report in JSON format containing:
  1. A boolean \`is_valid\` indicating whether the provided ingredients and the user's health information are valid (i.e., the text contains recognizable food ingredients, and the health information provided is valid). 
  2. A boolean \`is_safe\` indicating whether the food is safe to eat for the user considering their health conditions (allergies, diseases, etc.). 
  3. A list \`ingredient_risks\` where each ingredient includes:
     - \`ingredient\`: the name of the ingredient,
     - \`is_safe\`: whether the ingredient is safe to eat for the user,
     - \`risk_level\`: the level of risk for the user (\`low\`, \`moderate\`, \`high\`),
     - \`reason\`: a short description of why the ingredient is safe or unsafe.

  Here is the User Information:
  - Age: ${user.age}
  - Weight: ${user.weight} kg
  - Gender: ${user.gender}
  - Allergies: ${user.allergies.length > 0 ? user.allergies.join(", ") : "None"}
  - Diseases: ${user.diseases.length > 0 ? user.diseases.join(", ") : "None"}

  Here is the OCR text:
  "${ocrText}"`;

  try {
    const extract = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a health assistant. Please analyze the following food ingredients and user health data.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      response_format: { type: "json_object", schema: jsonSchema },
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50,
    });

    if (extract?.choices?.[0]?.message?.content) {
      const output = JSON.parse(extract?.choices?.[0]?.message?.content);
      return output;
    } else {
      console.log("No valid response received.");
      return "No output.";
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

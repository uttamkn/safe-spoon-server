export const jsonSchema: Record<string, any> = {
  title: "FoodSafetyReport",
  type: "object",
  properties: {
    is_valid: {
      type: "boolean",
      description:
        "Indicates if the provided ingredients are valid (validity of the OCR data).",
    },
    is_safe: {
      type: "boolean",
      description:
        "Indicates if the food is safe to eat based on user's information.",
    },
    ingredient_risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ingredient: {
            type: "string",
            description: "Name of the ingredient.",
          },
          is_safe: {
            type: "boolean",
            description: "Indicates if this ingredient is safe for the user.",
          },
          risk_level: {
            type: "string",
            enum: ["low", "moderate", "high"],
            description: "Risk level of the ingredient for the user.",
          },
          reason: {
            type: "string",
            description: "Description of why the ingredient is safe or unsafe.",
          },
        },
        required: ["ingredient", "is_safe", "risk_level", "reason"],
      },
      description: "List of ingredients with their associated risks.",
    },
  },
  required: ["is_valid", "is_safe"],
};

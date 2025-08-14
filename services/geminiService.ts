import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { WorkoutParams, WorkoutPlan, CalorieAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workoutResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "The name of the exercise.",
            },
            sets: {
                type: Type.STRING,
                description: "The number of sets to perform (e.g., '3' or '3-4').",
            },
            reps: {
                type: Type.STRING,
                description: "The number of repetitions per set (e.g., '8-12' or '15').",
            },
            description: {
                type: Type.STRING,
                description: "A brief, motivating description or instruction for the exercise, focusing on form.",
            },
        },
        required: ["name", "sets", "reps", "description"],
    },
};

const calorieResponseSchema = {
    type: Type.OBJECT,
    properties: {
        dishName: { type: Type.STRING, description: "The name of the identified dish." },
        calories: { type: Type.STRING, description: "Estimated total calories (e.g., '350-450 kcal')." },
        protein: { type: Type.STRING, description: "Estimated protein in grams (e.g., '30g')." },
        carbs: { type: Type.STRING, description: "Estimated carbohydrates in grams (e.g., '45g')." },
        fat: { type: Type.STRING, description: "Estimated fat in grams (e.g., '15g')." },
        notes: { type: Type.STRING, description: "Additional notes, like confidence level or ingredients identified." },
    },
    required: ["dishName", "calories", "protein", "carbs", "fat", "notes"],
};


export const generateWorkoutPlan = async (params: WorkoutParams): Promise<WorkoutPlan> => {
    const { goal, level, equipment, duration } = params;

    const systemInstruction = `You are a world-class fitness coach and AI expert named 'Gem'. 
    Your task is to create a highly effective, personalized workout plan.
    - Be concise and motivational.
    - The plan must be tailored exactly to the user's inputs.
    - The exercises must be appropriate for the specified equipment. For 'Bodyweight Only', do not include exercises requiring any equipment. For 'Dumbbells Only', focus on dumbbell exercises.
    - The total workout duration, including warm-up and cool-down, should align with the user's selected time.
    - Structure the response as a JSON array of exercise objects according to the provided schema. Start with a 5-minute warm-up exercise and end with a 5-minute cool-down stretch.`;
    
    const prompt = `
    Generate a workout plan with the following specifications:
    - Main Goal: ${goal}
    - Experience Level: ${level}
    - Available Equipment: ${equipment}
    - Workout Duration: ${duration} minutes
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: workoutResponseSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText) as WorkoutPlan;
        
        if (!Array.isArray(plan) || plan.length === 0) {
            throw new Error("AI returned an invalid or empty workout plan.");
        }
        
        return plan;
    } catch (error) {
        console.error("Error generating workout plan from Gemini:", error);
        throw new Error("Failed to communicate with the AI coach. Please check your connection or API key.");
    }
};

export const generateExerciseImage = async (exerciseName: string): Promise<string> => {
    const prompt = `A photorealistic, dynamic, action-shot of a person demonstrating the "${exerciseName}" exercise with perfect form. The image should look like a frame from an instructional video. The background should be a modern, dark gym with red accents.`;
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;

        if (!base64ImageBytes) {
            throw new Error("AI failed to generate an image.");
        }

        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating exercise image:", error);
        throw new Error("Failed to generate exercise image demonstration.");
    }
};

export const analyzeFoodImage = async (base64Image: string): Promise<CalorieAnalysis> => {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
      text: "You are a world-class nutritionist. Analyze the food in this image. Identify the dish and estimate its total calories. Provide a breakdown of protein, carbohydrates, and fats in grams. Be as accurate as possible. If the image does not contain food, clearly state that in the notes."
    };

    const systemInstruction = "Your response must be a JSON object that conforms to the provided schema. Be helpful and provide accurate nutritional information.";

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: calorieResponseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CalorieAnalysis;
    } catch (error) {
        console.error("Error analyzing food image:", error);
        throw new Error("Failed to analyze food image. The AI nutritionist may be on a break.");
    }
};
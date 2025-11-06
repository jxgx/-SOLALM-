import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBibleVerse(): Promise<{ verseText: string; reference: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Provide a single, visually evocative verse from the King James Bible. Ensure the verse is suitable for artistic interpretation.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verseText: {
              type: Type.STRING,
              description: "The full text of the Bible verse."
            },
            reference: {
              type: Type.STRING,
              description: "The reference for the verse, e.g., 'Genesis 1:1'."
            }
          },
          required: ['verseText', 'reference']
        }
      }
    });
    
    const jsonString = response.text.trim();
    const verseData = JSON.parse(jsonString);
    return verseData;
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    throw new Error("Failed to fetch a Bible verse. The AI may be resting.");
  }
}

export async function getRevelationVerse(): Promise<{ verseText: string; reference: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Provide a single, random, visually evocative verse from the book of Revelation in the King James Bible. Ensure the verse is suitable for artistic interpretation.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verseText: {
              type: Type.STRING,
              description: "The full text of the Bible verse."
            },
            reference: {
              type: Type.STRING,
              description: "The reference for the verse, e.g., 'Revelation 1:8'."
            }
          },
          required: ['verseText', 'reference']
        }
      }
    });
    
    const jsonString = response.text.trim();
    const verseData = JSON.parse(jsonString);
    return verseData;
  } catch (error) {
    console.error("Error fetching Revelation verse:", error);
    // Return a fallback verse on error
    return {
        verseText: "And he that sat upon the throne said, Behold, I make all things new.",
        reference: "Revelation 21:5"
    };
  }
}

export async function generateImageForVerse(verse: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A photo-realistic, hyper-realistic square image as if filmed by an 8mm camera, interpreting the Bible verse: "${verse}". The aesthetic is heavily inspired by 1970s Turkish Giallo thrillers and the directorial style of Dario Argento and Mario Bava. The scene should feature bold, saturated colors (especially reds, blues, and yellows), dramatic lighting with high contrast and deep shadows, and a surreal, dreamlike quality. If a person is present, they should be a beautiful, stylized woman with a sense of mystery or fear. The overall mood is striking, beautiful, and slightly unsettling. Cinematic, 35mm film grain. The final image must contain NO text, letters, writing, or watermarks whatsoever.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate an image. The AI artist might be on a break.");
  }
}
import { GoogleGenAI, Type } from "@google/genai";
if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        session: { type: Type.STRING, description: "The title of the new session. Should be creative and relevant." },
        category: { type: Type.STRING, description: "A relevant category from this list: 'Technology', 'Product', 'Planning', 'Training', 'Company Update', 'Entertainment', 'Hackathon', 'Opening', 'Closing'." },
        speaker: { type: Type.STRING, description: "A suggested speaker name, a role (e.g., 'Senior Engineer'), or simply 'TBD'." },
        speakerTitle: { type: Type.STRING, description: "The speaker's job title, if applicable. Can be left empty." },
        description: { type: Type.STRING, description: "A brief, engaging description of what the session is about (2-3 sentences)." },
        objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 key learning objectives or takeaways for the attendees."
        },
        materials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 1-2 potential materials needed for the session (e.g., 'Live Demos', 'Q&A Session')."
        },
        tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-4 relevant, one-word or two-word tags for filtering (e.g., 'AI/ML', 'Workshop', 'Strategy')."
        }
    },
    required: ['session', 'category', 'description', 'objectives', 'materials', 'tags'],
    propertyOrdering: ['session', 'category', 'speaker', 'speakerTitle', 'description', 'objectives', 'materials', 'tags']
};
export async function generateSessionSuggestion(existingSessions, dayTheme) {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Cannot use AI features.");
    }
    const model = 'gemini-2.5-flash';
    const existingSessionsText = existingSessions.length > 0
        ? existingSessions.map(s => `- "${s.session}" (Category: ${s.category})`).join('\n')
        : "No sessions scheduled yet.";
    const prompt = `
        You are an expert event planner for a corporate tech event in Goa, India.
        The theme for this day is: "${dayTheme}".
        
        Here are the sessions already scheduled for this day:
        ${existingSessionsText}
        
        Your task is to generate a single, new, and creative session that complements the existing schedule and aligns perfectly with the day's theme.
        Do not suggest generic items like 'Break', 'Lunch', or 'Dinner'.
        The session should be exciting and valuable for tech and engineering leaders.
        Your response must be a single JSON object conforming to the provided schema.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
                temperature: 0.9,
            }
        });
        if (!response.text) {
            throw new Error("Received an empty response from the AI.");
        }
        const suggestedData = JSON.parse(response.text);
        return suggestedData;
    }
    catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error.message.includes('SAFETY')) {
            throw new Error("Suggestion failed due to safety policies. Please try a different approach.");
        }
        throw new Error("Could not generate a session suggestion from the AI.");
    }
}
/**
 * Converts all event data into a compact, token-efficient text format for the AI.
 */
function formatContextForAI(agenda, generalInfo, venueLocations) {
    let context = "EVENT AGENDA:\n";
    for (const day in agenda) {
        context += `\n--- DAY ${day} ---\n`;
        agenda[day].forEach(session => {
            context += `\n* Session: ${session.session}\n`;
            context += `  Time: ${session.startTime} - ${session.endTime}\n`;
            if (session.speaker || (session.speakers && session.speakers.length > 0)) {
                const speakers = session.speakers && session.speakers.length > 0
                    ? session.speakers.map(s => `${s.name}${s.title ? ` (${s.title})` : ''}`).join(', ')
                    : `${session.speaker}${session.speakerTitle ? ` (${session.speakerTitle})` : ''}`;
                context += `  Speaker(s): ${speakers}\n`;
            }
            context += `  Location: ${session.location}\n`;
            context += `  Description: ${session.description}\n`;
            if (session.objectives && session.objectives.length > 0) {
                context += `  Objectives: ${session.objectives.join('; ')}\n`;
            }
        });
    }
    context += "\n\nEVENT GENERAL INFORMATION:\n";
    context += "\n* Hotels:\n";
    generalInfo.hotelDetails.forEach(h => {
        context += `  - ${h.name}: ${h.address} (Phone: ${h.phone})\n`;
    });
    context += "\n* Venue Locations:\n";
    Object.values(venueLocations).forEach(venue => {
        context += `  - ${venue.name}: ${venue.description}\n`;
    });
    context += "\n* Deltek Emergency Contacts:\n";
    generalInfo.deltekContacts.forEach(c => {
        context += `  - ${c.name}: ${c.contact}, ${c.email}\n`;
    });
    context += "\n* Local Amenities:\n";
    context += `  - Shopping: ${generalInfo.localAmenities.shopping.name} at ${generalInfo.localAmenities.shopping.address}. Note: ${generalInfo.localAmenities.shopping.note}\n`;
    context += `  - Supermarket: ${generalInfo.localAmenities.supermarket.name} at ${generalInfo.localAmenities.supermarket.address} (Phone: ${generalInfo.localAmenities.supermarket.phone})\n`;
    if (generalInfo.localAmenities.rentals) {
        const rentals = generalInfo.localAmenities.rentals;
        context += `  - Rentals: ${rentals.name} at ${rentals.address}. Note: ${rentals.note}\n`;
    }
    context += "\n* Local Emergency Services:\n";
    const hospital = generalInfo.emergencyServices.hospital;
    context += `  - Hospital: ${hospital.name}, Address: ${hospital.address}, Phone: ${hospital.phone}\n`;
    const police = generalInfo.emergencyServices.police;
    context += `  - Police Station: ${police.name} (Incharge: ${police.incharge}), Landline: ${police.contact}, Mobile: ${police.mobile}, Email: ${police.email}\n`;
    context += "\n* Nearby Restaurants:\n";
    [...generalInfo.restaurants.nearHotels, ...generalInfo.restaurants.southGoa].forEach(r => {
        context += `  - ${r.name}: ${r.description}\n`;
    });
    if (generalInfo.leisureActivities) {
        const { note, timings, outdoorChargeable, indoorChargeable, nonChargeable, artAndCraft } = generalInfo.leisureActivities;
        context += "\n\nLEISURE & RESORT ACTIVITIES:\n";
        context += `Note: ${note}\n`;
        context += `\n* Chargeable Outdoor Activities (${timings.outdoorChargeable}):\n`;
        outdoorChargeable.forEach(a => {
            context += `  - ${a.activity} (${a.duration}): ${a.rate}\n`;
        });
        context += `\n* Chargeable Indoor Activities (${timings.indoorChargeable}):\n`;
        indoorChargeable.forEach(a => {
            context += `  - ${a.activity} (${a.duration}): ${a.rate}\n`;
        });
        context += `\n* Art & Craft Activities (${timings.artAndCraft}):\n`;
        artAndCraft.forEach(a => {
            context += `  - ${a.activity} (${a.nos}): ${a.rate}\n`;
        });
        context += `\n* Non-Chargeable Activities (${timings.nonChargeable}):\n`;
        nonChargeable.forEach(a => {
            context += `  - ${a.activity}\n`;
        });
    }
    return context;
}
export async function createDelaChat(agenda, generalInfo, venueLocations) {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const model = 'gemini-2.5-flash';
    const formattedContext = formatContextForAI(agenda, generalInfo, venueLocations);
    const systemInstruction = `You are Dela, a friendly and helpful AI assistant for the 'Deltek India Reconnect 2025' conference. Your sole purpose is to answer questions based *strictly* on the context provided below. Do not use any external knowledge.
- Your knowledge is limited to the event agenda and general information given in the context.
- If a question cannot be answered from the provided data, you must politely state that you don't have that specific information. Do not invent details.
- Keep answers concise, clear, and directly address the user's question.
- Format your answers using simple markdown. Use **bold text** for emphasis (like session titles) and bullet points (using '*') for lists to make responses easy to read.
--- CONTEXT START ---
${formattedContext}
--- CONTEXT END ---
`;
    const initialBotMessage = "Hi there! I'm Dela, your AI assistant for Reconnect 2025. Ask me anything about the schedule, sessions, or general info!";
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.1,
        },
        // History is intentionally left empty. The context is provided in the system instruction,
        // which is a more robust way to handle large, persistent context for a chat session.
        // The first message from the user will correctly initiate the conversation.
        history: []
    });
    return { chat, initialMessage: initialBotMessage };
}

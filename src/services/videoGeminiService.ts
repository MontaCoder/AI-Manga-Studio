import { Modality, Type } from "@google/genai";
import type { Character, VideoModelId, InitialSceneData } from '@/types';
import {
    dataUrlToGeminiPart,
    extractImageFromResponse,
    getAiClient,
    getApiKey,
    getDataUrlBase64,
    parseJsonResponse,
} from '@/services/geminiClient';

const VIDEO_MODELS: VideoModelId[] = ['seedance', 'hailuo', 'veo', 'kling'];
const MAX_SCENE_DURATION_SECONDS = 10;

const createBlankCanvasAsBase64 = (width: number, height: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL('image/png');
};

const blank16x9Canvas = createBlankCanvasAsBase64(1280, 720);

const webtoonStoryboardSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            sceneDescription: {
                type: Type.STRING,
                description: 'A detailed cinematic image prompt describing the animated first frame for one extracted panel.',
            },
            narrative: {
                type: Type.STRING,
                description: 'A one-sentence description of the motion or visual change that should happen during the scene.',
            },
            duration: {
                type: Type.NUMBER,
                description: 'The scene duration in seconds. Keep it between 3 and 10.',
            },
            charactersInScene: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Character names present in the scene, matching the provided character list exactly.',
            },
            sourcePageIndex: {
                type: Type.NUMBER,
                description: 'The 0-based source page index for the extracted panel.',
            },
            recommendedModel: {
                type: Type.STRING,
                description: "The best-fit video model for the scene. Must be one of: 'seedance', 'hailuo', 'veo', 'kling'.",
            },
            reasoning: {
                type: Type.STRING,
                description: 'A short explanation for the recommended model choice.',
            },
        },
        required: [
            'sceneDescription',
            'narrative',
            'duration',
            'charactersInScene',
            'sourcePageIndex',
            'recommendedModel',
            'reasoning',
        ],
    },
};

const isInitialSceneDataArray = (value: unknown): value is InitialSceneData[] => Array.isArray(value);

const normalizeInitialScene = (scene: InitialSceneData): InitialSceneData => ({
    ...scene,
    duration: Math.min(Math.max(Math.round(scene.duration), 3), MAX_SCENE_DURATION_SECONDS),
    recommendedModel: VIDEO_MODELS.includes(scene.recommendedModel) ? scene.recommendedModel : 'seedance',
});

// 1. Generate the initial storyboard structure from manga pages
export const generateStoryboardFromPages = async (
    pageImages: { data: string; mimeType: string }[],
    characters: Pick<Character, 'name' | 'description'>[],
): Promise<InitialSceneData[]> => {
    const characterList = characters.map(c => `- ${c.name}: ${c.description || 'No description'}`).join('\n');

    const systemInstruction = `You are a storyboard artist and animation director. Analyze the provided manga/webtoon page(s). Break them into individual panels and prepare an animation plan.

For each detected panel, return:
1. **sceneDescription**: A detailed prompt for an AI image generator to create the first animation frame. Keep it in a vibrant, modern webtoon/anime style. Describe characters, expressions, setting, camera angle, lighting, and mood. Ignore speech bubbles, dialogue text, and sound effects.
2. **narrative**: A one-sentence description of the key motion or visual change that happens during the scene.
3. **duration**: A number between 3 and 10 seconds.
4. **charactersInScene**: Character names that appear in the panel, matching the provided list exactly.
5. **sourcePageIndex**: The 0-based source page index.
6. **recommendedModel**: Choose the single best video model from ['seedance', 'hailuo', 'veo', 'kling'].
7. **reasoning**: Briefly justify the model choice.

Model guidance:
- Seedance Pro 1.0: best for multi-shot narrative sequences and consistency.
- Hailuo 02: best for physics-heavy action and dynamic movement.
- Veo 3: best when synchronized audio is a major advantage.
- Kling: best when strict reference consistency matters most.

Return valid JSON matching the provided schema.

Available Characters:
${characterList}
`;

    const response = await getAiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: systemInstruction }, ...pageImages.map(img => dataUrlToGeminiPart(img.data, img.mimeType))] },
        config: {
            responseMimeType: "application/json",
            responseSchema: webtoonStoryboardSchema,
        },
    });

    return parseJsonResponse<InitialSceneData[]>(
        response,
        "Failed to get a valid storyboard from AI.",
        isInitialSceneDataArray,
    ).map(normalizeInitialScene);
};

// 2. Generate a single image (start frame)
export const generateVideoFrame = async (
    prompt: string,
    referenceImage: { data: string; mimeType: string },
): Promise<string> => {
    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                dataUrlToGeminiPart(blank16x9Canvas),
                dataUrlToGeminiPart(referenceImage.data, referenceImage.mimeType),
                {
                    text: `Using the provided blank 16:9 canvas as your drawing surface, create a new, single, full-screen animation frame based on the provided manga panel and the following description: "${prompt}".
If the original panel has a simple, white, or abstract background, generate a complete and fitting background that matches the scene.
The output must be a single undivided 16:9 scene suitable for animation, not a comic panel layout.
Strictly adhere to the art style, character designs, and color palette of the original webtoon page. The result must not be photorealistic.`,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    return extractImageFromResponse(response, "AI did not return an image for the video frame.");
};

// 3. Generate the end frame based on the start frame and narrative
export const generateWebtoonEndFrame = async (
    startFrameBase64: string,
    narrative: string,
    duration: number,
): Promise<string> => {
    const prompt = `You are an expert animator. Use the provided blank 16:9 canvas as your drawing surface. Create a dynamic end frame for a short scene based on a start frame.

Instructions:
1. Analyze the provided start frame to understand pose, expression, and setting.
2. The key action that occurs during the scene is: "${narrative}".
3. Generate an end frame that depicts the result of this action after ${duration} seconds.

Requirements:
- The end frame must be visually distinct from the start frame.
- The camera angle may shift slightly to add dynamism.
- Maintain character, clothing, and background consistency.
- Keep the same vibrant modern webtoon/anime style.
- Output only the final edited 16:9 image.`;

    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                dataUrlToGeminiPart(blank16x9Canvas),
                dataUrlToGeminiPart(startFrameBase64),
                { text: prompt },
            ],
        },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    return extractImageFromResponse(response, "AI did not return an end frame for the webtoon scene.");
};

export const regenerateVideoFrame = async (
    originalFrameBase64: string,
    editPrompt: string,
    originalSceneDescription: string,
): Promise<string> => {
    const prompt = editPrompt
        ? `You are an expert animator revising a single frame of an animation.
Base Image: The provided image is the original frame.
Instruction: Modify the image based on this specific request: "${editPrompt}".
Context: The original scene description was: "${originalSceneDescription}".
Task: Re-render the image while maintaining the original art style, character designs, and overall composition. Output only the edited 16:9 image.`
        : `You are an expert animator creating an alternative version of an animation frame.
Base Image: The provided image is one version of the frame.
Context: The original scene description was: "${originalSceneDescription}".
Task: Generate a new version of this frame based on the original context while maintaining the art style, character designs, and cinematic 16:9 aspect ratio. Output only the new 16:9 image.`;

    const response = await getAiClient().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [dataUrlToGeminiPart(originalFrameBase64), { text: prompt }] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    return extractImageFromResponse(response, "AI did not return a regenerated image.");
};

const getCharacterAnchors = (
    scene: InitialSceneData,
    allCharacters: Pick<Character, 'name' | 'description'>[],
): string => {
    return scene.charactersInScene.map(charName => {
        const charData = allCharacters.find(c => c.name === charName);
        return `- character: ${charName}, ${charData?.description || 'No description'}`;
    }).join('\n');
};

export const generateSeedancePrompt = (
    scene: InitialSceneData,
    allCharacters: Pick<Character, 'name' | 'description'>[],
): string => {
    const charAnchors = getCharacterAnchors(scene, allCharacters);
    return `Title: Scene ${scene.sourcePageIndex + 1}
Duration: ${scene.duration}s  Aspect: 16:9  Style: cinematic, modern webtoon/anime style
Consistency anchors:
${charAnchors}
- mood: [auto-detect from scene]

Shot 1 (0-${scene.duration}s):
- action: ${scene.sceneDescription}. ${scene.narrative}.
- camera: [auto-detect from scene, cinematic]
- include anchors: all characters in scene

Negative:
- avoid: text artifacts, logos, watermarks, bad anatomy
`;
};

export const generateHailuoPrompt = (
    scene: InitialSceneData,
    _allCharacters: Pick<Character, 'name' | 'description'>[],
): string => {
    return `Task: Animate a short clip from a webtoon panel: ${scene.sceneDescription}
Length: ${scene.duration}s  Aspect: 16:9
Action physics:
- body mechanics: ${scene.narrative}, with realistic weight and momentum.
- speed profile: natural acceleration and deceleration.
- environment forces: subtle ambient motion.

Camera:
- rig: cinematic, dynamic camera that enhances the action.
- lens: 35mm
- move: subtle dolly or pan to follow action.

Look:
- style: vibrant, modern webtoon/anime, high contrast.
- lighting: cinematic lighting, rim lights, detailed shadows.

Negative:
- avoid: limb bending artifacts, background wobble, static comic look
`;
};

export const generateVeoPrompt = (
    scene: InitialSceneData,
    _allCharacters: Pick<Character, 'name' | 'description'>[],
): string => {
    return `Title: Webtoon Scene ${scene.sourcePageIndex + 1}
Duration: ${scene.duration}s  Aspect: 16:9  Style: High-quality anime scene, cinematic, detailed background.
Visual:
- Shot 1 (0-${scene.duration}s): ${scene.sceneDescription}. Action to perform: ${scene.narrative}.

Audio:
- sfx: [appropriate ambient sounds for the scene]
- music: [instrumental music matching the mood]

Negative:
- avoid: text, speech bubbles, panel borders, photorealism.
`;
};

export const generateKlingPrompt = (
    scene: InitialSceneData,
    _allCharacters: Pick<Character, 'name' | 'description'>[],
): string => {
    const charLocks = scene.charactersInScene.join(', ');
    return `Mode: High  Length: ${scene.duration}s  Aspect: 16:9  Style: anime, cinematic
Reference images:
- subject: [The provided webtoon panel is the primary style and character reference]
Lock:
- keep: [${charLocks} hairstyle, color, outfit, face]
- do not change: character designs from reference.

Shot plan:
- Shot 1 (0-${scene.duration}s): ${scene.sceneDescription}. During the shot, ${scene.narrative}.

Camera & Look:
- lens [35mm], movement [subtle, cinematic], lighting [dramatic, source-aware]

Negative:
- avoid: ref drift, extra accessories, background text
`;
};

export const generateAllModelPrompts = (
    scene: InitialSceneData,
    characters: Pick<Character, 'name' | 'description'>[],
): Record<VideoModelId, string> => {
    return {
        seedance: generateSeedancePrompt(scene, characters),
        hailuo: generateHailuoPrompt(scene, characters),
        veo: generateVeoPrompt(scene, characters),
        kling: generateKlingPrompt(scene, characters),
    };
};

export const generateVeoVideo = async (
    prompt: string,
    onProgressUpdate: (progress: string) => void,
    startFrame?: { data: string; mimeType: string },
): Promise<string> => {
    onProgressUpdate("Starting video generation...");

    type VeoRequestPayload = {
        model: string;
        prompt: string;
        image?: { imageBytes: string; mimeType: string };
        config: { numberOfVideos: number };
    };

    const requestPayload: VeoRequestPayload = {
        model: 'veo-2.0-generate-001',
        prompt,
        config: {
            numberOfVideos: 1,
        },
    };

    if (startFrame?.data) {
        requestPayload.image = {
            imageBytes: getDataUrlBase64(startFrame.data),
            mimeType: startFrame.mimeType,
        };
    }

    const ai = getAiClient();
    let operation = await ai.models.generateVideos(requestPayload);

    let pollCount = 0;
    const progressMessages = [
        "Casting characters...",
        "Setting up the scene...",
        "Director is shouting 'Action!'...",
        "Rendering photons...",
        "Compositing layers...",
        "Adding final touches...",
    ];

    while (!operation.done) {
        onProgressUpdate(progressMessages[pollCount % progressMessages.length]);
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
        pollCount += 1;
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    onProgressUpdate("Fetching video...");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was provided.");
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API key not found for video download");
    }

    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }

    return URL.createObjectURL(await response.blob());
};

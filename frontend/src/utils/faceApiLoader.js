import * as faceapi from "face-api.js";

let modelsLoaded = false;

export const loadFaceModels = async () => {
    if (modelsLoaded) {
        return;
    }

    const MODEL_URL = "/models";

    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        modelsLoaded = true;

        console.log("✅ Face API models loaded");
    } catch (error) {
        console.error("❌ Failed to load Face API models", error);
        throw error;
    }
};

export default loadFaceModels;
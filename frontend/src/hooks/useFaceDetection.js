import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

export default function useFaceDetection() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);

    const [status, setStatus] = useState("initializing");
    const [descriptor, setDescriptor] = useState(null);

    const stopCamera = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            setStatus("initializing");
            
            // Stop any existing stream first
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            
            const media = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: 640,
                    height: 480,
                },
                audio: false,
            });

            streamRef.current = media;

            if (videoRef.current) {
                videoRef.current.srcObject = media;
                
                // Simple approach - just play
                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.warn('Auto-play prevented, will retry');
                }
                
                // Wait a bit for video to stabilize
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setStatus("camera_ready");
        } catch (error) {
            console.error("Camera error:", error);
            setStatus("camera_error");
        }
    }, []);

    const detectFace = useCallback(async () => {
        if (
            !videoRef.current ||
            videoRef.current.readyState < 2 ||  // Changed from !== 4 to < 2 (less strict)
            !streamRef.current
        ) {
            return;
        }

        try {
            const detections = await faceapi
                .detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions({
                        inputSize: 320,
                        scoreThreshold: 0.4,  // Lowered from 0.5 for better detection
                    })
                )
                .withFaceLandmarks()
                .withFaceDescriptors();

            const canvas = canvasRef.current;

            if (!canvas) return;

            const displaySize = {
                width: videoRef.current.videoWidth || 640,
                height: videoRef.current.videoHeight || 480,
            };

            faceapi.matchDimensions(canvas, displaySize);

            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!detections || detections.length === 0) {
                setStatus("no_face");
                setDescriptor(null);
                return;
            }

            if (detections.length > 1) {
                setStatus("multiple_faces");
                setDescriptor(null);
                const resized = faceapi.resizeResults(detections, displaySize);
                faceapi.draw.drawDetections(canvas, resized);
                return;
            }

            // Single face detected
            const detection = detections[0];
            setStatus("face_detected");

            const resized = faceapi.resizeResults(detection, displaySize);
            faceapi.draw.drawDetections(canvas, resized);
            faceapi.draw.drawFaceLandmarks(canvas, resized);

            setDescriptor(Array.from(detection.descriptor));
        } catch (error) {
            console.error("Face detection error:", error);
        }
    }, []);

    useEffect(() => {
        if (status === "camera_ready" && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                detectFace();
            }, 500);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status, detectFace]);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    return {
        videoRef,
        canvasRef,
        descriptor,
        status,
        startCamera,
        stopCamera,
    };
}
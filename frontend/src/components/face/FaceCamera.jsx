import useFaceDetection from "../../hooks/useFaceDetection";
import "./FaceCamera.css";
import { useEffect, useRef } from "react";

const getStatusConfig = (status) => {
    const configs = {
        initializing: { color: "#6b7280", icon: "⏳", message: "Initializing camera..." },
        camera_ready: { color: "#3b82f6", icon: "📷", message: "Camera ready. Position your face." },
        no_face: { color: "#f59e0b", icon: "⚠️", message: "No face detected. Please position your face in frame." },
        multiple_faces: { color: "#ef4444", icon: "❌", message: "Multiple faces detected. Only one person allowed." },
        face_detected: { color: "#10b981", icon: "✅", message: "Face detected successfully!" },
        camera_error: { color: "#ef4444", icon: "❌", message: "Camera access denied or not available." },
        matching: { color: "#3b82f6", icon: "🔍", message: "Verifying face..." },
        match_success: { color: "#10b981", icon: "✅", message: "Face verified successfully!" },
        match_failed: { color: "#ef4444", icon: "❌", message: "Face verification failed." },
    };

    return configs[status] || configs.initializing;
};

export default function FaceCamera({ onStatusChange }) {
    const { videoRef, canvasRef, status, descriptor } = useFaceDetection();
    const prevStatusRef = useRef();
    const prevDescriptorRef = useRef();

    const statusConfig = getStatusConfig(status);

    // Notify parent of status changes using useEffect to avoid render issues
    useEffect(() => {
        if (onStatusChange) {
            const statusChanged = prevStatusRef.current !== status;
            const descriptorChanged = prevDescriptorRef.current !== descriptor;
            
            if (statusChanged || descriptorChanged) {
                onStatusChange(status, descriptor);
                prevStatusRef.current = status;
                prevDescriptorRef.current = descriptor;
            }
        }
    }, [status, descriptor, onStatusChange]);

    return (
        <div className="face-camera-container">
            <div className="camera-viewport">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <canvas
                    ref={canvasRef}
                    className="camera-canvas"
                    width="640"
                    height="480"
                />
            </div>

            <div className="camera-status" style={{ color: statusConfig.color }}>
                <span className="status-icon">{statusConfig.icon}</span>
                <span className="status-message">{statusConfig.message}</span>
            </div>
        </div>
    );
}
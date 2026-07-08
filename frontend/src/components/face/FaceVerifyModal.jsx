import { useState, useEffect } from "react";
import { loadFaceModels } from "../../utils/faceApiLoader";
import FaceCamera from "./FaceCamera";
import "./FaceVerifyModal.css";

export default function FaceVerifyModal({ isOpen, onClose, action, attendanceId, onSuccess }) {
    const [verifyStatus, setVerifyStatus] = useState("idle");
    const [capturedDescriptor, setCapturedDescriptor] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initModels = async () => {
            try {
                await loadFaceModels();
                setModelsLoaded(true);
            } catch (error) {
                console.error("Failed to load models:", error);
                setError("Failed to load face recognition models. Please refresh and try again.");
            }
        };

        if (isOpen) {
            initModels();
            setVerifyStatus("idle");
            setCapturedDescriptor(null);
            setError(null);
        }
    }, [isOpen]);

    const handleFaceStatusChange = (status, descriptor) => {
        if (status === "face_detected" && descriptor && descriptor.length === 128) {
            setCapturedDescriptor(descriptor);
        } else {
            setCapturedDescriptor(null);
        }
    };

    const handleVerify = async () => {
        if (!capturedDescriptor || capturedDescriptor.length !== 128) {
            setError("No valid face detected. Please ensure your face is clearly visible.");
            return;
        }

        setVerifyStatus("verifying");
        setError(null);

        try {
            const token = localStorage.getItem("token");
            
            const payload = {
                action: action,
                face_descriptor: capturedDescriptor,
            };

            if (action === "check_out" && attendanceId) {
                payload.attendance_id = attendanceId;
            }

            const response = await fetch("http://localhost:8000/api/attendances/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Face verification failed");
            }

            setVerifyStatus("success");
            
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Verification error:", error);
            setVerifyStatus("failed");
            setError(error.message || "Face verification failed. Please try again.");
        }
    };

    const handleClose = () => {
        if (verifyStatus !== "verifying") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="face-verify-modal-overlay" onClick={handleClose}>
            <div className="face-verify-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {action === "check_in" ? "📍 Check In" : "🏁 Check Out"}
                    </h2>
                    <button
                        className="close-btn"
                        onClick={handleClose}
                        disabled={verifyStatus === "verifying"}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <p className="modal-description">
                        Position your face in the center and hold still for verification.
                    </p>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {modelsLoaded ? (
                        <FaceCamera onStatusChange={handleFaceStatusChange} />
                    ) : (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading face recognition models...</p>
                        </div>
                    )}

                    {verifyStatus === "success" && (
                        <div className="success-message">
                            <span className="success-icon">✅</span>
                            <span>
                                {action === "check_in"
                                    ? "Checked in successfully!"
                                    : "Checked out successfully!"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        onClick={handleClose}
                        className="btn-cancel"
                        disabled={verifyStatus === "verifying"}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleVerify}
                        className="btn-verify"
                        disabled={
                            !capturedDescriptor ||
                            capturedDescriptor.length !== 128 ||
                            verifyStatus === "verifying" ||
                            verifyStatus === "success"
                        }
                    >
                        {verifyStatus === "verifying"
                            ? "Verifying..."
                            : verifyStatus === "success"
                            ? "✓ Verified"
                            : "Verify & " + (action === "check_in" ? "Check In" : "Check Out")}
                    </button>
                </div>
            </div>
        </div>
    );
}

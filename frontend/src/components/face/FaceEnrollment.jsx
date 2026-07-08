import { useState, useEffect } from "react";
import { loadFaceModels } from "../../utils/faceApiLoader";
import FaceCamera from "./FaceCamera";
import "./FaceEnrollment.css";

export default function FaceEnrollment({ faceStatus, onEnrollSuccess }) {
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [enrollStatus, setEnrollStatus] = useState("idle");
    const [capturedDescriptor, setCapturedDescriptor] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const initModels = async () => {
            try {
                await loadFaceModels();
                setModelsLoaded(true);
            } catch (error) {
                console.error("Failed to load models:", error);
                alert("Failed to load face recognition models. Please refresh the page.");
            }
        };

        if (isEnrolling) {
            initModels();
        }
    }, [isEnrolling]);

    const handleFaceStatusChange = (status, descriptor) => {
        if (status === "face_detected" && descriptor && descriptor.length === 128) {
            setCapturedDescriptor(descriptor);
        } else {
            setCapturedDescriptor(null);
        }
    };

    const handleEnrollClick = () => {
        if (faceStatus?.face_enrolled) {
            const confirmReenroll = window.confirm(
                "You have already enrolled your face. Do you want to re-enroll?"
            );
            if (!confirmReenroll) return;
        }
        setIsEnrolling(true);
        setEnrollStatus("idle");
    };

    const handleCancelEnroll = () => {
        setIsEnrolling(false);
        setEnrollStatus("idle");
        setCapturedDescriptor(null);
    };

    const handleConfirmEnroll = async () => {
        if (!capturedDescriptor || capturedDescriptor.length !== 128) {
            alert("No valid face detected. Please ensure your face is clearly visible.");
            return;
        }

        setEnrollStatus("enrolling");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/face/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    face_descriptor: capturedDescriptor,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to enroll face");
            }

            setEnrollStatus("success");
            alert("Face enrolled successfully! You can now use face verification for attendance.");
            
            setTimeout(() => {
                setIsEnrolling(false);
                setEnrollStatus("idle");
                setCapturedDescriptor(null);
                if (onEnrollSuccess) onEnrollSuccess();
            }, 2000);
        } catch (error) {
            console.error("Enrollment error:", error);
            setEnrollStatus("failed");
            alert(error.message || "Failed to enroll face. Please try again.");
        }
    };

    return (
        <div className="face-enrollment-section">
            <div className="section-header">
                <h2 className="section-title">Face Recognition</h2>
                {faceStatus?.face_enrolled && (
                    <div className="enrolled-badge">
                        <span className="badge-icon">✅</span>
                        <span>Enrolled</span>
                    </div>
                )}
            </div>

            {faceStatus?.face_enrolled && (
                <div className="enrolled-info">
                    <p className="enrolled-message">
                        Your face was enrolled on{" "}
                        <strong>
                            {new Date(faceStatus.face_enrolled_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </strong>
                    </p>
                </div>
            )}

            {!isEnrolling ? (
                <button onClick={handleEnrollClick} className="enroll-btn">
                    {faceStatus?.face_enrolled ? "🔄 Re-enroll Face" : "📸 Register Face"}
                </button>
            ) : (
                <div className="enrollment-modal">
                    <div className="modal-content">
                        <h3 className="modal-title">Face Enrollment</h3>
                        <p className="modal-description">
                            Position your face in the center of the frame and hold still.
                        </p>

                        {modelsLoaded ? (
                            <FaceCamera onStatusChange={handleFaceStatusChange} />
                        ) : (
                            <div className="loading-models">
                                <div className="spinner"></div>
                                <p>Loading face recognition models...</p>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                onClick={handleCancelEnroll}
                                className="btn-secondary"
                                disabled={enrollStatus === "enrolling"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmEnroll}
                                className="btn-primary"
                                disabled={
                                    !capturedDescriptor ||
                                    capturedDescriptor.length !== 128 ||
                                    enrollStatus === "enrolling"
                                }
                            >
                                {enrollStatus === "enrolling" ? "Enrolling..." : "✓ Confirm Enrollment"}
                            </button>
                        </div>

                        {enrollStatus === "success" && (
                            <div className="status-message success">
                                Face enrolled successfully!
                            </div>
                        )}
                        {enrollStatus === "failed" && (
                            <div className="status-message error">
                                Enrollment failed. Please try again.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

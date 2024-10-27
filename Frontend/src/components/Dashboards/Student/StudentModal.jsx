import React, { useState, useEffect } from 'react';
import './StudentModal.css';
import { toast } from 'react-toastify'
import Loader from '../../../utilities/Loader/Loader'

function StudentModal({ onClose }) {

    const apiUrl = import.meta.env.VITE_API_URL;

    const notifyA = (e) => toast.error(e)
    const notifyB = (e) => toast.success(e)
    const [isEditable, setIsEditable] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const loginId = user ? user.id : null;
    const [studentInfo, setstudentInfo] = useState({
        name: '',
        email: '',
        loginId: loginId,
    });
    const [selectedImage, setSelectedImage] = useState('https://via.placeholder.com/100');

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleSave = () => {
        setIsEditable(false);
        handleUpdateStudent();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setstudentInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageClick = () => {
        if (isEditable) {
            document.getElementById('imageUpload').click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateStudent = () => {
        const formData = new FormData();
        const user = JSON.parse(localStorage.getItem('user'));
        const loginId = user ? user.id : null;
        if (!loginId) {
            alert("User is not logged in");
            return;
        }
        formData.append('name', studentInfo.name);
        formData.append('email', studentInfo.email);
        formData.append('_id', loginId);
        if (selectedImage && selectedImage !== 'https://via.placeholder.com/100') {
            const fileInput = document.getElementById('imageUpload');
            const file = fileInput.files[0];
            if (file) {
                formData.append('image', file);
            }
        }
        setShowLoading(true)
        fetch(`${apiUrl}/api/studentupdate`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setShowLoading(false)
                notifyB(data.message)
                setIsEditable(false);
            })
            .catch((error) => {
                setShowLoading(false)
                notifyA(error)
            });
    };

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setShowLoading(true)
                const user = JSON.parse(localStorage.getItem('user'));
                const id = user ? user.id : null;
                if (!id) {
                    alert("User is not logged in");
                    return;
                }
                const response = await fetch(`${apiUrl}/api/getstudent/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setShowLoading(false)
                    setstudentInfo({
                        name: data.name || 'John Doe',
                        email: data.email || 'johndoe@gmail.com',
                        loginId: data.id,
                    });
                    if (data.image) {
                        setSelectedImage(data.image);
                    }
                } else {
                    setShowLoading(false)
                }
            } catch (error) {
                setShowLoading(false)
            }
        };
        fetchStudentDetails();
    }, []);

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        setEmailInput(studentInfo.email)
    };

    const handleSendOtp = async () => {
        setShowLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput }),
            });
            const data = await response.json();
            setShowLoading(false);
            if (response.ok) {
                notifyB('OTP sent to your email');
                setOtpSent(true);
            } else {
                notifyA(data.message);
            }
        } catch (error) {
            setShowLoading(false);
            notifyA('Error sending OTP');
        }
    };

    const handleVerifyOtpAndChangePassword = async () => {
        setShowLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/forgotPassword/verify-otp-forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, otp: otpInput, newPassword }),
            });
            const data = await response.json();
            setShowLoading(false);
            if (response.ok) {
                notifyB(data.message);
                setShowForgotPassword(false);
            } else {
                notifyA(data.message);
            }
        } catch (error) {
            setShowLoading(false);
            notifyA(error.message);
        }
    };

    return (
        <div className="modal-overlay StudentModal">
            <div className="modal-content">
                {showLoading ? <Loader content={"Loading Student Details"}></Loader> : <>
                    {showForgotPassword && (
                        <div className="forgot-password-modal-overlay">
                            <div className="forgot-password-modal">
                                <button className="forgot-close-btn" onClick={() => setShowForgotPassword(false)}>
                                    &times;
                                </button>
                                <h2>Forgot Password</h2>
                                <div className="form-group">
                                    <label className='form-label'>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="Enter your email"
                                        readOnly="true"
                                    />
                                </div>
                                {otpSent && (
                                    <>
                                        <div className="form-group">
                                            <label className='form-label'>OTP</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                placeholder="Enter OTP"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className='form-label'>New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="form-group">
                                    {otpSent ? (
                                        <button className="save-btn forgot-save-btn" onClick={handleVerifyOtpAndChangePassword}>
                                            Submit New Password
                                        </button>
                                    ) : (
                                        <button className="save-btn forgot-save-btn" onClick={handleSendOtp}>
                                            Send OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="modal-header">
                        <h2 className="modal-title">Student Information</h2>
                        <button className="close-btn" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <img
                                src={selectedImage}
                                alt="Student"
                                className="rounded-circle"
                                style={{ cursor: isEditable ? 'pointer' : 'default' }}
                                onClick={handleImageClick}
                            />
                            <input
                                type="file"
                                id="imageUpload"
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <hr />

                        <div className="form-group">
                            <label className="form-label">Student ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={studentInfo.loginId}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Student Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={studentInfo.name}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Student Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={studentInfo.email}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </div>

                        <hr />

                        <div className="studentmodal-buttons">
                            <div className="buttons">
                                {!isEditable ? (
                                    <button className="edit-btn" onClick={handleEdit}>
                                        Edit
                                    </button>
                                ) : (
                                    <button className="save-btn" onClick={handleSave}>
                                        Save
                                    </button>
                                )}
                            </div>
                            <div className="buttons">
                                <button className="save-btn" onClick={handleForgotPasswordClick}>
                                    Forgot Password
                                </button>
                            </div>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
}

export default StudentModal
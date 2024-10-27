import React from "react";
import "./Login.css";
import l_img from "../../../assets/Login-svg.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './OtpPopup.css'
import Loader from "../../../utilities/Loader/Loader";
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import '../../Dashboards/Teacher/TeacherModal.css'

function Login() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const notifyA = (e) => toast.error(e);
    const notifyB = (e) => toast.success(e);
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passswordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    const [otpCode, setOtp] = useState(['', '', '', '']);
    const [otpPopupVisible, setOtpPopupVisible] = useState(false);
    const [OpenEye, setOpenEye] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [signup, setsignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [formData, setFormData] = useState({
        studentName: "",
        studentEmail: "",
        studentPassword: "",
    });

    const handlePasswordEye = (e) => {
        e.preventDefault();
        setOpenEye(!OpenEye);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    const handlesignup = () => {
        setsignup(!signup);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleOtpChange = (element, index) => {
        let newOtp = [...otpCode];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleSignup = async () => {
        if (!emailRegex.test(formData.studentEmail)) {
            notifyA("Invalid Email");
            return;
        } else if (!passswordRegex.test(formData.studentPassword)) {
            notifyA(
                "Password must contain at least 8 charcters, including at least 1 number and includes both lower and uppercase letters and special charcters for example #,?,@,!"
            );
            return;
        }
        try {
            setShowLoading(true)
            const response = await fetch(`${apiUrl}/api/student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                notifyB(data.message);
                setShowLoading(false)
                setOtpPopupVisible(true);
            } else {
                const errorData = await response.json();
                setShowLoading(false)
                notifyA(errorData.message);
            }
        } catch (error) {
            setShowLoading(false)
            notifyA(error);
        }
        setShowLoading(false)
    };

    const handleOtpSubmit = async () => {
        setShowLoading(true)
        const otp = otpCode.join('');
        if (otp.length === 4) {
            try {
                const response = await fetch(`${apiUrl}/api/student/verify-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        studentEmail: formData.studentEmail, // Add the email here
                        otp,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setShowLoading(false)
                    notifyB(data.message);
                    setOtpPopupVisible(false);
                    setsignup(false);
                } else {
                    const errorData = await response.json();
                    setShowLoading(false)
                    notifyA(errorData.message);
                }
            } catch (error) {
                setShowLoading(false)
                notifyA('An error occurred during OTP verification.');
            }
        } else {
            setShowLoading(false)
            notifyA('Please enter a valid 4-digit OTP.');
        }
    };

    const handleLogin = async () => {
        if (!emailRegex.test(email)) {
            notifyA("Invalid Email");
            return;
        }
        try {
            setShowLoading(true)
            const response = await fetch(`${apiUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                setShowLoading(false)
                notifyB(data.message);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                if (data.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else if (data.user.role === "teacher") {
                    navigate("/teacher-dashboard");
                } else {
                    navigate("/student-dashboard");
                }
            } else {
                const errorData = await response.json();
                setShowLoading(false)
                notifyA(errorData.message);
            }
        } catch (error) {
            setShowLoading(false)
            notifyA("An Error Occured during login");
        }
        setShowLoading(false)
    };

    const returnHome = () => {
        navigate("/");
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            const user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            localStorage.setItem('user', JSON.stringify(user));
            setShowLoading(false);
            navigate('/student-dashboard');
        } else {
            setShowLoading(false);
        }
        setShowLoading(false)
    }, [navigate]);

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
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
            notifyA('Error verifying OTP');
        }
    };

    return (
        <div className="login-main">
            {showLoading ? <Loader content={"Processing ! Wait.."}></Loader > : <>
                <nav>
                    <h1>CodeQuest</h1>
                    <i class="ri-home-5-fill" onClick={returnHome}></i>
                </nav>
                <div className="login-content">
                    <div className="login-container">
                        <div className="l-left">
                            <img src={l_img} alt="" />
                        </div>
                        <div className="l-right">
                            {signup ? (
                                <>
                                    {" "}
                                    <div className="l-right-heading">
                                        <h1>Welcome</h1>
                                        <p>
                                            To keep connected with us please Sign up with your personal
                                            information 🔔
                                        </p>
                                    </div>
                                    <div className="l-right-input">
                                        <div className="login-input">
                                            <i class="ri-user-line"></i>{" "}
                                            <input
                                                type="text"
                                                placeholder="Enter Your name"
                                                name="studentName"
                                                value={formData.studentName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="login-input">
                                            <i class="ri-mail-unread-line"></i>{" "}
                                            <input
                                                type="email"
                                                placeholder="Enter email"
                                                name="studentEmail"
                                                value={formData.studentEmail}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="login-input">
                                            <i class="ri-lock-2-line"></i>{" "}
                                            <input
                                                type="passsword"
                                                placeholder="Enter password"
                                                name="studentPassword"
                                                value={formData.studentPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="login-buttons">
                                            <button onClick={handleSignup}>Sign Up</button>
                                            <button onClick={handlesignup}>
                                                <i class="ri-corner-down-left-line"></i>
                                            </button>
                                        </div>
                                    </div>{" "}
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <div className="l-right-heading">
                                        <h1>Welcome Back</h1>
                                        <p>
                                            To keep connected with us please login with your personal
                                            information by email addrress and password 🔔
                                        </p>
                                    </div>
                                    <div className="l-right-input">
                                        <div className="login-input">
                                            <i class="ri-mail-unread-line"></i>{" "}
                                            <input
                                                type="email"
                                                placeholder="email"
                                                value={email}
                                                autofocus="true"
                                                required="true"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="login-input">
                                            <i class="ri-lock-2-line"></i>{" "}
                                            <input
                                                type={OpenEye ? "text" : "password"}
                                                placeholder="password"
                                                value={password}
                                                autofocus="true"
                                                required="true"
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span onClick={handlePasswordEye} className="eye">
                                                {OpenEye ? (
                                                    <i class="ri-eye-line"></i>
                                                ) : (
                                                    <i class="ri-eye-close-line"></i>
                                                )}
                                            </span>
                                        </div>
                                        {showForgotPassword && (
                                            <div className="forgot-password-modal-overlay">
                                                <div className="forgot-password-modal">
                                                    <button className="forgot-close-btn" onClick={() => setShowForgotPassword(false)}>
                                                        &times;
                                                    </button>
                                                    <h2>Forgot Password</h2>
                                                    <div className="login-input">
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            value={emailInput}
                                                            onChange={(e) => setEmailInput(e.target.value)}
                                                            placeholder="Enter your email"
                                                        />
                                                    </div>
                                                    {otpSent && (
                                                        <>
                                                            <div className="login-input">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={otpInput}
                                                                    onChange={(e) => setOtpInput(e.target.value)}
                                                                    placeholder="Enter OTP"
                                                                />
                                                            </div>
                                                            <div className="login-input">
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
                                                    <div className="login-buttons">
                                                        {otpSent ? (
                                                            <button className="save-btn forgot-save-btn" onClick={handleVerifyOtpAndChangePassword}>
                                                                Submit
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
                                        <div className="R-F">
                                            <span onClick={handleForgotPasswordClick} className="forgot-password">Forgot Password ?</span>
                                        </div>
                                        <div className="login-buttons">
                                            <button onClick={handleLogin}>Login</button>
                                            <button onClick={handlesignup}>Sign Up</button>
                                        </div>
                                    </div>{" "}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {otpPopupVisible && (
                    <div className="otp-popup-container">
                        <div className="otp-popup">
                            <h2>Enter OTP</h2>
                            <div className="otp-inputs">
                                {otpCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            <button onClick={handleOtpSubmit}>Submit OTP</button>
                        </div>
                    </div>
                )}
            </>}
        </div>
    );
}

export default Login;

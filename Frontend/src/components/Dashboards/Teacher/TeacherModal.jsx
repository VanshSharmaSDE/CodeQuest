import React, { useState, useEffect } from 'react';
import './TeacherModal.css';
import { toast } from 'react-toastify'
import Loader from '../../../utilities/Loader/Loader';

const TeacherModal = ({ onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const notifyA = (e) => toast.error(e)
  const notifyB = (e) => toast.success(e)

  const [isEditable, setIsEditable] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to manage forgot password modal
  const [emailInput, setEmailInput] = useState(''); // Email input
  const [otpSent, setOtpSent] = useState(false); // Flag to check if OTP is sent
  const [otpInput, setOtpInput] = useState(''); // OTP input
  const [newPassword, setNewPassword] = useState(''); // New password input

  const user = JSON.parse(localStorage.getItem('user')); // Assuming 'user' is stored as an object in localStorage
  const loginId = user ? user.id : null; // Replace 'id' with the correct key for the loginId
  // State for the form fields
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    email: '',
    loginId: loginId,
    // password: '',
  });


  // State for the image preview
  const [selectedImage, setSelectedImage] = useState('https://via.placeholder.com/100');

  // Handle the Edit button click
  const handleEdit = () => {
    setIsEditable(true);
  };

  // Handle the Save button click
  const handleSave = () => {
    setIsEditable(false); // Set back to non-editable mode
    handleUpdateTeacher();
  };

  // Handle input change for editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image click to trigger file input
  const handleImageClick = () => {
    if (isEditable) {
      document.getElementById('imageUpload').click();
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTeacher = () => {
    setShowLoading(true)
    const formData = new FormData();

    // Get loginId from localStorage inside the user object
    const user = JSON.parse(localStorage.getItem('user')); // Assuming 'user' is stored as an object in localStorage
    const loginId = user ? user.id : null; // Replace 'id' with the correct key for the loginId

    if (!loginId) {
      alert("User is not logged in");
      return;
    }

    // Append all the teacher's information to the formData
    formData.append('name', teacherInfo.name);
    formData.append('email', teacherInfo.email);
    formData.append('_id', loginId); // Use loginId from localStorage
    // formData.append('password', teacherInfo.password);


    // If the selected image is a file, append it to the formData
    if (selectedImage && selectedImage !== 'https://via.placeholder.com/100') {
      const fileInput = document.getElementById('imageUpload');
      const file = fileInput.files[0];
      if (file) {
        formData.append('image', file); // Append the image file
      }
    }

    // Make the API call using fetch
    fetch(`${apiUrl}/api/teacherupdate`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setShowLoading(false)
        setIsEditable(false); // Set back to non-editable mode after a successful save
        notifyB(data.message)
      })
      .catch((error) => {
        setShowLoading(false)
        notifyA(error)
      });
  };

  useEffect(() => {
    // Fetch teacher details from the backend
    const fetchTeacherDetails = async () => {
      setShowLoading(true)
      try {
        // Assuming loginId is stored in localStorage as user.id
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user ? user.id : null;

        if (!id) {
          alert("User is not logged in");
          return;
        }

        const response = await fetch(`${apiUrl}/api/getteacher/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTeacherInfo({
            name: data.name || 'John Doe',
            email: data.email || 'johndoe@gmail.com',
            loginId: data.id,
          });

          // Set the image if available
          if (data.image) {
            setShowLoading(false)
            setSelectedImage(data.image);
          }
        } else {
          setShowLoading(false)
          console.error("Error fetching teacher details:", data.message);
        }
      } catch (error) {
        setShowLoading(false)
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchTeacherDetails();
  }, []);

  //Forgot Password login  

  // Handle "Forgot Password" button click
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setEmailInput(teacherInfo.email)
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
        notifyB('Password updated successfully');
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
    <div className="modal-overlay TeacherModal">
      <div className="modal-content">
        {showLoading ? <Loader content={"Loading Teacher Info ..."}></Loader> : <>
          {/* Forgot Password Modal */}
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
            <h2 className="modal-title">Teacher Information</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {/* Teacher Photo */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img
                src={selectedImage}
                alt="Teacher"
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

            {/* Teacher Login ID (non-editable) */}
            <div className="form-group">
              <label className="form-label">Login ID</label>
              <input
                type="text"
                className="form-control"
                value={teacherInfo.loginId}
                readOnly
              />
            </div>

            {/* Teacher Name */}
            <div className="form-group">
              <label className="form-label">Teacher Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={teacherInfo.name}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>

            {/* Teacher Email */}
            <div className="form-group">
              <label className="form-label">Teacher Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={teacherInfo.email}
                onChange={handleChange}
                readOnly={!isEditable}
              />
            </div>
            <hr />
            <div className="teachermodal-button">
              {/* Buttons */}
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

              {/* Buttons */}
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
  );
};

export default TeacherModal;

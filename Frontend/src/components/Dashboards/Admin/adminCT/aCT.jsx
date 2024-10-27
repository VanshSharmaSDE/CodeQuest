import React from 'react'
import { useState } from 'react';

function aCT() {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Initialize state for all inputs
    const [formData, setFormData] = useState({
        teacherName: '',
        teacherEmail: '',
        teacherPassword: '',
    });

    // Handle input change for all fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle button click to submit data
    const handleClick = async () => {
        // Send data to backend
        try {
            const response = await fetch(`${apiUrl}/api/teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Data sent successfully!');
                console.log(response.data)
                // Clear the input fields
                setFormData({
                    teacherName: '',
                    teacherEmail: '',
                    teacherPassword: '',
                });
            } else {
                console.error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };
    return (
            <div className="A_D1-calories">
                <h2>Add Teacher</h2>
                <div className="teacher-input">
                    <div className="login-input"><i class="ri-user-line"></i> <input type="text" placeholder='name' name="teacherName"
                        value={formData.teacherName}
                        onChange={handleChange} /></div>
                    <div className="login-input"><i class="ri-mail-unread-line"></i> <input type="email" placeholder='email' name="teacherEmail"
                        value={formData.teacherEmail}
                        onChange={handleChange} /></div>
                    <div className="login-input"><i class="ri-lock-2-line"></i> <input type="passsword" placeholder='password' name="teacherPassword"
                        value={formData.teacherPassword}
                        onChange={handleChange} /></div>
                    <div className="login-buttons-admin">
                        <button onClick={handleClick}>Add Teacher +</button>
                    </div>
                </div>
            </div>
    )
}

export default aCT
import React from 'react';
import './Contact.css';
import ContactAnimation from '../../../utilities/Animations/ContactAnimation';
import { Link } from 'react-router-dom';

function Contact() {
    ContactAnimation();
    return (
        <div className="c-main">
            <div className="c-background" id='contact'>
                <div className="c-main-left" id='contact'>
                    <i className="ri-code-s-slash-fill"></i>
                    <h1 className='contact'>Contact Us</h1>
                    <p className='contact-para'>
                        Have questions or need assistance? We're here to help! Our team is dedicated to providing you with all the support and information you need. Don't hesitate to reach out for any inquiries.
                    </p>
                    <p className='contact-para'>
                        Whether it's feedback, support, or a request to create a competition, we're just a message away. We look forward to hearing from you and assisting in any way we can.
                    </p>
                </div>
                <div className="c-main-right">
                    <Link to={'/contact#Help'}>
                        <div className="c-main-box-1 box" id='contact'>
                            <h1>01</h1>
                            <h2>Help !!</h2>
                            <p>If you need help or guidance, feel free to get in touch. We're ready to assist with any issues or concerns.</p>
                        </div>
                    </Link>
                    <Link to={'/contact#Feedback'}>
                        <div className="c-main-box-2 box" id='contact'>
                            <h1>02</h1>
                            <h2>Feedback</h2>
                            <p>Your feedback is valuable to us. Let us know what we're doing right and what we can improve.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Contact;

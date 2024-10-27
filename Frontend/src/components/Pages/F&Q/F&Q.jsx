import React, { useState } from 'react'
import './F&Q.css'

function FQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        if (openIndex === index) {
            setOpenIndex(null); // Close if clicked again
        } else {
            setOpenIndex(index); // Open the clicked FAQ
        }
    };

    const faqs = [
        {
            question: 'How do teachers create and manage competitions?',
            answer: 'Teachers can create powerful competitions with various types of questions, including coding challenges and multiple-choice questions. They also have full control over competition settings.'
        },
        {
            question: 'How are answers checked automatically?',
            answer: 'Our platform automatically checks answers for multiple-choice questions and evaluates coding solutions in real-time across multiple programming languages.'
        },
        {
            question: 'What security features are implemented?',
            answer: 'The platform uses secure OTP-based login and includes anti-cheating measures like full-screen mode, disabled shortcuts, and monitoring features.'
        },
        {
            question: 'Is there support for multiple programming languages?',
            answer: 'Yes, students can submit coding solutions in a variety of programming languages, including Python, Java, C++, and more.'
        },
        {
            question: 'What are the features of the student dashboard?',
            answer: 'The student dashboard provides an overview of ongoing competitions, submitted answers, results, and a list of upcoming challenges.'
        },
        {
            question: 'Does the platform support dark mode?',
            answer: 'Yes, the platform supports dark mode, allowing users to switch between light and dark themes for a better user experience.'
        },
        {
            question: 'How is the winner calculated?',
            answer: 'Once the competition ends, the platform automatically calculates the winners based on the accuracy and submission time of the answers.'
        },
        {
            question: 'What control does the admin have?',
            answer: 'Admins have full control over user management, competition settings, and overall platform security, including allowing or disallowing specific students from competitions.'
        },
        {
            question: 'Is there a help section or FAQ for users?',
            answer: 'Yes, users can access the FAQ and help section for answers to common questions and issues related to competitions, submissions, and results.'
        }
    ];
    return (
        <div className="faq-section">
            <h2 className="faq-title">FAQ</h2>
            <h1 className="faq-heading">Frequently Asked Questions</h1>
            <p className="faq-subheading">For any other questions, please feel free to contact us.</p>

            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            <span>{faq.question}</span>
                            <span className={`faq-arrow ${openIndex === index ? 'rotate' : ''}`}><i class="ri-arrow-down-s-line"></i></span>
                        </div>
                        {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FQ
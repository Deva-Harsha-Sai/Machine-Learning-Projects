import React, { useState } from 'react';
import axios from 'axios';
import './PredictionForm.css';
import { FaMoon, FaSun } from 'react-icons/fa';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    previous_score: '',
    time_left: 30,
    subject_importance: ''
  });

  const [prediction, setPrediction] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (e) => {
    setFormData({
      ...formData,
      time_left: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(response.data.predicted_learning_style);
    } catch (error) {
      console.error('There was an error making the request', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div className={`form-container ${darkMode ? 'dark-mode' : ''}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      <h1>Student Learning Pattern Advisor</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Student ID:</label>
          <input type="number" name="student_id" value={formData.student_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <select name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="" disabled>Select a subject</option>
            {['Mathematics', 'Science', 'History', 'English', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Economics', 'Computer Science'].map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Previous Score:</label>
          <input type="number" name="previous_score" value={formData.previous_score} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Study Hours:</label>
          <input type="range" name="time_left" min="3" max="99" value={formData.time_left} onChange={handleSliderChange} />
          <span>{formData.time_left}</span>
        </div>
        <div className="form-group">
          <label>Subject Importance Rating:</label>
          <select name="subject_importance" value={formData.subject_importance} onChange={handleChange} required>
            <option value="" disabled>Rate the subject</option>
            {[1, 2, 3, 4, 5].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {prediction && <h2>The Advised Learning Pattern is: {prediction}</h2>}
    </div>
  );
};

export default PredictionForm;

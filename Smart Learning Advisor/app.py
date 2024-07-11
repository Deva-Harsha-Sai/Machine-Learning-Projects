from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React frontend

# Load the trained model and encoders
rf_model = pickle.load(open('rf_model.pkl', 'rb'))
label_encoder_subject = pickle.load(open('label_encoder_subject.pkl', 'rb'))
label_encoder_learning_style = pickle.load(open('label_encoder_learning_style.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    student_id = data['student_id']
    subject = data['subject']
    previous_score = data['previous_score']
    time_left = data['time_left']
    subject_importance = data['subject_importance']

    # Encode the subject
    encoded_subject = label_encoder_subject.transform([subject])[0]

    # Create DataFrame for the custom input
    custom_input = pd.DataFrame({
        'Student ID': [student_id],
        'Subject': [encoded_subject],
        'Previous Score': [previous_score],
        'Time Left': [time_left],
        'Subject Importance': [subject_importance]
    })

    # Predict the learning pattern using the trained model
    prediction = rf_model.predict(custom_input)
    predicted_learning_style = label_encoder_learning_style.inverse_transform(prediction)[0]

    return jsonify({
        'predicted_learning_style': predicted_learning_style
    })

if __name__ == '__main__':
    app.run(debug=True)

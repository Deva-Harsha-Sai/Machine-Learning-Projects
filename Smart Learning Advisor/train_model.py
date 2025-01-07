import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pickle

# Load your dataset
df = pd.read_csv('student_learning_data_cleaned.csv')

# Encode categorical features
label_encoder_subject = LabelEncoder()
df['Subject'] = label_encoder_subject.fit_transform(df['Subject'])

label_encoder_learning_style = LabelEncoder()
df['Preferred Learning Style'] = label_encoder_learning_style.fit_transform(df['Preferred Learning Style'])

# Define feature columns and target column
feature_columns = ['Student ID', 'Subject', 'Previous Score', 'Time Left', 'Subject Importance']
target_column = 'Preferred Learning Style'

# Split the data into features and target
X = df[feature_columns]
y = df[target_column]

# Train-Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save the trained model and encoders
with open('rf_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

with open('label_encoder_subject.pkl', 'wb') as f:
    pickle.dump(label_encoder_subject, f)

with open('label_encoder_learning_style.pkl', 'wb') as f:
    pickle.dump(label_encoder_learning_style, f)

print("Model and encoders have been saved.")
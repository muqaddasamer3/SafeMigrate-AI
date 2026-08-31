"""
SafeMigrate AI - Scam Classifier (Advanced AI Component)
TF-IDF + Multinomial Naive Bayes text classifier, trained on labeled
scam vs genuine job-offer messages. Used alongside the rule-based
risk_engine.py signals for a hybrid, more accurate risk assessment.

Run this file directly to (re)train the model:
    python classifier.py
"""

import os
import csv
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scam_classifier.pkl")


def load_training_data():
    texts, labels = [], []
    path = os.path.join(DATA_DIR, "training_messages.csv")
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            texts.append(row["text"])
            labels.append(row["label"])
    return texts, labels


def train_model():
    """Train the classifier and save it to disk. Prints evaluation metrics."""
    texts, labels = load_training_data()

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.25, random_state=42, stratify=labels
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("clf", MultinomialNB()),
    ])

    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    print("Test accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))

    # Retrain on full dataset for the saved production model
    pipeline.fit(texts, labels)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    return pipeline


def load_model():
    if not os.path.exists(MODEL_PATH):
        print("No saved model found - training a new one...")
        return train_model()
    return joblib.load(MODEL_PATH)


_MODEL = None


def get_model():
    global _MODEL
    if _MODEL is None:
        _MODEL = load_model()
    return _MODEL


def classify_text(text: str):
    """Returns (label, confidence) e.g. ('scam', 0.87)"""
    model = get_model()
    proba = model.predict_proba([text])[0]
    classes = model.classes_
    best_idx = proba.argmax()
    return classes[best_idx], round(float(proba[best_idx]), 2)


if __name__ == "__main__":
    train_model()
    

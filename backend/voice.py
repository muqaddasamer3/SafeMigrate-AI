import whisper
import tempfile
import os

_model = None


def get_model():
    global _model
    if _model is None:
        _model = whisper.load_model("base")
    return _model


def extract_text_from_audio_bytes(audio_bytes: bytes, suffix: str = ".mp3") -> str:
    """Takes raw audio bytes (voice note/recording) and returns transcribed text."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        model = get_model()
        result = model.transcribe(tmp_path)
        return result["text"].strip()
    finally:
        os.remove(tmp_path)


if __name__ == "__main__":
    with open("test_audio1.mp3", "rb") as f:
        audio_bytes = f.read()
    text = extract_text_from_audio_bytes(audio_bytes)
    print("----- TRANSCRIBED TEXT -----")
    print(text)
from pydantic import BaseModel
from typing import List, Optional


class Content(BaseModel):
    id: str
    title: str
    markdown: str
    nextId: Optional[str] = None
    previousId: Optional[str] = None

class Voice(BaseModel):
    id: str
    name: str


class Language(BaseModel):
    code: str
    name: str


class TextToSpeechRequest(BaseModel):
    text: str
    voiceId: str


class TextToSpeechResponse(BaseModel):
    audioUrl: str


class SpeechToTextResponse(BaseModel):
    text: str
    audioUrl: str


class TranslationRequest(BaseModel):
    text: str
    targetLanguage: str
    voiceId: str


class TranslationResponse(BaseModel):
    audioUrl: str
    translatedText: str



# ==================================



voices = [
    Voice(id="ash", name="Ash (Male)"),
    Voice(id="alloy", name="Alloy (Male)"),
    Voice(id="nova", name="Nova (Female)"),
    Voice(id="onyx", name="Onyx (Male)"),
    Voice(id="echo", name="Echo (Male)"),
    Voice(id="fable", name="Fable (Female)"),
    Voice(id="shimmer", name="Shimmer (Female)"),
    Voice(id="sage", name="Sage (Male)"),
    Voice(id="coral", name="Coral (Female)"),
    Voice(id="verse", name="Verse (Male)"),
    Voice(id="ballad", name="Ballad (Female)")
]


languages = [
    Language(code="English", name="English"),
    Language(code="Hindi", name="Hindi"),
    Language(code="Bengali", name="Bengali"),
    Language(code="Assamese", name="Assamese"),
    Language(code="Telugu", name="Telugu"),
    Language(code="Marathi", name="Marathi"),
    Language(code="Tamil", name="Tamil"),
    Language(code="Gujarati", name="Gujarati"),
    Language(code="Urdu", name="Urdu"),
    Language(code="Malayalam", name="Malayalam"),
    Language(code="Kannada", name="Kannada"),
    Language(code="Odia", name="Odia"),
    Language(code="Punjabi", name="Punjabi"),
]


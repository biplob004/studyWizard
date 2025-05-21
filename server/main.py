from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form, Query
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
import shutil

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from variables import *
from functions import *

app = FastAPI()

# Initialize OpenAI llm_client
llm_client = OpenAI()  

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a directory for audio files if it doesn't exist
os.makedirs("audio_files", exist_ok=True)

# Mount the directory for serving audio files
app.mount("/audio", StaticFiles(directory="audio_files"), name="audio")


# Function to generate speech using OpenAI
def generate_speech(text, voice="ash"):
    try:
        # Generate a unique filename
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join("audio_files", filename)
        
        response = llm_client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=text
        )
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return filename
    except Exception as e:
        print(f"Error generating speech: {e}")
        return None

# API Endpoints

BASE_DIR = os.environ.get("COURSE_FILES_DIR", "courses") # not to use ./ at starting and not to use / at the end of this 

@app.get("/api/courses")
async def get_courses(path: str = Query("", description="Relative path to browse")):
    """
    Get a list of files and folders at the specified path.
    If a text file is selected, its content will be returned.
    """
    try:
        # Sanitize path to prevent directory traversal attacks
        safe_path = os.path.normpath(os.path.join(BASE_DIR, path))

        print('----file path ', safe_path)
        
        # Make sure we're still within the base directory
        if not safe_path.startswith(BASE_DIR):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # If path points to a file, return its content
        if os.path.isfile(safe_path) and safe_path.endswith('.txt'):
            try:
                with open(safe_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                file_name = os.path.basename(safe_path)
                return {
                    "items": [],
                    "file": {
                        "name": file_name,
                        "path": os.path.relpath(safe_path, BASE_DIR),
                        "type": "file",
                        "content": content
                    }
                }
            except Exception as e:
                print('---errr-', e)
                raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
            
        
        # If path points to a directory, list its contents
        if os.path.isdir(safe_path):
            items = []
            for entry in os.scandir(safe_path):
                entry_type = "folder" if entry.is_dir() else "file"
                # Only include .txt files
                if entry_type == "file" and not entry.name.endswith('.txt'):
                    continue
                    
                rel_path = os.path.relpath(entry.path, BASE_DIR)
                items.append({
                    "name": entry.name,
                    "path": rel_path,
                    "type": entry_type
                })
            
            # Sort items: folders first, then files
            items.sort(key=lambda x: (0 if x["type"] == "folder" else 1, x["name"]))
            
            return {"items": items}
        
        raise HTTPException(status_code=404, detail="Path not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    

@app.get("/content", response_model=Content)
async def get_content(course_path: str, content_id: str='intro'):
    """Get a specific content by ID from a file at the given URL."""

    # print(content_id,'============>>', course_path)

    content_file_path = f'{BASE_DIR}/{course_path}'
    contents = process_single_file(content_file_path)
    contents[0].id='intro'
    contents[1].previousId='intro'

    for content in contents:
        if content.id == content_id:
            return content
    raise HTTPException(status_code=404, detail="Content not found")
    


@app.post("/text-to-speech", response_model=TextToSpeechResponse)
async def convert_text_to_speech(request: TextToSpeechRequest, background_tasks: BackgroundTasks):
    '''Read aloud the selected text in selected language, after translation'''
    if len(request.text)>1000:
        raise HTTPException(status_code=400, detail="Too large text length, to process")
     
    try:
        # Generate the speech file
        filename = generate_speech(request.text, request.voiceId)
        
        if not filename:
            raise HTTPException(status_code=500, detail="Failed to generate speech")
        
        return {"audioUrl": f"{os.environ.get('server_base_url')}/audio/{filename}"}
    except Exception as e:
        # print('================', e)
        raise HTTPException(status_code=500, detail=f"Error in text-to-speech conversion: {str(e)}")

@app.post("/speech-to-text", response_model=SpeechToTextResponse)
async def convert_speech_to_text( audio: UploadFile = File(...), selectedText: str = Form(None), language: str = Form(None), voiceId: str = Form(None)):
    '''
    Reading practice api:
        User reads a sentence and pass the audio to api
        Audio will transcribe to text, and pass to llm to validate the answer, 
        That llm response will be generate into audio and send to user, so user can listen the feedback of his reading.
    '''

    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{uuid.uuid4()}_{audio.filename}"
        
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        temp_file_path = convert_webm_to_mp3(temp_file_path)

        if get_audio_duration(temp_file_path) > 120:
            raise HTTPException(status_code=404, detail="Audio duration can not be more than 2 minutes.")

        # Process the audio file with OpenAI
        with open(temp_file_path, "rb") as audio_file:
            transcription = llm_client.audio.transcriptions.create(
                model="gpt-4o-transcribe", 
                file=audio_file
            )
        
        # Clean up the temporary file
        os.remove(temp_file_path)

        # print(selectedText, '-----------',transcription.text)
        llm_response_text = reading_validator(llm_client, original_sentence=selectedText, sentence_read=transcription.text, language=language)
        filename = generate_speech(llm_response_text, voiceId)
        
        return {"text": llm_response_text, "audioUrl": f"{os.environ.get('server_base_url')}/audio/{filename}"}
    
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Error in speech-to-text conversion: {str(e)}")

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    '''Input text output audio, after doing translation for desired language'''
    if len(request.text)>1000:
        raise HTTPException(status_code=400, detail="Too large text to be translated ! Please try with less text.")

    try:
        translated_text = translator(llm_client, request.text, request.targetLanguage)
        
        # Generate speech for the translated text
        filename = generate_speech(translated_text, request.voiceId) 
        
        if not filename:
            raise HTTPException(status_code=500, detail="Failed to generate speech for translation")
        
        return {
            "audioUrl": f"{os.environ.get('server_base_url')}/audio/{filename}",
            "translatedText": translated_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in translation: {str(e)}")

@app.get("/voices", response_model=List[Voice])
async def get_voices():
    return voices

@app.get("/languages", response_model=List[Language])
async def get_languages():
    return languages






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



# uvicorn main:app --reload
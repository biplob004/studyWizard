
import ffmpeg, os
from variables import Content
from pydub import AudioSegment


def process_single_file(file_path):
    """
    File path to course data :
        Process a single file containing multiple content sections separated by '---'.
        Each section's first line is the title, and the rest is markdown content.
        Returns a list of Content objects with proper ID, next and prev links.
    """
    with open(file_path, 'r') as f:
        lines = f.readlines()

    raw_sections = []
    current_section = []
        
    for line in lines:
        if line.strip() == '---':
            # If we encounter a standalone separator line
            if current_section:  # If there's content in the current section
                raw_sections.append(''.join(current_section).strip())
                current_section = []  # Reset for the next section
        else:
            # Add this line to the current section
            current_section.append(line)
            
    # Don't forget to add the last section if there is one
    if current_section:
        raw_sections.append(''.join(current_section).strip())
        
    # Filter out empty sections
    raw_sections = [section for section in raw_sections if section]

    
    content_objects = []
    base_id = os.path.splitext(os.path.basename(file_path))[0]
    
    for i, section in enumerate(raw_sections):
        lines = section.strip().splitlines()
        
        # First line is the title
        title = lines[0].strip() if lines else "Untitled"
        
        # Rest is markdown content
        markdown = "\n\n".join([part.strip() for part in "\n".join(lines[1:]).split("\n\n") if part.strip()])
        
        # Generate ID from base file name and section index
        content_id = f"{base_id}-{i+1}"
        
        # Calculate next and prev IDs
        next_id = f"{base_id}-{i+2}" if i < len(raw_sections) - 1 else None
        prev_id = f"{base_id}-{i}" if i > 0 else None
        
        # Create Content object
        content = Content(
            id=content_id,
            title=title,
            markdown=markdown,
            nextId=next_id,
            previousId=prev_id
        )
        
        content_objects.append(content)
    
    return content_objects



def convert_webm_to_mp3(input_file):
    """Input file webm, convert to mp3 and output filepath of the mp3 file"""

    output_file = input_file.replace('.webm', '.mp3')
    
    try:
        # Convert webm to mp3
        stream = ffmpeg.input(input_file)
        stream = ffmpeg.output(stream, output_file, acodec='libmp3lame', ab='192k')
        ffmpeg.run(stream, overwrite_output=True)
        os.remove(input_file)
        print(f"Successfully converted {input_file} to {output_file}")
    except ffmpeg.Error as e:
        print(f"Error occurred: {e.stderr.decode()}")
    
    return output_file

def translator(llm_client, sentence, language):
    """"Using LLM model translate input sentence for the given language"""
    response = llm_client.chat.completions.create(
        model="gpt-4o",  
        messages=[
            {"role": "user", "content": f"""You are a professional translator specializing in {language}. Your task is to accurately translate any text the user provides into {language}, preserving the original meaning, tone, and context as closely as possible. When translating:

            1. Maintain the appropriate level of formality
            2. Consider cultural nuances and idioms
            3. Preserve formatting elements when present
            4. If certain terms should remain untranslated (like names or technical terms), keep them in the original language
            5. If a phrase has multiple possible translations, choose the most contextually appropriate one
            6. Fix the typo if possible before generation of the translation

            Respond only with the translation without additional explanations:
            
            Here is the sentence to be translated to {language}
            => "{sentence}"

            """},
        ],
        max_tokens=512,
   
    )

    return response.choices[0].message.content



def reading_validator(llm_client, original_sentence, sentence_read, language):
    '''Pass original text and user read text, and compare both text for accuracy of reading, then output llm feedback'''

    system_msg = f'''You are a supportive reading tutor designed to help beginning readers practice their skills. Your task is to:

    1. Compare what the user reads (their input) with the original sentence they were supposed to read
    2. Provide encouraging, age-appropriate feedback that:
    - Highlights what they read correctly
    - Gently points out any words they misread, skipped
    - Maintains a positive, supportive tone even when corrections are needed

    3. If they read the entire sentence correctly, offer enthusiastic congratulations
    4. Output the response in {language}, no matter what the language of input sentence, But for refering sentences whats correct or mistake you can use original language.
    5. User's native language is {language}, its users mother language.
    6. Ignore the comma and full stops, just focus on words are pronouncing correctly or not.
    7. Output response should be complete with minimum words which is very less talking for the feedback.

    Format your response in clear, simple language appropriate for new readers. Always maintain an encouraging tone that builds confidence while helping them improve.
    '''
    response = llm_client.chat.completions.create(
        model="gpt-4.1-mini",  
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": f"Here is the original sentence: \n{original_sentence} \n\nAnd here is the user read sentence:\n{sentence_read}\nPlease response appropriatly, your response should be mix of original language and {language} language."},
        ],
        max_tokens=120,
        temperature=0.7
    )

    return response.choices[0].message.content


def get_audio_duration(mp3_path):
    """
    Calculate the duration of an MP3 file in seconds.
    
    Args:
        mp3_path (str): Path to the MP3 file
        
    Returns:
        float: Duration of the audio in seconds
    """


    try:
        # Load the audio file
        audio = AudioSegment.from_mp3(mp3_path)
        
        # Get duration in milliseconds and convert to seconds
        duration_seconds = len(audio) / 1000.0
        
        return duration_seconds
    except Exception as e:
        print(f"Error processing {mp3_path}: {str(e)}")
        return None
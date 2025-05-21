import axios from 'axios';
import { Content, TextToSpeechResponse, SpeechToTextResponse, TranslationResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create  cache object 
const ttsCache: Record<string, TextToSpeechResponse> = {};
const translationCache: Record<string, TranslationResponse> = {};

const api = axios.create({
  baseURL: API_URL,
});

export const fetchContent = async (course_path: string, contentId: string): Promise<Content> => {
  const response = await api.get<Content>(`/content?course_path=${course_path}.txt&content_id=${contentId}`);
  return response.data;
};

export const fetchAllContents = async (): Promise<Content[]> => {
  const response = await api.get<Content[]>('/content');
  return response.data;
};



export const textToSpeech = async (text: string, voiceId: string): Promise<TextToSpeechResponse> => {
  // // Listen selected text
  const cacheKey = `${text}_${voiceId}`;
  
  // Check if we have a cached response for this text and voice combination
  if (ttsCache[cacheKey]) {
    console.log('Using cached TTS response');
    return ttsCache[cacheKey];
  }
  
  // If not cached, make the API call
  console.log('Making TTS API call');
  const response = await api.post<TextToSpeechResponse>('/text-to-speech', { text, voiceId });
  
  // Cache the response before returning it
  ttsCache[cacheKey] = response.data;
  
  return response.data;
};

export const speechToText = async (voiceId: string, language:string, text: string, audioBlob: Blob): Promise<SpeechToTextResponse> => {
  // // Reading practice , user read and practice reading, --> output audio and text response.
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('selectedText', text);
  formData.append('language', language);
  formData.append('voiceId', voiceId);
  
  const response = await api.post<SpeechToTextResponse>('/speech-to-text', formData);
  
  return response.data;
};


export const translateText = async (text: string, targetLanguage: string, voiceId: string): Promise<TranslationResponse> => {
  // // English to other language translation for the purpose of understanding the sentence.
  const cacheKey = `${text}_${targetLanguage}_${voiceId}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  const response = await api.post<TranslationResponse>('/translate', { text, targetLanguage, voiceId});
  translationCache[cacheKey] = response.data;
  return response.data;
};


export const fetchVoices = async () => {
  const response = await api.get('/voices');
  // console.log(response.data);
  return response.data;
};

export const fetchLanguages = async () => {
  const response = await api.get('/languages');
  return response.data;
};

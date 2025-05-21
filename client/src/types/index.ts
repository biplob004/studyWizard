export interface Content {
  id: string;
  title: string;
  markdown: string;
  previousId?: string;
  nextId?: string;
}

export interface Voice {
  id: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
}

export interface SpeechToTextResponse {
  text: string;
  audioUrl: string;
}

export interface TranslationResponse {
  audioUrl: string;
  translatedText: string;
}

/**
 * Mock Voice Service Abstraction
 * This can be replaced with Vapi or similar low-latency voice services.
 */

export interface VoiceAgentConfig {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onMessage?: (text: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class MockVoiceService {
  private isListening = false;
  private recognition: any = null;
  private synthesis = window.speechSynthesis;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  async start(config: VoiceAgentConfig) {
    if (!this.recognition) {
      config.onError?.("Speech recognition not supported in this browser.");
      return;
    }

    this.isListening = true;
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const isFinal = result.isFinal;
      config.onTranscript?.(text, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      config.onError?.(event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) this.recognition.start();
    };

    this.recognition.start();
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speak(text: string, onEnd?: () => void) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => onEnd?.();
    this.synthesis.speak(utterance);
  }

  cancelSpeech() {
    this.synthesis.cancel();
  }
}

export const voiceService = new MockVoiceService();

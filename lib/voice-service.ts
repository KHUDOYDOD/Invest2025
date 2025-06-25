import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '' 
});

export interface VoiceNotificationOptions {
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'success' | 'error';
  message: string;
  amount?: number;
  planName?: string;
}

export class VoiceService {
  private static instance: VoiceService;
  private audioCache = new Map<string, string>();

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  private generateMessage(options: VoiceNotificationOptions): string {
    const { type, message, amount, planName } = options;
    
    switch (type) {
      case 'deposit':
        return `Пополнение счета на сумму ${amount} долларов успешно выполнено. ${message}`;
      
      case 'withdrawal':
        return `Запрос на вывод ${amount} долларов принят к обработке. ${message}`;
      
      case 'investment':
        return `Инвестиция в размере ${amount} долларов в план "${planName}" успешно создана. ${message}`;
      
      case 'profit':
        return `Получена прибыль в размере ${amount} долларов. ${message}`;
      
      case 'success':
        return `Операция успешно завершена. ${message}`;
      
      case 'error':
        return `Произошла ошибка. ${message}`;
      
      default:
        return message;
    }
  }

  async generateSpeech(options: VoiceNotificationOptions): Promise<string | null> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.log('OpenAI API key not configured, skipping voice generation');
        return null;
      }

      const text = this.generateMessage(options);
      const cacheKey = `${options.type}-${text}`;
      
      // Проверяем кеш
      if (this.audioCache.has(cacheKey)) {
        return this.audioCache.get(cacheKey)!;
      }

      console.log('Generating speech for:', text);

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova", // Женский голос на русском
        input: text,
        response_format: "mp3"
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      const base64Audio = buffer.toString('base64');
      const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`;
      
      // Кешируем результат
      this.audioCache.set(cacheKey, audioDataUrl);
      
      return audioDataUrl;

    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  // Предзагрузка часто используемых фраз
  async preloadCommonPhrases() {
    const commonPhrases = [
      { type: 'success' as const, message: 'Операция выполнена успешно' },
      { type: 'error' as const, message: 'Произошла ошибка при выполнении операции' },
      { type: 'deposit' as const, message: 'Средства зачислены на ваш счет', amount: 1000 },
      { type: 'investment' as const, message: 'Ваша инвестиция активна', amount: 500, planName: 'Стартовый' }
    ];

    for (const phrase of commonPhrases) {
      await this.generateSpeech(phrase);
    }
  }

  clearCache() {
    this.audioCache.clear();
  }
}

export const voiceService = VoiceService.getInstance();
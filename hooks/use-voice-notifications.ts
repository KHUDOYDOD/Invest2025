import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceNotificationOptions } from '@/lib/voice-service';

export function useVoiceNotifications() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<VoiceNotificationOptions[]>([]);

  // Проверяем поддержку аудио при загрузке
  useEffect(() => {
    const checkAudioSupport = () => {
      try {
        const audio = new Audio();
        return !!audio.canPlayType && audio.canPlayType('audio/mp3') !== '';
      } catch {
        return false;
      }
    };

    setAudioEnabled(checkAudioSupport());
  }, []);

  const playVoiceNotification = useCallback(async (options: VoiceNotificationOptions) => {
    if (!audioEnabled) {
      console.log('Audio not supported or disabled');
      return;
    }

    try {
      setIsPlaying(true);

      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (data.success && data.audioUrl) {
        // Останавливаем предыдущее воспроизведение
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Создаем новый аудио элемент
        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          processQueue();
        };

        audio.onerror = () => {
          console.error('Audio playback error');
          setIsPlaying(false);
          processQueue();
        };

        await audio.play();
        console.log('✅ Voice notification played:', options.type);
      } else {
        setIsPlaying(false);
        console.log('Voice notification not available');
      }

    } catch (error) {
      console.error('Error playing voice notification:', error);
      setIsPlaying(false);
    }
  }, [audioEnabled]);

  const processQueue = useCallback(() => {
    if (queueRef.current.length > 0 && !isPlaying) {
      const nextNotification = queueRef.current.shift();
      if (nextNotification) {
        playVoiceNotification(nextNotification);
      }
    }
  }, [isPlaying, playVoiceNotification]);

  const queueVoiceNotification = useCallback((options: VoiceNotificationOptions) => {
    if (isPlaying) {
      queueRef.current.push(options);
    } else {
      playVoiceNotification(options);
    }
  }, [isPlaying, playVoiceNotification]);

  const stopVoiceNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    queueRef.current = [];
    setIsPlaying(false);
  }, []);

  // Предустановленные голосовые уведомления
  const playDepositNotification = useCallback((amount: number, message?: string) => {
    queueVoiceNotification({
      type: 'deposit',
      message: message || 'Средства успешно зачислены',
      amount
    });
  }, [queueVoiceNotification]);

  const playWithdrawalNotification = useCallback((amount: number, message?: string) => {
    queueVoiceNotification({
      type: 'withdrawal',
      message: message || 'Запрос на вывод обрабатывается',
      amount
    });
  }, [queueVoiceNotification]);

  const playInvestmentNotification = useCallback((amount: number, planName: string, message?: string) => {
    queueVoiceNotification({
      type: 'investment',
      message: message || 'Инвестиция создана успешно',
      amount,
      planName
    });
  }, [queueVoiceNotification]);

  const playSuccessNotification = useCallback((message: string) => {
    queueVoiceNotification({
      type: 'success',
      message
    });
  }, [queueVoiceNotification]);

  const playErrorNotification = useCallback((message: string) => {
    queueVoiceNotification({
      type: 'error',
      message
    });
  }, [queueVoiceNotification]);

  return {
    isPlaying,
    audioEnabled,
    playVoiceNotification: queueVoiceNotification,
    stopVoiceNotification,
    playDepositNotification,
    playWithdrawalNotification,
    playInvestmentNotification,
    playSuccessNotification,
    playErrorNotification
  };
}
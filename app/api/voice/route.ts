import { NextRequest, NextResponse } from 'next/server';
import { voiceService, VoiceNotificationOptions } from '@/lib/voice-service';

export async function POST(request: NextRequest) {
  try {
    const options: VoiceNotificationOptions = await request.json();
    
    if (!options.type || !options.message) {
      return NextResponse.json({ 
        error: 'Требуются поля type и message' 
      }, { status: 400 });
    }

    const audioDataUrl = await voiceService.generateSpeech(options);
    
    if (!audioDataUrl) {
      return NextResponse.json({ 
        success: false, 
        message: 'Голосовое сопровождение недоступно' 
      });
    }

    return NextResponse.json({
      success: true,
      audioUrl: audioDataUrl,
      message: 'Голосовое сообщение создано'
    });

  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json({ 
      error: 'Ошибка создания голосового сообщения' 
    }, { status: 500 });
  }
}

// Предзагрузка общих фраз
export async function GET() {
  try {
    await voiceService.preloadCommonPhrases();
    return NextResponse.json({ 
      success: true, 
      message: 'Голосовые фразы предзагружены' 
    });
  } catch (error) {
    console.error('Voice preload error:', error);
    return NextResponse.json({ 
      error: 'Ошибка предзагрузки' 
    }, { status: 500 });
  }
}
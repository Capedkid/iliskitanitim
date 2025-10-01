import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    
    // Klasörün var olup olmadığını kontrol et
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json([]);
    }

    // Klasördeki tüm dosyaları oku
    const files = fs.readdirSync(audioDir);
    
    // Sadece .mp3 dosyalarını filtrele
    const mp3Files = files.filter(file => 
      file.toLowerCase().endsWith('.mp3')
    );

    return NextResponse.json(mp3Files);
  } catch (error) {
    console.error('Audio files tarama hatası:', error);
    return NextResponse.json([], { status: 500 });
  }
}

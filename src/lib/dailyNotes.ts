// Daily romantic notes and a deterministic selector for today's note

export const dailyNotes: string[] = [
  "Güne senin adınla başlamak, günün en güzel kısmı.",
  "Bir gülüşünle dünya güzelleşiyor.",
  "Kalbim, kalbinin ritmine alıştı çoktan.",
  "Seninle her gün yeni bir hikaye yazıyorum.",
  "Aşkımızın rengi bugün biraz daha parlak.",
  "İyi ki varsın, iyi ki biz varız.",
  "Yanındayken zaman yavaşlıyor, dünya sessizleşiyor.",
  "Gözlerinin içinde kaybolmak istiyorum bugün de.",
  "Bir dokunuşun, bin huzur.",
  "Senle her an, küçük bir mucize.",
  "Düşlerimin en güzeli, gerçeğim oldun.",
  "Kalbimde sana ayrılan yer hep en sıcak.",
  "Bugün de sevgini cebime koyup çıkıyorum.",
  "Sessiz bir teşekkür: Varlığına.",
  "Yollar uzasa da kalpler yakın.",
  "Aşk, senin adınla başlıyor bende.",
  "Birlikteyken her şey biraz daha anlamlı.",
  "Gülüşünde saklı bir bahar var.",
  "Seninle konuşmadan da anlaşmayı seviyorum.",
  "Elini tuttuğumda dünya yerini buluyor.",
  "Bugün, dününden güzel; çünkü sen varsın.",
  "Aynı gökyüzüne bakıyoruz; aynı rüyaları görüyoruz.",
  "İki kalp, tek ritim.",
  "Seninle her gün küçük bir kutlama.",
  "Sevdiğim en güzel alışkanlık sensin.",
  "Kalbim, adını her atışında fısıldıyor.",
  "Bir bakışın, bin şiir.",
  "Bugün de sevgine sığındım.",
  "Sessiz anlarımızın bile bir melodisi var.",
  "Senle yürürken yol kısalıyor.",
  "Aşkımızın gölgesinde serinliyorum.",
  "Birlikteyken dünya biraz daha iyi.",
  "Kelimeler yetmiyor; kalbim anlatıyor.",
  "Seninle olmak, eve dönmek gibi.",
  "Gözlerinde kaybolmayı bugün de deneyeceğim.",
  "Senden sonra her şeyin tadı değişti.",
  "Bir tebessümün, tüm yorgunluğumu alıyor.",
  "Aşkımız, her gün yeniden doğuyor.",
  "Bugün, sana yeniden âşık oldum.",
  "Kalbinin yanında, dünya güvenli.",
];

export function selectNoteForDate(notes: string[], date: Date): string {
  if (!notes || notes.length === 0) return "";
  const y = date.getFullYear();
  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate(); // 1-31
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const key = `${y}-${pad(m)}-${pad(d)}`; // YYYY-MM-DD (local)
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % notes.length;
  return notes[index];
}

export function getTodayNote(): string {
  if (dailyNotes.length === 0) return "";
  // Roll-over at LOCAL midnight (00:00). Use local date parts and avoid UTC conversion.
  const now = new Date();
  return selectNoteForDate(dailyNotes, now);
}



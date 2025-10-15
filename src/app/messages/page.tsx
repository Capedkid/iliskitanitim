"use client";

import { useState } from "react";
import Link from "next/link";

function HeartDivider() {
  return (
    <div className="relative mx-auto h-[1px] w-full max-w-[560px] bg-rose-100/70">
      <div className="absolute left-1/2 -top-3 -translate-x-1/2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 shadow-sm ring-1 ring-rose-300/40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 21s-6.716-4.507-9.192-7.4C.948 11.51 1.2 7.7 4.32 6.34 6.4 5.4 8.3 6.1 9.4 7.2L12 9.8l2.6-2.6c1.1-1.1 3-1.8 5.08-.86 3.12 1.36 3.37 5.17 1.51 7.26C18.716 16.493 12 21 12 21z" fill="currentColor" className="text-rose-500" />
          </svg>
        </span>
      </div>
    </div>
  );
}

interface Message {
  id: number;
  title: string;
  content: string;
  category: 'daily' | 'weekly' | 'special' | 'love-notes';
  date: string;
  mood: 'happy' | 'romantic' | 'sweet' | 'dreamy';
  isFavorite: boolean;
  author: 'isimBir' | 'isimİki';
}

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Örnek mesajlar (gerçek mesajlarla değiştirilecek)
  const messages: Message[] = [
    {
      id: 1,
      title: "Sabah Mesajı",
      content: "Güne senin sesinle başlamak, günün en güzel kısmı. Mavi gökyüzü gibi huzurlu, kırmızı gül gibi tutkulu bir gün olsun.",
      category: 'daily',
      date: "2024-01-15",
      mood: 'romantic',
      isFavorite: true,
      author: 'isimBir'
    },
    {
      id: 2,
      title: "Akşam Notu",
      content: "Bugün de seninle geçirdiğim her an özeldi. Birlikte yürürken zaman yavaşlıyor, sanki sadece ikimiz varız dünyada.",
      category: 'daily',
      date: "2024-01-16",
      mood: 'sweet',
      isFavorite: false,
      author: 'isimİki'
    },
    {
      id: 3,
      title: "Haftalık Değerlendirme",
      content: "Bu hafta birlikte yaşadığımız güzel anlar... Her biri birer hazine. Seninle her gün yeni bir hikaye yazıyoruz.",
      category: 'weekly',
      date: "2024-01-20",
      mood: 'happy',
      isFavorite: true,
      author: 'isimBir'
    },
    {
      id: 4,
      title: "Özel Gün Mesajı",
      content: "Bugün bizim özel günümüz! Kalplerin ilk kıvılcımından bugüne kadar geçen süre... Her anı değerli, her saniye özel.",
      category: 'special',
      date: "2024-02-14",
      mood: 'romantic',
      isFavorite: true,
      author: 'isimİki'
    },
    {
      id: 5,
      title: "Aşk Mektubu",
      content: "Mavinin huzuru, kırmızının tutkusu... İkisi bir araya gelince aşk oluyor. Sen benim mavim, ben senin kırmızın.",
      category: 'love-notes',
      date: "2024-02-20",
      mood: 'dreamy',
      isFavorite: true,
      author: 'isimBir'
    },
    {
      id: 6,
      title: "Günlük Not",
      content: "Küçük sürprizler, büyük gülüşler... Seninle her an böyle. Uzak değil, sadece adım adım ilerliyoruz birlikte.",
      category: 'daily',
      date: "2024-02-25",
      mood: 'sweet',
      isFavorite: false,
      author: 'isimİki'
    },
    {
      id: 7,
      title: "Hafta Sonu Mesajı",
      content: "Birlikte geçirdiğimiz hafta sonu... Mavi ve kırmızı aynı karede, aynı anda nefes alıyoruz, aynı rüyaları görüyoruz.",
      category: 'weekly',
      date: "2024-03-02",
      mood: 'happy',
      isFavorite: false,
      author: 'isimBir'
    },
    {
      id: 8,
      title: "Doğum Günü Mesajı",
      content: "Doğum günün kutlu olsun! Senin doğduğun gün, benim için de yeni bir başlangıç oldu. Seninle tanışmak, hayatımın en güzel hediyesi.",
      category: 'special',
      date: "2024-03-15",
      mood: 'romantic',
      isFavorite: true,
      author: 'isimİki'
    }
  ];

  

  // Tüm mesajları göster
  const filteredMessages = messages;

  const toggleFavorite = (messageId: number) => {
    // Bu fonksiyon gerçek uygulamada state'i güncelleyecek
    console.log('Toggle favorite:', messageId);
  };


  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const printMessage = (message: Message) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${message.title}</title>
            <style>
              /* Page setup */
              @page { size: A4; margin: 20mm; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }

              /* Base typography */
              :root {
                --rose: #e11d48; /* rose-600 */
                --ink: #111827; /* gray-900 */
                --muted: #6B7280; /* gray-500 */
                --rule: #e5e7eb; /* gray-200 */
              }
              html, body { height: 100%; }
              body { 
                font-family: Georgia, 'Times New Roman', Times, serif; 
                color: var(--ink);
                line-height: 1.7; 
              }

              .sheet { 
                max-width: 700px; 
                margin: 0 auto; 
              }
              .header { text-align: center; margin-bottom: 14mm; }
              .brand { font-size: 11pt; color: var(--muted); letter-spacing: .06em; }
              .title { font-size: 22pt; margin: 4mm 0 2mm; color: var(--rose); font-weight: 700; }
              .meta { color: var(--muted); font-size: 11pt; }
              .rule { height: 1px; background: var(--rule); margin: 6mm 0 8mm; }

              .content { font-size: 12.5pt; }
              .content p { margin: 0 0 5mm; }
              .content p:last-child { margin-bottom: 0; }

              .footer { 
                margin-top: 14mm; 
                color: var(--muted); 
                font-size: 10.5pt; 
                text-align: center; 
              }

              /* Avoid awkward breaks */
              .header, .footer { page-break-inside: avoid; }
              .content { orphans: 3; widows: 3; }
            </style>
          </head>
          <body>
            <div class="sheet">
              <div class="header">
                <div class="brand">İsimBir &amp; İsimİki</div>
                <div class="title">${message.title}</div>
                <div class="meta">
                  ${new Date(message.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  · ${message.author === 'isimBir' ? 'İsimBir' : 'İsimİki'}
                </div>
              </div>
              <div class="rule"></div>
              <div class="content">
                ${message.content
                  .split('\n')
                  .map(p => `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`) 
                  .join('')}
              </div>
              <div class="footer">İsimBir &amp; İsimİki — Aşk Mektupları</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Ana sayfadaki gibi arka plan zaten globals.css'de tanımlı */}

      <div className="relative z-10">
        {/* Header - Ana sayfa gibi */}
        <header className="px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="font-display text-xl sm:text-2xl tracking-wide">
            <span className="text-ours-blue">İ</span>simBir <span className="text-ours-burgundy">&</span> <span className="text-black">İ</span>simİki
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Ana Sayfa
            </Link>
            <Link href="/gallery" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Galeri
            </Link>
            <Link href="/special-days" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Özel Günler
            </Link>
            <Link href="/game/selection" className="transition-all duration-200 hover:scale-105 active:scale-95 hover:text-rose-600">
              Oyun 💖
            </Link>
          </nav>
        </header>

        {/* Page Title Section */}
        <section className="px-6 sm:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-display text-[40px] leading-[1.08] sm:text-[56px] md:text-[64px] tracking-tight">
              Mesajlar
              <br />
              <span className="text-rose-600">💌</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-black/70 dark:text-white/80 max-w-prose leading-relaxed mx-auto">
              Romantik notlar ve aşk mektuplarımız. Her mesaj bir hikaye, her kelime bir aşk.
            </p>
            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              {filteredMessages.length} mesaj
            </div>
          </div>
          <div className="mt-10">
            <HeartDivider />
          </div>
        </section>

        <main className="px-6 sm:px-10 pb-10">
          <div className="max-w-5xl mx-auto">
            {filteredMessages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="group rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl tracking-wide text-white truncate">{msg.title}</h3>
                        <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
                          <span>{new Date(msg.date).toLocaleDateString('tr-TR')}</span>
                          <span>•</span>
                          <span>{msg.author === 'isimBir' ? 'İsimBir' : 'İsimİki'}</span>
                        </div>
                      </div>
                      <button
                        className="text-lg text-yellow-500 transition-colors"
                        aria-label="Favori"
                        disabled
                      >
                        ⭐
                      </button>
                    </div>

                    <p className="mt-3 text-white/80 text-sm line-clamp-4">{msg.content}</p>

                    <div className="mt-5 flex items-center justify-end">
                      <button
                        onClick={() => { setSelectedMessage(msg); setIsModalOpen(true); }}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        Devamını oku
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💌</div>
                <h3 className="text-xl font-display text-rose-600 mb-2">Henüz mesaj yok</h3>
                <p className="text-white/70">Yakında burada aşk mektupları olacak.</p>
              </div>
            )}
          </div>
        </main>

      </div>

      {/* Message Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMessageModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="rounded-3xl bg-black/30 backdrop-blur ring-1 ring-rose-300/50 p-8 shadow-[0_20px_60px_-20px_rgba(235,80,120,0.35)]">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="font-display text-2xl tracking-wide text-white mb-2">
                    {selectedMessage.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>{new Date(selectedMessage.date).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{selectedMessage.author === 'isimBir' ? 'İsimBir' : 'İsimİki'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFavorite(selectedMessage.id)}
                    className={`text-xl transition-colors ${
                      selectedMessage.isFavorite ? 'text-yellow-500' : 'text-white/40 hover:text-yellow-400'
                    }`}
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => printMessage(selectedMessage)}
                    className="text-white/40 hover:text-rose-400 transition-colors text-lg"
                  >
                    🖨️
                  </button>
                  <button
                    onClick={closeMessageModal}
                    className="text-white/40 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 leading-relaxed text-lg">
                  {selectedMessage.content}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/50">
                    İsimBir & İsimİki - Aşk Mektupları
                  </div>
                  <button
                    onClick={closeMessageModal}
                    className="px-6 py-2 bg-rose-500/20 text-rose-300 rounded-full hover:bg-rose-500/30 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

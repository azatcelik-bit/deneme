# Slayt → Tweet Thread (kendi sitende, Gemini ile)

Dosyalar: `index.html` (sayfa) + `api/generate.js` (API anahtarını saklayan sunucu fonksiyonu).

## Yayınlama (Vercel, ücretsiz plan yeter)
1. aistudio.google.com/apikey adresinden ücretsiz bir Gemini API anahtarı al.
   (Ücretsiz katmanda günlük/dakikalık limit var; ayrıca gönderilen içerik Google tarafından
   ürün geliştirmede kullanılabilir. Gizli içerik yüklemeyeceksen sorun değil.)
2. Bu klasörü bir GitHub deposuna yükle.
3. vercel.com → Add New → Project → depoyu seç → **Environment Variables**:
   - `GEMINI_API_KEY` = anahtarın
   - `ACCESS_CODE` = (önerilir) sitede sorulacak şifre; yoksa herkes kotanı harcayabilir
   - `MODEL` = (isteğe bağlı) varsayılan `gemini-2.5-flash`
4. Deploy. Bitti.

Not: Anahtarı asla index.html'e yazma.

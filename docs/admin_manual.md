# Administrator uchun qo‘llanma

## Tizim sozlamalari
1. **Foydalanuvchilarni boshqarish:**
   - Admin panelda "Users" bo‘limidan yangi foydalanuvchi qo‘shing (login, parol, rol, tashkilot ID).
2. **Tashkilotlarni boshqarish:**
   - "Organizations" bo‘limida yangi tashkilot yarating va uslublarni sozlang.

## Yangilanishlar
- "Update Management" bo‘limida `.exe` fayllarni yuklang. Har bir tashkilot uchun alohida versiya.

## Ovozli sozlamalar
- "Audio Management" bo‘limida ovozli fayllarni yuklang (masalan, talon chaqiruvi uchun).

## Monitoring
- `/metrics` endpoint orqali Prometheus bilan server holatini kuzating.
- Loglar `logs/info.log` va `logs/error.log` da saqlanadi.

## Backup
- "Backup Management" bo‘limida ma'lumotlar bazasi backup’ini yarating va tiklang.
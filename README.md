# DİM SualUsta - Müəllimlər üçün DİM Standartında İmtahan və Test Hazırlayıcı Platforma

Azərbaycan Respublikası Dövlət İmtahan Mərkəzinin (DİM) buraxılış (9 və 11-ci sinif) və ali məktəblərə qəbul (blok) imtahanları modelinə tam uyğunlaşdırılmış imtahan hazırlama mühiti.

---

## 🎯 DİM İmtahan Sual Tiplərinin Analizi

Dövlət İmtahan Mərkəzinin rəsmi imtahan strukturuna əsasən sistemdə aşağıdakı sual tipləri üçün xüsusi alətlər təqdim edilmişdir:

1. **Qapalı tipli test tapşırıqları (5 variantlı: A, B, C, D, E)**:
   - 1 düzgün cavablı klassik test modeli.
   - Sualın balı və çətinlik dərəcəsi (Asan, Orta, Çətin).

2. **Riyazi Həndəsi Fiqurlu Suallar (SVG Geometry Engine)**:
   - DİM-in ən çox istifadə etdiyi həndəsə rəsmləri üçün daxili generator:
     - Düzbucaqlı üçbucaq (Pifaqor, katetlər, bucaq $\alpha$, hipotenuz)
     - Bərabəryanlı üçbucaq (yan tərəflər, oturacaq, hündürlük $h$)
     - Çevrə və vətər / mərkəz $O$ və radius $R$
     - Çevrə və toxunan xətt ($PT \perp OT$)
     - Trapesiya və paraleloqram (oturacaqlar və hündürlüklər)
     - Dekart koordinat müstəvisi (X-Y oxları və funksiya qrafiki)
   - Tərəf ölçüləri, hərflər və bucaqlar müəllim tərəfindən asanlıqla daxil edilir və dərhal vektor formatında suala əlavə olunur.

3. **Açıq tipli test tapşırıqları (Kodlaşdırılan / Ədədi cavab)**:
   - Variantı olmayan, şagirdin cavab vərəqində rəqəmləri kodlaşdırmalı olduğu model (məs: 24, 210, -5).

4. **Yazılı həlli tələb olunan açıq suallar (Mərhələli meyarlar)**:
   - Həll xanası və qiymətləndirmə meyarları ilə təmin olunmuş suallar.

5. **Uyğunlaşdırma tipli tapşırıqlar (1, 2, 3 ↔ a, b, c, d, e)**:
   - Sol və sağ sütunların müqayisəsi (məs: $1 \to c; 2 \to a,d; 3 \to b$).

6. **Situasiya / Kontekstual tapşırıqlar**:
   - Giriş mətni / təsvir və ona aid alt suallar bloku.

---

## 🛠️ Müəllimlər üçün Alətlər

- **Riyazi Simvol Paneli (Virtual Math Keyboard)**: $\sqrt{\phantom{x}}$, $x^2$, $\pi$, $\alpha$, $\beta$, $\angle$, $\triangle$, $\perp$, $\parallel$, $\in$, $\le$, $\ge$, $\neq$, $\pm$ və s. simvolları bir kliklə sualın mətninə əlavə etmək.
- **Canlı DİM İmtahan Kitabçası (Booklet Preview)**: Sual əlavə edildikcə sağ tərəfdə rəsmi DİM şrifti (`STIX Two Text`) və 2 sütunlu A4 formatında canlı səhifələnmə.
- **DİM Optik Cavab Kartı (Bubble Answer Sheet)**: Şagirdlərin imtahanda kodlaşdırma təcrübəsi qazanması üçün avtomatik yaradılan cavab kartı.
- **Düzgün Cavablar Açarı (Answer Key)**: Müəllimin yoxlaması üçün avtomatik çıxarılan cavab cədvəli.
- **Bir Kliklə Çap və PDF**: `window.print()` ilə bütün idarəetmə düymələri gizlənir və yalnız rəsmi DİM imtahan vərəqi çap olunur.
- **Yaddaşda Saxlama**: Bütün suallar brauzerin `localStorage` yaddaşında qalır.

---

## 🚀 Saytı Açmaq Qaydası

Platformanı birbaşa brauzerdə açmaq üçün:

```bash
open /Users/pasha/.gemini/antigravity/scratch/dim-exam-builder/index.html
```

Və ya Finder-dən [`index.html`](file:///Users/pasha/.gemini/antigravity/scratch/dim-exam-builder/index.html) faylına iki dəfə klikləyərək aça bilərsiniz.

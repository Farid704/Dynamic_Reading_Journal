#!/usr/bin/env bash
# Menyiapkan proyek Android (dipanggil otomatis oleh GitHub Actions).
set -e
[ -d android ] || npx cap add android

# Ikon aplikasi dari assets/icon-only.png
npx capacitor-assets generate --android \
  --iconBackgroundColor '#1e88e5' --iconBackgroundColorDark '#1e88e5' \
  || echo "Peringatan: pembuatan ikon gagal, memakai ikon bawaan."

# Izin notifikasi (Android 13+)
M=android/app/src/main/AndroidManifest.xml
grep -q POST_NOTIFICATIONS "$M" || sed -i 's#</manifest>#    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n</manifest>#' "$M"

npx cap sync android

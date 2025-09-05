import axios from 'axios';

// MongoDB Helper - direkt veritabanı işlemleri için
const { cleanupAllTestData, closeDB } = require('./helpers/mongoHelper.js');

import fs from 'fs';
import path from 'path';

const UPLOAD_API_URL = 'http://localhost:5000/api/uploads';

describe('Upload API Integration Tests', () => {

  // POST /uploads - Resim Yükleme
  describe('POST /uploads', () => {
    // Happy Path Tests
    describe('Happy Path - Başarılı Yükleme', () => {
      test('should upload a valid image file successfully', async () => {
        // Given - Geçerli resim dosyası
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'test.jpg');

        // When - Gerçek API'yi çağır
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - Başarılı yükleme response'u
        expect(response).toMatchObject({
          status: 200,
          data: expect.objectContaining({
            imageData: expect.stringContaining('data:image/jpeg;base64,'),
            mimeType: 'image/jpeg',
            originalName: 'test.jpg',
            size: expect.any(Number)
          })
        });
        expect(response.data.size).toBeGreaterThan(0);
      });

      test('should upload PNG image successfully', async () => {
        // Given - PNG formatında resim dosyası
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('image', blob, 'image.png');

        // When - PNG resim yükle
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - PNG başarıyla yüklenmeli
        expect(response).toMatchObject({
          status: 200,
          data: expect.objectContaining({
            imageData: expect.stringContaining('data:image/'),
            originalName: 'image.png',
            size: expect.any(Number)
          })
        });
        expect(response.data.size).toBeGreaterThan(0);
      });

      test('should upload GIF image successfully', async () => {
        // Given - GIF formatında resim dosyası
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/gif' });
        formData.append('image', blob, 'animation.gif');

        // When - GIF resim yükle
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - GIF başarıyla yüklenmeli
        expect(response).toMatchObject({
          status: 200,
          data: expect.objectContaining({
            imageData: expect.stringContaining('data:image/'),
            originalName: 'animation.gif',
            size: expect.any(Number)
          })
        });
        expect(response.data.size).toBeGreaterThan(0);
      });

      test('should upload WEBP image successfully', async () => {
        // Given - WEBP formatında resim dosyası
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/webp' });
        formData.append('image', blob, 'modern.webp');

        // When - WEBP resim yükle
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - WEBP başarıyla yüklenmeli
        expect(response).toMatchObject({
          status: 200,
          data: expect.objectContaining({
            imageData: expect.stringContaining('data:image/'),
            originalName: 'modern.webp',
            size: expect.any(Number)
          })
        });
        expect(response.data.size).toBeGreaterThan(0);
      });
    });

    // Unhappy Path Tests
    describe('Unhappy Path - Yükleme Hataları', () => {
      test('should fail when no file is uploaded', async () => {
        // Given - Boş FormData
        const formData = new FormData();

        // When & Then - Dosya olmadan yükleme girişimi başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 400,
            data: expect.objectContaining({ message: expect.stringContaining('file') })
          }
        });
      });

      test('should fail when file size exceeds 5MB limit', async () => {
        // Given - 6MB boyutunda çok büyük dosya
        const oversizeBuffer = Buffer.alloc(6 * 1024 * 1024, 'x'); // 6MB buffer
        const formData = new FormData();
        const blob = new Blob([oversizeBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'toolarge.jpg');

        // When & Then - Büyük dosya yükleme başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });

      test('should fail when uploading non-image file (PDF)', async () => {
        // Given - PDF dosyası (resim olmayan dosya)
        const pdfContent = Buffer.from('PDF test content');
        const formData = new FormData();
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        formData.append('image', blob, 'document.pdf');

        // When & Then - PDF yükleme başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });

      test('should fail when uploading text file', async () => {
        // Given - Metin dosyası
        const textContent = Buffer.from('text content');
        const formData = new FormData();
        const blob = new Blob([textContent], { type: 'text/plain' });
        formData.append('image', blob, 'file.txt');

        // When & Then - Metin dosyası yükleme başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });

      test('should fail when uploading video file', async () => {
        // Given - Video dosyası
        const videoContent = Buffer.from('video content');
        const formData = new FormData();
        const blob = new Blob([videoContent], { type: 'video/mp4' });
        formData.append('image', blob, 'video.mp4');

        // When & Then - Video dosyası yükleme başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });

      test('should fail when uploading audio file', async () => {
        // Given - Ses dosyası
        const audioContent = Buffer.from('audio content');
        const formData = new FormData();
        const blob = new Blob([audioContent], { type: 'audio/mp3' });
        formData.append('image', blob, 'audio.mp3');

        // When & Then - Ses dosyası yükleme başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });
    });

    // Edge Cases
    describe('Edge Cases - Özel Durumlar', () => {
      test('should handle very small file (1 byte)', async () => {
        // Given - Çok küçük (1 byte) resim dosyası
        const tinyBuffer = Buffer.from('x');
        const formData = new FormData();
        const blob = new Blob([tinyBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'tiny.jpg');

        // When - Küçük dosya yükle
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - Küçük dosya başarıyla yüklenmeli
        expect(response.status).toBe(200);
        expect(response.data.originalName).toBe('tiny.jpg');
        expect(response.data.size).toBeGreaterThan(0);
      });

      test('should handle empty file name', async () => {
        // Given - Boş dosya adı
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, '');

        // When & Then - Boş isimli dosya durumu
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 400
          }
        });
      });
    });

    // Boundary Tests
    describe('Boundary Tests - Sınır Değer Testleri', () => {
      test('should handle file exactly at 5MB limit', async () => {
        // Given - Tam 5MB boyutunda dosya
        const exactSize = 5 * 1024 * 1024; // Exactly 5MB
        const exactBuffer = Buffer.alloc(exactSize, 'x');
        const formData = new FormData();
        const blob = new Blob([exactBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'exact5mb.jpg');

        // When & Then - Tam limit boyutunda dosya
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });

      test('should fail for file 1 byte over 5MB limit', async () => {
        // Given - 5MB + 1 byte boyutunda dosya
        const oversizeFile = 5 * 1024 * 1024 + 1; // 1 byte over 5MB
        const oversizeBuffer = Buffer.alloc(oversizeFile, 'x');
        const formData = new FormData();
        const blob = new Blob([oversizeBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'oversize.jpg');

        // When & Then - Limit aşan dosya başarısız olmalı
        await expect(
          axios.post(UPLOAD_API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        ).rejects.toMatchObject({
          response: {
            status: 500
          }
        });
      });
    });
  });
});

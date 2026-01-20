import axios from 'axios';

// MongoDB Helper - for direct database operations
const { cleanupAllTestData, closeDB } = require('./helpers/mongoHelper.js');

import fs from 'fs';
import path from 'path';

const UPLOAD_API_URL = 'http://localhost:5000/api/uploads';

describe('Upload API Integration Tests', () => {

  // POST /uploads - Image Upload
  describe('POST /uploads', () => {
    // Happy Path Tests
    describe('Happy Path - Successful Upload', () => {
      test('should upload a valid image file successfully', async () => {
        // Given - Valid image file
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'test.jpg');

        // When - Call real API
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - Successful upload response
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
        // Given - PNG format image file
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('image', blob, 'image.png');

        // When - Upload PNG image
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - PNG should be uploaded successfully
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
        // Given - GIF format image file
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/gif' });
        formData.append('image', blob, 'animation.gif');

        // When - Upload GIF image
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - GIF should be uploaded successfully
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
        // Given - WEBP format image file
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/webp' });
        formData.append('image', blob, 'modern.webp');

        // When - Upload WEBP image
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - WEBP should be uploaded successfully
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
    describe('Unhappy Path - Upload Errors', () => {
      test('should fail when no file is uploaded', async () => {
        // Given - Empty FormData
        const formData = new FormData();

        // When & Then - Upload attempt without file should fail
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
        // Given - 6MB oversized file
        const oversizeBuffer = Buffer.alloc(6 * 1024 * 1024, 'x'); // 6MB buffer
        const formData = new FormData();
        const blob = new Blob([oversizeBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'toolarge.jpg');

        // When & Then - Large file upload should fail
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
        // Given - PDF file (non-image file)
        const pdfContent = Buffer.from('PDF test content');
        const formData = new FormData();
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        formData.append('image', blob, 'document.pdf');

        // When & Then - PDF upload should fail
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
        // Given - Text file
        const textContent = Buffer.from('text content');
        const formData = new FormData();
        const blob = new Blob([textContent], { type: 'text/plain' });
        formData.append('image', blob, 'file.txt');

        // When & Then - Text file upload should fail
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
        // Given - Video file
        const videoContent = Buffer.from('video content');
        const formData = new FormData();
        const blob = new Blob([videoContent], { type: 'video/mp4' });
        formData.append('image', blob, 'video.mp4');

        // When & Then - Video file upload should fail
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
        // Given - Audio file
        const audioContent = Buffer.from('audio content');
        const formData = new FormData();
        const blob = new Blob([audioContent], { type: 'audio/mp3' });
        formData.append('image', blob, 'audio.mp3');

        // When & Then - Audio file upload should fail
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
    describe('Edge Cases - Special Scenarios', () => {
      test('should handle very small file (1 byte)', async () => {
        // Given - Very small (1 byte) image file
        const tinyBuffer = Buffer.from('x');
        const formData = new FormData();
        const blob = new Blob([tinyBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'tiny.jpg');

        // When - Upload small file
        const response = await axios.post(UPLOAD_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Then - Small file should be uploaded successfully
        expect(response.status).toBe(200);
        expect(response.data.originalName).toBe('tiny.jpg');
        expect(response.data.size).toBeGreaterThan(0);
      });

      test('should handle empty file name', async () => {
        // Given - Empty file name
        const testImagePath = path.join(process.cwd(), 'src', 'test', 'test-image.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, '');

        // When & Then - Empty filename case
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
    describe('Boundary Tests - Limit Value Tests', () => {
      test('should handle file exactly at 5MB limit', async () => {
        // Given - File exactly 5MB in size
        const exactSize = 5 * 1024 * 1024; // Exactly 5MB
        const exactBuffer = Buffer.alloc(exactSize, 'x');
        const formData = new FormData();
        const blob = new Blob([exactBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'exact5mb.jpg');

        // When & Then - File at exact limit size
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
        // Given - File 5MB + 1 byte in size
        const oversizeFile = 5 * 1024 * 1024 + 1; // 1 byte over 5MB
        const oversizeBuffer = Buffer.alloc(oversizeFile, 'x');
        const formData = new FormData();
        const blob = new Blob([oversizeBuffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'oversize.jpg');

        // When & Then - File exceeding limit should fail
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

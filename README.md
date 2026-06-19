# File Uploader & Downloader (with Backend)

## What this includes
- `server.js`: Node.js + Express backend that supports:
  - `POST /upload` to upload files (multipart/form-data)
  - `GET /files/:filename` to download uploaded files
- `public/index.html`: simple UI to upload and download files

## Run
1. Install Node.js (if needed)
2. In this folder, run:
   ```bash
   npm init -y
   npm i express multer cors
   node server.js
   ```
3. Open the URL shown in the console (usually http://localhost:3000)

## Notes
- Uploaded files are stored in `uploads/`.
- Download lists files found in `uploads/`.
- For production, add auth + size limits + better security.


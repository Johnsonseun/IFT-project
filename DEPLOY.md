# Deploy (Make it publicly available online)

This app is a simple Node.js (Express) server that:
- serves the frontend from `public/`
- accepts uploads via `POST /upload`
- lists downloads via `GET /files` and serves downloads via `GET /files/:filename`

## Important security note
Exposing a public file upload service on the internet without:
- authentication/authorization
- upload size limits
- file type checks
- filename sanitization/uniqueness
- rate limiting

…can be abused. For a public “anyone” demo it’s strongly recommended to add at least upload size limits and safer filename handling.

## Fastest way for testing: ngrok (public URL)
1. Install ngrok
2. Start the server locally:
   ```bash
   cd "c:/Users/user/Desktop/New folder (2)/file-uploader-downloader"
   npm start
   ```
3. In a second terminal:
   ```bash
   ngrok http 3000
   ```
4. Use the ngrok https URL it prints in your browser.

## Real hosting: deploy the Node app
You can deploy to many providers. Common choices:
- Render
- Fly.io
- Railway
- DigitalOcean App Platform

### What to deploy
Deploy these project parts:
- `server.js`
- `public/` (frontend)
- `uploads/` (storage; usually you want a persistent volume/storage in production)
- `package.json`

### Typical provider steps (Render/Fly/Railway)
1. Create a web service for Node.js.
2. Set the start command:
   - `npm start`
3. Set Node.js version (e.g., 18/20).
4. Ensure environment:
   - `PORT` is provided by the platform (they often override it).
5. Add a persistent disk/volume for `uploads/` if the platform supports it.

## One small code change recommended for production
Right now uploads are stored using the original filename, which can overwrite files and may contain unsafe characters.
In production, you should change multer storage to use a generated safe name (e.g., UUID) and keep the original name for display.

If you want, I can implement that + add `MAX_FILE_SIZE`.



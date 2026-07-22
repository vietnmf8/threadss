import fs from "fs";
import path from "path";
import https from "https";

const files = [
    "favicon.svg",
    "favicon-96x96.png",
    "favicon.ico",
    "apple-touch-icon.png",
    "web-app-manifest-192x192.png",
    "web-app-manifest-512x512.png",
    "site.webmanifest"
];

const baseUrl = "https://realfavicongenerator.net/files/ff5d381a-a1e4-4f33-b285-6fb02b6a5dad/";
const publicDir = path.join(process.cwd(), "public");

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

function downloadFile(file) {
    return new Promise((resolve, reject) => {
        const url = baseUrl + file;
        const dest = path.join(publicDir, file);
        const fileStream = fs.createWriteStream(dest);

        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                https.get(response.headers.location, (res) => {
                    res.pipe(fileStream);
                    fileStream.on("finish", () => {
                        fileStream.close();
                        console.log(`Downloaded ${file}`);
                        resolve();
                    });
                }).on("error", reject);
            } else {
                response.pipe(fileStream);
                fileStream.on("finish", () => {
                    fileStream.close();
                    console.log(`Downloaded ${file}`);
                    resolve();
                });
            }
        }).on("error", (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const f of files) {
        await downloadFile(f);
    }
    console.log("ALL FAVICON FILES DOWNLOADED SUCCESSFULLY!");
}

run().catch((err) => {
    console.error("Error downloading favicons:", err);
    process.exit(1);
});

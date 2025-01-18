import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3000;
const basePath = path.join("C:", "Users", "user", "OneDrive", "Desktop", "CLear the clutter");
console.log(basePath)
async function organizeFiles() {
    try {
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const ext = path.extname(file).slice(1);
            const extDir = path.join(basePath, ext);

            try {
                // Check if the directory for the extension exists, create it if not
                await fs.mkdir(extDir, { recursive: true });

                // Move the file to the appropriate extension folder
                const oldPath = path.join(basePath, file);
                const newPath = path.join(extDir, file);
                await fs.rename(oldPath, newPath);
            } catch (error) {
                console.error(`Error processing file ${file}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }
}

app.get("/", async (req, res) => {
    try {
        const files = await fs.readdir(basePath);
        res.send(`Hello World! Files: ${files}`);
    } catch (error) {
        res.status(500).send(`Error fetching files: ${error.message}`);
    }
});

// Start organizing files after server starts
app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    await organizeFiles();  // Organize files when the server starts
});

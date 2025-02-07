const express = require("express")
const { exec } = require("child_process");
const { mkdir, writeFile, unlink, access, readdir } = require("fs/promises");
const { createReadStream } = require("fs");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const basicAuth = require('express-basic-auth')

const app = express();
const PORT = process.env.PORT


app.use(cors())
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(basicAuth({
    users: { 'quantinium': 'WWgkQ1YweWo4dCRDZUxZcw==' }
}))

const outputDir = path.join(__dirname, "output")
const cleanDir = async (outputDir) => {
    for (const file of await readdir(outputDir)) {
        await unlink(path.join(outputDir, file));
    }
}

app.post("/compile", async (req, res) => {
    const latexContent = req.body.content;

    if (!latexContent) {
        return res.status(400).json({ error: "No LaTeX content provided" })
    }

    const tempId = crypto.randomUUID();

    const texFilePath = path.join(outputDir, `${tempId}.tex`)
    const pdfFilePath = path.join(outputDir, `${tempId}.pdf`)

    try {
        try {
            await mkdir(outputDir)
        } catch (err) {
            //ignore
        }
        await writeFile(texFilePath, latexContent)

        await new Promise((resolve, reject) => {
            const cmd = `pdflatex -no-shell-escape -interaction=nonstopmode -output-directory=${outputDir} ${texFilePath}`
            exec(cmd, async (err, stdout, stderr) => {
                if (err) {
                    console.log('LaTeX Output: ', stdout);
                    console.error('LaTeX Errors:', stderr);
                    reject(new Error(stderr || err.message))
                    return;
                }

                try {
                    await access(pdfFilePath);
                    resolve();
                } catch (err) {
                    reject(new Error("PDF generation failed. Check LaTeX syntax."))
                }
            });
        });

        const fileStream = createReadStream(pdfFilePath);
        res.setHeader("Content-Type", "application/pdf");

        fileStream.pipe(res);

        fileStream.on("end", async () => {
            console.log("Success")
            await cleanDir(outputDir);
        })

        fileStream.on("error", async (err) => {
            console.error("Error: ", err)
            await cleanDir(outputDir);
            res.status(500).json({ error: "Failed to stream PDF" });
        })
    } catch (err) {
        console.error("Error: ", err)
        await cleanDir(outputDir);
        res.status(500).json({ error: "Failed to stream PDF" });
    }
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})

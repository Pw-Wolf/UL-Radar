const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const {
    createDatabase,
    insertData,
    displayData,
    updateData,
    deleteData,
} = require("./engine.js");
const port = 8080;
const db = createDatabase(); // Kreira bazu podataka

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parsira URL zahtjeva
    const method = req.method; // Dohvaća HTTP metodu zahtjeva
    const pathname = parsedUrl.pathname; // Dohvaća putanju iz URL-a

    // Služi statičke datoteke iz direktorija "public"
    if (method === "GET" && pathname.startsWith("/public")) {
        const filePath = path.join(__dirname, "..", pathname); // Kreira putanju do datoteke
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" }); // Postavlja statusni kod 404 ako datoteka nije pronađena
                res.end("404 Not Found"); // Vraća poruku o grešci
                return;
            }
            const ext = path.extname(filePath).toLowerCase(); // Dohvaća ekstenziju datoteke
            const mimeTypes = {
                ".html": "text/html",
                ".js": "application/javascript",
                ".css": "text/css",
            };
            const contentType = mimeTypes[ext] || "application/octet-stream"; // Postavlja MIME tip na temelju ekstenzije
            res.writeHead(200, { "Content-Type": contentType }); // Postavlja statusni kod 200 i Content-Type
            res.end(data); // Vraća sadržaj datoteke
        });
        return;
    }

    // Služi za odgovaranje na JSON zahtjeve
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Služi početnu HTML stranicu
    if (pathname === "/" && method === "GET") {
        const html = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), 'utf-8'); // Čita index.html datoteku
        res.writeHead(200, { "Content-Type": "text/html" }); // Postavlja statusni kod 200 i Content-Type
        res.end(html); // Vraća sadržaj HTML datoteke

    // Ruta za upravljanje ocitanjama
    } else if (pathname.startsWith("/ocitanja")) {
        if (method === "GET") {
            // Dohvaća sve ocitanja iz baze podataka
            try {
                const ocitanja = displayData(db, "ocitanja");
                res.statusCode = 200;
                res.end(JSON.stringify(ocitanja));
            } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
            }
        } else if (method === "POST") {
            // Dodaje novu stvar u bazu podataka
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const json_body = JSON.parse(body);
                if (!json_body) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Naziv ocitanja je obavezan." }));
                    return;
                }
                try {
                    const insertedRow = insertData(db, "ocitanja", json_body);
                    res.statusCode = 201;
                    res.end(JSON.stringify({ id: insertedRow.id, naziv: insertedRow.naziv }));
                } catch (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: err.message }));
                }
            });
        } else if (method === "PUT") {
            // Ažurira postojeću stvar u bazi podataka
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const json_body = JSON.parse(body);
                if (!json_body || !json_body.id) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "ID je obavezan." }));
                    return;
                }
                try {
                    const updatedRow = updateData(db, "ocitanja", json_body);
                    res.statusCode = 200;
                    res.end(JSON.stringify(updatedRow));
                } catch (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: err.message }));
                }
            });
        } else if (method === "DELETE") {
            // Briše stvar iz baze podataka
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const json_body = JSON.parse(body);
                if (!json_body || !json_body.id) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "ID je obavezan." }));
                    return;
                }
                try {
                    const deletedRow = deleteData(db, "ocitanja", { id: parseInt(json_body.id) });
                    res.statusCode = 200;
                    res.end(JSON.stringify(deletedRow));
                } catch (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: err.message }));
                }
            });
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Ruta nije pronađena." }));
    }
});

// Pokreće server na zadanom portu
server.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
});

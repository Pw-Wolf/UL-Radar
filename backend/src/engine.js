// const sqlite = require("node:sqlite");
const { DatabaseSync } = require("node:sqlite");

function createDatabase() {
	const database = new DatabaseSync("./models/database.sqlite");

	// Kreirati tablice ako ne postoje
	database.exec(`
		CREATE TABLE IF NOT EXISTS ocitanja (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			datum TEXT NOT NULL,
			us_1 REAL NOT NULL,
			us_2 REAL NOT NULL,
			red INTEGER NOT NULL,
			buzzer INTEGER NOT NULL
		);
		`);

	// database.close();
	return database; // Vraća instancu baze podataka
}


// Funkcija za ispis svih podataka iz tabele
function displayData(database, tableName) {
	// Priprema SQL upita za čitanje podataka
	const query = database.prepare(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 20`);
	
	// Izvršavanje upita i ispis rezultata
	const rows = query.all();
	// console.log(`Podaci iz ${tableName}:`);
	// console.log(rows);
	return rows; // Vraća niz rezultata
}

function updateData(database, tableName, updates) {
	// Proveri da li je `id` prisutan u updates
	if (!updates.id) {
		throw new Error("Polje 'id' je obavezno u objektu updates.");
	}
	
	// Ekstraktuj `id` iz updates i pripremi ostale kolone za ažuriranje
	const { id, ...updateFields } = updates;
	
	// Izgradnja seta za ažuriranje (e.g., "kolona1 = ?, kolona2 = ?")
	const setClause = Object.keys(updateFields)
	.map((key) => `${key} = ?`)
	.join(", ");
	
	// Vrednosti za ažuriranje
	const values = [...Object.values(updateFields), id];
	
	// Priprema SQL upita
	const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
	const statement = database.prepare(query);
	
	// Izvrši ažuriranje
	statement.run(...values);
	
	// Povlačenje ažurirane vrijednosti
	const select = database.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
	const insertedRow = select.get(id);
	console.log(`Podatak u tabeli "${tableName}" sa ${id} je uspešno ažuriran na vrijednost "${values[0]}".`);
	return insertedRow
}

// Funkcija za unos podataka u određenu tabelu (dinamički unos vrednosti prema kolonama)
function insertData(database, tableName, data) {
	// Dinamički izgradnja SQL upita
	const columns = Object.keys(data).join(", "); // Ključevi objekta su nazivi kolona
	const values = Object.values(data); // Vrednosti objekta
	const placeholders = values.map(() => "?").join(", "); // Placeholderi za vrednosti

	// Priprema SQL upita za unos u dinamičku tabelu
	const insert = database.prepare(
		`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
	);

	// Unos podataka u tabelu
	const result = insert.run(...values); // Spread operator za prosleđivanje vrednosti u upit
	const lastId = result.lastInsertRowid; 

	const select = database.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
	const insertedRow = select.get(lastId);
	// console.log(`Podaci su uspešno uneti u tabelu "${tableName}".`);
	return insertedRow
}

function deleteData(database, tableName, condition) {
	// Proveri da li je prosleđen uslov za brisanje
	if (!condition || typeof condition !== "object" || Object.keys(condition).length === 0) {
		throw new Error("Morate specificirati uslov za brisanje u formatu { 'stupac': 'vrednost' }.");
	}

	// Ekstraktuj ime stupca i vrednost iz objekta uslova
	const [columnName, value] = Object.entries(condition)[0];

	// Priprema SQL upita za brisanje
	const query = `DELETE FROM ${tableName} WHERE ${columnName} = ?`;
	const statement = database.prepare(query);

	// Izvrši brisanje
	statement.run(value);
	msg = `Podaci iz tabele "${tableName}" gde je ${columnName} = ${value} su uspešno obrisani.`
	console.log(msg);
	return msg;
}

module.exports = { createDatabase, insertData, displayData, updateData, deleteData };

# UL-Radar

UL-Radar je projekt koji integrira razne senzore i komponente za praćenje i prikaz podataka pomoću Raspberry Pi. Projekt uključuje ultrazvučne senzore, mikrofon, motor, LED diode i OLED zaslon. Podaci prikupljeni sa senzora šalju se na backend poslužitelj i prikazuju na web sučelju.

## Struktura Projekta

```
backend/
  ├── models/
  │   └── database.sqlite
  ├── package.json
  ├── public/
  │   ├── icon.png
  │   ├── index.html
  │   ├── script.js
  │   └── style.css
  └── src/
      ├── engine.js
      └── routes.js
pi/
  ├── display.py
  ├── main.py
  ├── microphone.py
  ├── motor.py
  └── ultrasonic.py
README.md
```

## Backend

Backend je odgovoran za posluživanje web sučelja i rukovanje pohranom i dohvaćanjem podataka. Koristi SQLite za bazu podataka i Node.js za poslužitelj.

### Datoteke

- `backend/models/database.sqlite`: SQLite datoteka baze podataka.
- `backend/package.json`: Sadrži metapodatke i skripte projekta.
- `backend/public/index.html`: Glavna HTML datoteka za web sučelje.
- `backend/public/script.js`: JavaScript datoteka za rukovanje ažuriranjima grafikona i obavijestima.
- `backend/public/style.css`: CSS datoteka za stiliziranje web sučelja.
- `backend/src/engine.js`: Sadrži funkcije za operacije s bazom podataka.
- `backend/src/routes.js`: Definira rute poslužitelja i rukuje HTTP zahtjevima.

### Pi Datoteke

- `pi/display.py`: Rukuje OLED zaslonom.
- `pi/main.py`: Glavna skripta koja integrira sve komponente i šalje podatke na backend.
- `pi/microphone.py`: Rukuje unosom mikrofona i izlazom zujalice.
- `pi/motor.py`: Kontrolira motor.
- `pi/ultrasonic.py`: Čita podatke s ultrazvučnih senzora.

## Pokretanje Backend-a

Za pokretanje backend poslužitelja, pokrenite sljedeću naredbu:

```sh
npm start
```

## Pokretanje Pi Instance

Za pokretanje Pi instance, pokrenite sljedeću naredbu:

```sh
python3 main.py
```

## Značajke

- **Status Crvenog Svjetla**: Prikazuje status crvenog svjetla.
- **Status Zvuka**: Prikazuje status zvuka detektiranog mikrofonom.
- **Podaci Ultrazvučnog Senzora**: Prikazuje podatke s dva ultrazvučna senzora.
- **Obavijesti**: Prikazuje obavijesti o sirovim podacima.

## Ovisnosti

### Backend

- Node.js
- SQLite

### Raspberry Pi

- RPi.GPIO
- requests
- json
- PIL (Pillow)
- adafruit_ssd1306
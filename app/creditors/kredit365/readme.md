![Kredit 365](./logga.png "Kredit 365")
# Skrapning av [Kredit365](https://www.kredit365.se)

**Vad programmet gör**
1. Startar upp en 'headless' webbläsare (Chromium) mha Puppeteer paketet
2. [Konfigurerar webbläsaren](../browserManager.js "browserManager.js") för att undvika bli avslöjad som ett scraper-program
3. Navigerar till [webbsidan där datan finns](https://www.kredit365.se/priser-p%C3%A5-l%C3%A5n "https://www.kredit365.se/priser-på-lån")
4. [Extraherar rubrikerna](./index.js "index.js") från HTML-tabellen med datan och kontrollerar att de inte förändrats
5. [Extraherar datan](./index.js "index.js") datan från HTML-tabell till 2D-array där datan typomvandlats till Number
6. [Transformerar datan](./transform-to-MongoDB-documents.js "transform-to-MongoDB-documents.js") till ett format som används i databasen med hjälp av ett [schema](./schema.json "schema.json")
7. Slutligen sparas datan i databasen (MongoDB)

*Så här ser datan ut efter extraktion och typomvandling:*
```javascript
data = [
  [ 2000, 350, 45, 64,  2459, 1135, 39 ],
  [ 3000, 350, 45, 96,  3491, 532,  39 ],
  [ 4000, 350, 45, 128, 4523, 346,  39 ],
  [ 5000, 350, 45, 160, 5555, 260,  39 ]
]

```

*Så här ser datan efter transformation och redo för att lagras i databasen*
```javascript
data = [
{
	"belopp": 2000,
	"uppl.avg": 350,
	"fakt.avg": 45,
	"ränta (kr)": 64,
	"betala totalt": 2459,
	"eff. ränta (%)": 1135,
	"nom. ränta (%)": 39,
	"löptid (d)": 30
}, {
	"belopp": 3000,
	"uppl.avg": 350,
	"fakt.avg": 45,
	"ränta (kr)": 96,
	"betala totalt": 3491,
	"eff. ränta (%)": 532,
	"nom. ränta (%)": 39,
	"löptid (d)": 30
}, {
	"belopp": 4000,
	"uppl.avg": 350,
	"fakt.avg": 45,
	"ränta (kr)": 128,
	"betala totalt": 4523,
	"eff. ränta (%)": 346,
	"nom. ränta (%)": 39,
	"löptid (d)": 30
}, {
	"belopp": 5000,
	"uppl.avg": 350,
	"fakt.avg": 45,
	"ränta (kr)": 160,
	"betala totalt": 5555,
	"eff. ränta (%)": 260,
	"nom. ränta (%)": 39,
	"löptid (d)": 30
}]

```

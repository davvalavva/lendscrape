Efter att ha extraherat datan ur html-tabellen ser datan ut så här (JavaScript):
[
  [ 2000, 350, 45, 64,  2459, 1135, 39 ],
  [ 3000, 350, 45, 96,  3491, 532,  39 ],
  [ 4000, 350, 45, 128, 4523, 346,  39 ],
  [ 5000, 350, 45, 160, 5555, 260,  39 ]
]

Efter transformerat datan till den struktur som förväntas av databasen ser datan ut så här (JSON):
[{
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

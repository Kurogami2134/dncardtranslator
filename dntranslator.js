var CARTAS = [];
var lang = "es";
var psct = false;
Engine = window.wrappedJSObject.Engine;

function PSCTparseText(desc) {
	let new_desc = "";

	let effects = desc.replaceAll(". ", ".").replaceAll(" />", ">").split(".");


	for (let x = 0; x < effects.length-1; x++) {
		let COND = "";
		let COST = "";
		let EFFECT = "";
		
		let line = effects[x];
		
		if (line.includes("●")) {
			new_desc += line;
			continue;
		}
		
		if (x == 0 && line.includes("<br>")) {
			new_desc = line.split("<br>")[0]+"<br>";
			line = line.replace(new_desc, "");
		}
		
		if (line.includes(":")) {
			COND = line.split(":")[0];
			line = line.replace(COND, "");
		}
		
		if (line.includes(";")) {
			COST = line.split(";")[0];
			line = line.replace(COST, "");
		}
		
		new_desc += "<span style='color: green;'>"+COND+"</span>";
		new_desc += "<span style='color: red;'>"+COST+"</span>";
		new_desc += "<span style='color: blue;'>"+line+". </span>";
	}
	
	return new_desc;
}

function Translate(id, data) {
	Engine.database.cards[id%1E11]["name"] = data.split('lang="'+lang+'">')[1].split("<")[0];
	desc = data.split('lang="'+lang+'">')[2].split("</span")[0];
	if (psct) desc = PSCTparseText(desc);
	Engine.database.cards[id%1E11]["description"] = desc;
}

function PuAS(a) {
	card = Engine.database.cards[a%1E11];
	
	if (card == undefined) {
		return card;
	}
	
	if (!(CARTAS.includes(a))) {
		jQuery.get('https://yugipedia.com/wiki/'+card["name"].replaceAll(" ", "_"), null, function (data) {Translate(a, data);})
		CARTAS.push(a)
	}
	
	return card;
}

exportFunction(PuAS, window, { defineAs: "PuAS" });

function start() {
	Engine.getCardData=window.wrappedJSObject.PuAS;
	window.wrappedJSObject.CARTAS = {};
	console.log("Translator started!");
}

function onError(error) {
	console.log(`Error: ${error}`);
}
function onGot(result) {
	lang = result.lang;
	psct = result.psct;
	console.log(`PSCT Highlighting is: ${(result.lang) ? "on" : "off"}`);
	console.log(`Language set to: ${result.lang}`);
}

const getting = browser.storage.local.get(["lang", "psct"]);
getting.then(onGot, onError);

setTimeout(start, 2500);
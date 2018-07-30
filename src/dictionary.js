class Dictionary
{
    static checkVowel(str)
    {
        let vowels = ['a', 'e', 'i', 'o', 'u'];
        let hold = "a " + str.toLowerCase();
        vowels.forEach(function (item) { if(str.toLowerCase().charAt(0) === item) hold = "an " + str.toLowerCase(); });
        return hold;
    }

    static getInfo(str) { return str.substring(str.indexOf('":"') + 3, str.length); }

    static keyToDef(key)
    {
        const k = key.toString().split("-");

        const word = {
            //Damage types
            "1":"sever",
            "2":"blunt",
            "3":"shot",
            "4":"fire",
            "5":"water",
            "6":"thunder",
            "7":"ice",
            "8":"dragon",
            //Body parts
            "An":"antennae",
            "Ba":"back",
            "Bo":"body",
            "Ch":"chest",
            "Ex":"exhaust organ",
            "Fi":"fin",
            "FA":"forearms",
            "FL":"forelegs",
            "He":"head",
            "HL":"hindlegs",
            "HS":"hard shell",
            "Ho":"horn",
            "Ja":"jaw",
            "Le":"legs",
            "LB":"lower body",
            "Ne":"neck",
            "No":"nose",
            "NP":"neck pouch",
            "Ro":"rock",
            "Sh":"shell",
            "Ta":"tail",
            "TT":"tail tip",
            "To":"tongue",
            "Wi":"wings",
            //Misc drop sources
            "QR":"Quest Reward",
            "Ca":"Capture",
            "IR":"Investigation reward ",
            "PB":"Palico bonus",
            "Pl":"Plunderblade",
            "SD":"Shiny drop",
            "Tr":"Track",
            //Encounter types
            "AC":"After cutscene",
            "In":"Invasion spawn",
            "IS":"Initial spawn"
        };

        const suffix = {
            //Part modifiers
            "Bl":" while they're black",
            "Bo":" when bony",
            "CS":" in it's critical state",
            "E" :" while they're electrified",
            "GB":" while they're glossy black",
            "H" :" when they're heated" ,
            "MA":" while they're covered in magma",
            "M" :" while they're muddy",
            "R1":", on rock one",
            "R2":", on rock two",
            "Wh":" while they're white",
            "Wo":" after wounding it",
            //Non part modifiers
            "C":" carve",
            "G":"(Gold)",
            "S":"(Silver)",
            "W":" wound"
        };

        return (word[k[0]] || "") + (suffix[k[1]] || "");
    }

    static stringToArr(str, tok)
    {
        let size, i;
        str = str.split("\\n");
        size = str.length;
        for(i = 0; i < size; ++i) str[i] = str[i].split(tok);
        return str;
    }

    static toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

module.exports = Dictionary;
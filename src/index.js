const Commando = require('discord.js-commando');
const Guildmarm = new Commando.Client();
const fs = require('fs');

let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
var token = rawText[0];

Guildmarm.registry.registerGroup('monsterinfo');
Guildmarm.registry.registerGroup('questinfo');
Guildmarm.registry.registerGroup('iteminfo');
Guildmarm.registry.registerDefaults();
Guildmarm.registry.registerCommandsIn(__dirname + '/commands');

Guildmarm.login(token);
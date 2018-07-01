const Commando = require('discord.js-commando');
const Guildmarm = new Commando.Client();
const fs = require('fs');

let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString();
var token = rawText.substring(0, rawText.indexOf("\r"));

Guildmarm.registry.registerGroup('monsterinfo', 'MonsterInfo');
Guildmarm.registry.registerDefaults();
Guildmarm.registry.registerCommandsIn('./commands');

Guildmarm.login(token);
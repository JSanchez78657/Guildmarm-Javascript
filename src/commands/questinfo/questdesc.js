const Commando = require('discord.js-commando');

function getName(str)
{
    //return
}

/*
[ '"_id":"5b59dc9c65b12a4a000170df',
  'Name":"Old World Monster In The New World',
  'Type":"Assigned',
  'Rank":7,"Map":"Coral Highlands',
  'Prerequisites":"12| | | | | |',
  'Fail":"faint 3 times, or time runs out.',
  'QuestReward":"12600 Zenny',
  'Objective":"Complete the assignment: We\'ve finally tracked down the source of those mysterious tracks. Report to the Coral Highlands and seek it out! I\'ll be expecting your report as soon as you\'re done!',
  'Drops":"Monster Hardbone,1,24\\nMonster Keenbone,1,20\\nCarbalite Ore,1,18\\nMysterious Feystone,1,18\\nNovacrystal,1,15\\nSpiritcore Ore,1,12\\nAdvanced Armor Sphere,1,1',
  'Monsters":"Pink Rathian,IS,100,550,12600\\nTzitzi-Ya-Ku,IS,100,350,5400\\nLegiana,IS,100,50,12600\\nOdogaron,In,500,12600"' ]
*/

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

class Questdesc extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'questdesc',
            group: 'questinfo',
            memberName: 'description',
            description: 'Gives the description of the components of the quest.'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const url = 'https://sophiadb-1e63.restdb.io/rest/quests?q={"Name": "' + toTitleCase(args) + '"}';

        const options =
            {
                method: 'GET',
                url: url,
                headers:
                    {
                        'cache-control': 'no-cache',
                        'x-apikey': apiKey
                    }
            };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            //Checks if there was an actual monster requested at all.
            if(!args) message.reply('I can\'t just look up nothing!');
            //Checks if the database had an actual entry for the monster requested.
            else if(body !== '[]')
            {
                let strHold = "";
                let name, rank, map, type, prereq, objective, fail, qReward, qDrops, monsters;
                //Remove the end bits of the string ("[{" and "}]), then separates the string using its separators.
                //Original format of the string is "[{"data-name":"data", "data-name":"data",...,"data-name":"data"}].
                body = body.toString().substring(2, body.lastIndexOf('}]')).split('","');
                console.log(body);
                //Searches through the array for the specific category of information.
                body.forEach(function (item) {
                    if(item.includes("Name")) name = getName(item);
                })
            }
            else message.reply('I don\'t have a record of that quest!');
        });
    }
}

module.exports = Questdesc;
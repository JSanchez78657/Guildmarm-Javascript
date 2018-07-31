const Commando = require('discord.js-commando');
const Dictionary = require('../../dictionary');

class Monstersearch extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'monstersearch',
            group: 'monsterinfo',
            memberName: 'search',
            description: 'Gives a list of quests to take to fight this monster.'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');
        args = Dictionary.toTitleCase(args);

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const url = rawText[2] + 'quests';

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
            let nameHold, strHold, arrHold, i;
            strHold = "";
            if (error) throw new Error(error);
            //Checks if there was an actual monster requested at all.
            if(!args) message.reply('I can\'t just look up nothing!');
            //Checks if the database had an actual entry for the monster requested.
            else if(body !== '[]')
            {
                //Remove the end bits of the string ("[{" and "}]), then separates the string using its separators.
                //Original format of the string is "[{"data-name":"data", "data-name":"data",...,"data-name":"data"}].
                body = body.toString().substring(2, body.lastIndexOf('}]')).split('","');
                //Searches through the array for the specific category of information.
                body.forEach(function (item) {
                    //Extracts the actual data from the string.
                    if(item.includes("Name")) nameHold = Dictionary.getInfo(item);
                    if(item.includes("Monsters") && item.includes(args))
                    {
                        arrHold = Dictionary.stringToArr(Dictionary.getInfo(item), ",");
                        for(i = 0; i < arrHold.length; ++i) if(arrHold[i][0] === args) strHold += nameHold;
                    }
                });
                if(strHold === "") message.reply("Sorry doodle! I can't find any quests where you hunt a " + args);
                else message.reply("Alright, doodle! You can hunt a " + args + " in these quests: \n" + strHold);
            }
            else message.reply('I don\'t have a record of that monster!');
        });
    }
}

module.exports = Monstersearch;
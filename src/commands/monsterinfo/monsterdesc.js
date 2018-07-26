const Commando = require('discord.js-commando');

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

class Monsterdesc extends Commando.Command
{

    constructor(client)
    {
        super(client, {
            name: 'monsterdesc',
            group: 'monsterinfo',
            memberName: 'description',
            description: 'Gives the in game journal description of a monster'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const url = 'https://sophiadb-1e63.restdb.io/rest/monsters?q={"Name": "' + toTitleCase(args).toString() + '"}';

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
                //Remove the end bits of the string ("[{" and "}]), then separates the string using its separators.
                //Original format of the string is "[{"data-name":"data", "data-name":"data",...,"data-name":"data"}].
                body = body.toString().substring(2, body.lastIndexOf('}]')).split('","');
                //Searches through the array for the specific category of information.
                body.forEach(function (item) {
                    //Extracts the actual data from the string.
                    if (item.includes("Description")) message.reply(item.substring(item.indexOf('":"') + 3, item.length));
                })
            }
            else message.reply('I don\'t have a record of that monster!');
        });
    }
}

module.exports = Monsterdesc;
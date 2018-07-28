const Commando = require('discord.js-commando');
const Dictionary = require('../../dictionary');

class Itemsearch extends Commando.Command
{

    constructor(client)
    {
        super(client, {
            name: 'itemsearch',
            group: 'iteminfo',
            memberName: 'search',
            description: 'Searches monster and quest drops for an item.'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const monUrl = 'https://sophiadb-1e63.restdb.io/rest/monsters';
        const questUrl = 'https://sophiadb-1e63.restdb.io/rest/monsters';

        const monGrab =
            {
                method: 'GET',
                url: monUrl,
                headers:
                    {
                        'cache-control': 'no-cache',
                        'x-apikey': apiKey
                    }
            };

        const questGrab =
            {
                method: 'GET',
                url: questUrl,
                headers:
                    {
                        'cache-control': 'no-cache',
                        'x-apikey': apiKey
                    }
            };

        request(monGrab, function (error, response, body) {
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
                    console.log(item + '\n');
                })
            }
            else message.reply('I don\'t have a record of that monster!');
        });
    }
}

module.exports = Itemsearch;
const Commando = require('discord.js-commando');

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
        const apiKey = rawText[5];
        const url = 'https://sophiadb-1e63.restdb.io/rest/monsters?q={"Name": "' + args.toString() + '"}';

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
            if(!args) message.reply('I can\'t just look up nothing!');
            else if(body !== '[]')
            {
                body = body.toString().substring(2, body.lastIndexOf('}]')).split(',');
                body.forEach(function (item) {
                    if (item.includes("Description")) message.reply(item.substring(item.indexOf('":"') + 3, item.lastIndexOf('"')));
                })
            }
            else message.reply('I don\'t have a record of that monster!');
        });
    }
}

module.exports = Monsterdesc;
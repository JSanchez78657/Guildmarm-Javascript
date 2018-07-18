const Commando = require('discord.js-commando');

class Monsterrecc extends Commando.Command
{

    constructor(client)
    {
        super(client, {
            name: 'monsterrecc',
            group: 'monsterinfo',
            memberName: 'reccomendation',
            description: 'Gives a reccomendation of what type of weapon to bring against this monster.'
        });
    }

    async run(message, args)
{
    const request = require('request');
    const fs = require('fs');

    let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
    const apiKey = rawText[1];
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
                if (item.includes("Resistances"))
                {
                    console.log(item.toString());
                }//message.reply(item.substring(item.indexOf('":"') + 3, item.lastIndexOf('"')));
            })
        }
        else message.reply('I don\'t have that monster\'s resistances, sorry!');
    });
}
}

module.exports = Monsterrecc;
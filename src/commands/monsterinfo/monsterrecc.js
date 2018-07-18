const Commando = require('discord.js-commando');

function intToStr(int)
{
    switch(int)
    {
        case 1: return "sever";
        case 2: return "blunt";
        case 3: return "shot";
        case 4: return "fire";
        case 5: return "water";
        case 6: return "thunder";
        case 7: return "ice";
        case 8: return "dragon";
        default: return "ERROR";
    }
}

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

        request(options, function (error, response, body)
        {
            if (error) throw new Error(error);
            if (!args) message.reply('I can\'t just look up nothing!');
            else if (body !== '[]')
            {
                body = body.toString().substring(2, body.lastIndexOf('}]')).split(',');
                body.forEach(function (item)
                {
                    if (item.includes("Resistances"))
                    {
                        const rawRes = String(item.substr(item.indexOf('":"') + 3, item.lastIndexOf('"')));
                        var resArr = rawRes.split("\\n");
                        const hold = resArr.length - 1;
                        var strHold = String();
                        var sum = 0;
                        var maxSum, maxDmg, maxEle, i, j;
                        for (i = 0; i < hold; ++i)
                        {
                            strHold = resArr[i];
                            resArr[i] = new Array(9);
                            resArr[i] = strHold.split(' ');
                        }
                        maxSum = 0;
                        for (j = 1; j < 4; ++j)
                        {
                            for (i = 0; i < hold; ++i)
                            {
                                //message.reply("Sum: " + sum + " + resArr[" + i + "][" + j + "]: " + Number(resArr[i][j]) + " = " + (sum + Number(resArr[i][j])));
                                sum += Number(resArr[i][j]);
                            }
                            //message.reply("Sum: " + sum + " > maxSum: " + maxSum + ":");
                            if (sum > maxSum)
                            {
                                //message.reply("TRUE; maxSum = " + sum + " maxDMG = " + intToStr(j));
                                maxSum = sum;
                                maxDmg = j;
                            }
                            //else message.reply("FALSE;");
                            sum = 0;
                        }
                        maxSum = 0;
                        for (j = 4; j < 9; ++j)
                        {
                            for (i = 0; i < hold; ++i)
                            {
                                //message.reply("Sum: " + sum + " + resArr[" + i + "][" + j + "]: " + Number(resArr[i][j]) + " = " + (sum + Number(resArr[i][j])));
                                sum += Number(resArr[i][j]);
                            }
                            //message.reply("Sum: " + sum + " > maxSum: " + maxSum + ":");
                            if (sum > maxSum)
                            {
                                //message.reply("TRUE; maxSum = " + sum + " maxDMG = " + intToStr(j));
                                maxSum = sum;
                                maxEle = j;
                            }
                            //else message.reply("FALSE;");
                            sum = 0;
                        }
                        message.reply("You should use a " + intToStr(maxDmg) + " " + intToStr(maxEle) + " weapon.");
                    }
                })
            }
            else message.reply('I don\'t have that monster\'s resistances, sorry!');
        });
    }
}


module.exports = Monsterrecc;
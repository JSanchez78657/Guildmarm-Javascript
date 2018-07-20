const Commando = require('discord.js-commando');

function intToDmg(int)
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

function    keyToPart(key)
{
    let part;
    let fullName;
    let modifier;
    if(key.includes("-"))
    {
        modifier = key.substring(key.indexOf("-"), key.length - 1);
        part = key.substring(0, key.indexOf("-"));
    }
    else part = key;

    switch(part)
    {
        case "An": fullName = "antennae"; break;
        case "Ba": fullName = "back"; break;
        case "Bo": fullName = "body"; break;
        case "Ch": fullName = "chest"; break;
        case "Ex": fullName = "exhaust organ"; break;
        case "Fi": fullName = "fin"; break;
        case "FA": fullName = "forearms"; break;
        case "FL": fullName = "forelegs"; break;
        case "He": fullName = "head"; break;
        case "HL": fullName = "hindlegs"; break;
        case "Ho": fullName = "horn"; break;
        case "Ja": fullName = "jaw"; break;
        case "Le": fullName = "legs"; break;
        case "LB": fullName = "lower body"; break;
        case "Ne": fullName = "neck"; break;
        case "No": fullName = "nose"; break;
        case "NP": fullName = "neck pouch"; break;
        case "Ro": fullName = "rock"; break;
        case "Sh": fullName = "shell"; break;
        case "Ta": fullName = "tail"; break;
        case "TT": fullName = "tail tip"; break;
        case "To": fullName = "tongue"; break;
        case "Wi": fullName = "wings"; break;
        default: fullName = " uhhh.... weak point"; break;
    }

    if(modifier.length > 0)
    {
        switch(modifier)
        {
            case "Bl": fullName = "black " + fullName; break;
            case "Bo": fullName = "bony " + fullName; break;
            case "CS": fullName += " while in it's critical state"; break;
            case "E":  fullName = "electrified " + fullName; break;
            case "GB": fullName = "glossy black " + fullName; break;
            case "H":  fullName = "heated " + fullName; break;
            case "MA": fullName = "magma covered " + fullName; break;
            case "M":  fullName = "muddy " + fullName; break;
            case "R1": fullName = "rock one on it's " + fullName; break;
            case "R2": fullName = "rock two on it's " + fullName; break;
            case "Wh": fullName = "white " + fullName; break;
            case "Wo": fullName = "wounded " + fullName; break;
        }
    }
    return fullName;
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
                        let resArr = rawRes.split("\\n");
                        const hold = resArr.length - 1;
                        let strHold = String();
                        let sum = 0;
                        let maxSum, maxDmg, maxEle, bestPart, i, j;
                        for (i = 0; i < hold; ++i)
                        {
                            strHold = resArr[i];
                            resArr[i] = new Array(9);
                            resArr[i] = strHold.split(' ');
                        }
                        maxSum = 0;
                        for (j = 1; j < 4; ++j)
                        {
                            for (i = 0; i < hold; ++i) sum += Number(resArr[i][j]);
                            if (sum > maxSum)
                            {
                                maxSum = sum;
                                maxDmg = j;
                            }
                            sum = 0;
                        }
                        maxSum = 0;
                        for (j = 4; j < 9; ++j)
                        {
                            for (i = 0; i < hold; ++i) sum += Number(resArr[i][j]);
                            if (sum > maxSum)
                            {
                                maxSum = sum;
                                maxEle = j;
                            }
                            sum = 0;
                        }
                        //Using maxSum because I can't think of a better name for maxDmg(sever/blunt/shot).
                        maxSum = 0;
                        for(i = 0; i < hold; ++i)
                        {
                            sum = Number(resArr[i][maxDmg]) + Number(resArr[i][maxEle]);
                            if(sum > maxSum)
                            {
                                maxSum = sum;
                                bestPart = i;
                            }
                        }
                        message.reply("Alright doodle, if you want to take down a " + args.toString() +
                                      ", you should bring a " + intToDmg(maxDmg) + " " + intToDmg(maxEle) +
                                      " weapon, and make sure to hit it's " + keyToPart(resArr[bestPart][0].toString() +
                                      "!"));
                    }
                })
            }
            else message.reply('I don\'t have that monster\'s resistances, sorry!');
        });
    }
}


module.exports = Monsterrecc;
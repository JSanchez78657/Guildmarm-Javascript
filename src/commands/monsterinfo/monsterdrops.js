const Commando = require('discord.js-commando');

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function keyToSource(key)
{
    const k = key.split("-");

    const source = {
        "Bo":"Body",
        "Ca":"Capture",
        "FA":"Forearms",
        "HL":"Hindlegs",
        "HS":"Hard shell",
        "IR":"Investigation reward",
        "PB":"Palico bonus",
        "Pl":"Plunderblade",
        "SD":"Shiny drop",
        "Ta":"Tail",
        "Tr":"Track"
    };

    const modifier = {
        "C":" carve",
        "G":"(Gold)",
        "S":"(Silver)",
        "W":" wound"
    };

    return (source[k[0]] || "") + (modifier[k[1]] || "");
}

function parseDrops(item)
{
    const rawDrops = String(item.substring(item.indexOf('":"') + 3, item.length));
    let dropArr = rawDrops.split("\\n");
    let i, j, k, arrSize, strHold, arrHold, maxDrop, maxIndex;
    arrSize = dropArr.length;
    if(arrSize > 1)
    {
        for (i = 0; i < arrSize; ++i)
        {
            strHold = dropArr[i];
            dropArr[i] = new Array(3);
            if (strHold.includes("P: ")) dropArr[i][0] = strHold;
            else dropArr[i] = strHold.split(" ");
        }

        for (i = 0; i < arrSize; ++i)
        {
            if (!dropArr[i][0].includes("P: "))
            {
                //some kind of sort
                for (j = i; j < arrSize && !dropArr[j][0].includes("P: "); ++j)
                {
                    maxDrop = 0;
                    for (k = j; k < arrSize && !dropArr[k][0].includes("P: "); ++k)
                    {
                        if (parseInt(dropArr[k][2]) > maxDrop)
                        {
                            maxDrop = dropArr[k][2];
                            maxIndex = k;
                        }
                    }
                    arrHold = dropArr[j];
                    dropArr[j] = dropArr[maxIndex];
                    dropArr[maxIndex] = arrHold;
                }
                i = j - 1;
            }
        }

        strHold = "";
        for (i = 0; i < arrSize; ++i)
        {
            if (dropArr[i][0].includes("P: ")) strHold += dropArr[i][0].substring(3, dropArr[i][0].length);
            else
            {
                strHold += "\t" + keyToSource(dropArr[i][0]) + " (x" + dropArr[i][1] + "): " + dropArr[i][2] + "%";
            }
            strHold += "\n";
        }
    }
    else strHold = "I have no data for " + item.substring(0, item.indexOf("Drops")).toLowerCase() + " rank drops! Sorry!";
    return strHold;
}

class Monsterdrops extends Commando.Command
{

    constructor(client)
    {
        super(client, {
            name: 'monsterdrops',
            group: 'monsterinfo',
            memberName: 'drops',
            description: 'Gives a list of the drops of a monster.'
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
                    if (item.includes("LowDrops") || item.includes("HighDrops")) message.reply(parseDrops(item));
                })
            }
            else message.reply('I don\'t have a record of that monster!');
        });
    }
}

module.exports = Monsterdrops;
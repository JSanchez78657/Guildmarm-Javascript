const Commando = require('discord.js-commando');
const Dictionary = require('../../dictionary');

function parseDrops(item, key)
{
    let dropArr = item.split("\\n");
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
            if (dropArr[i][0].includes(key))
            {
                for(j = i + 1; j < arrSize && !dropArr[j][0].includes("P: "); ++j)
                    strHold += "\t\t\t" + Dictionary.toTitleCase(Dictionary.keyToDef(dropArr[j][0])) +
                               " (x" + dropArr[j][1] + "): " + dropArr[j][2] + "%\n";
            }
        }
    }
    else strHold = "I have no data for " + item.substring(0, item.indexOf("Drops")).toLowerCase() + " rank drops! Sorry!";
    return strHold;
}

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
        let arrHold;
        args = Dictionary.toTitleCase(args);

        const apiKey = rawText[1];
        const monUrl = rawText[2] + 'monsters';
        const questUrl = rawText[2] + 'quests';

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

        request(monGrab, function (error, response, body)
        {
            let monName, monHold;
            monHold = "";
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
                    if(item.includes("Name")) monName = Dictionary.getInfo(item);
                    if(item.includes("Drops") && item.includes(args))
                    {
                        monHold += "\t" + monName + "\n";
                        if(item.includes("LowDrops")) monHold += "\t\t" + "Low Rank:" + "\n";
                        else monHold += "\t\t" + "High Rank:" + "\n";
                        monHold += parseDrops(Dictionary.getInfo(item), args);
                    }
                });
                if(monHold !== "") message.reply("\nMonsters that drop " + args + ":\n" + monHold);
            }
            else message.reply('I don\'t have a record of that monster!');
        });

        request(questGrab, function (error, response, body)
        {
            let lastName, arrSize, questHold, i;
            questHold = "";
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
                body.forEach(function (item)
                {

                    if (item.includes("Name")) lastName = Dictionary.getInfo(item);
                    if (item.includes("Drops") && item.includes(args))
                    {
                        arrHold = Dictionary.stringToArr(Dictionary.getInfo(item), ",");
                        questHold += "\t" + lastName + "\n";
                        i = 0;
                        arrSize = arrHold.length;
                        for(i = 0; i < arrSize; ++i)
                        {
                            if (arrHold[i][0] === args)
                                questHold += "\t\t Quest Reward (x" + arrHold[i][1] + ") (" + arrHold[i][2] + "%)\n";
                        }
                    }
                });
                if(questHold !== "") message.reply("\nQuests that drop " + args + ":\n" + questHold);
            }
            else message.reply("I don't have any record of that item!");
        });
    }
}

module.exports = Itemsearch;
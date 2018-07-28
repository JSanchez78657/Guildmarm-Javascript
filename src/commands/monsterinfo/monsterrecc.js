const Commando = require('discord.js-commando');
const Dictionary = require('../../dictionary');

class Monsterrecc extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'monsterrecc',
            group: 'monsterinfo',
            memberName: 'recommendation',
            description: 'Gives a recommendation of what type of weapon to bring against this monster.'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const url = 'https://sophiadb-1e63.restdb.io/rest/monsters?q={"Name": "' + Dictionary.toTitleCase(args).toString() + '"}';

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
            //Checks if there was an actual monster requested at all.
            if (!args) message.reply('I can\'t just look up nothing!');
            //Checks if the database had an actual entry for the monster requested.
            else if (body !== '[]')
            {
                //Remove the end bits of the string ("[{" and "}]), then separates the string using its separators.
                //Original format of the string is "[{"data-name":"data", "data-name":"data",...,"data-name":"data"}].
                body = body.toString().substring(2, body.lastIndexOf('}]')).split('","');
                //Searches through the array for the specific category of information.
                body.forEach(function (item)
                {
                    if (item.includes("Resistances"))
                    {
                        //Extracts the actual data from the string.
                        const rawRes = String(item.substr(item.indexOf('":"') + 3, item.length));
                        //Separates the string into an array of strings
                        //In this case, "-body part- x x x x x x x" where x is a number.
                        let resArr = rawRes.split("\\n");
                        //Used to determine how many body parts the monster has.
                        const hold = resArr.length - 1;
                        let strHold = String();
                        let sum = 0;
                        let maxSum, maxDmg, maxEle, bestPart, i, j;
                        //Turns the string array into an array of arrays (two-dimensional), where the first column
                        //of every row is the body part, and the following columns are the resistance numbers.
                        for (i = 0; i < hold; ++i)
                        {
                            strHold = resArr[i];
                            resArr[i] = new Array(9);
                            resArr[i] = strHold.split(' ');
                        }
                        maxSum = 0;
                        //Totals each resistance column, saving the largest total as the most effective for standard
                        //damage type (severing, blunt, and shot).
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
                        //As above, but for the elements (fire, water, thunder, ice, and dragon).
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
                        //Adds together the damage for the combination of the two best damage types on each body part
                        //to find the most effective place to attack.
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
                        message.reply("Alright doodle, if you want to take down a " +
                                      Dictionary.toTitleCase(args.toString()) + ", you should bring a " +
                                      Dictionary.keyToDef(maxDmg) + " " + Dictionary.keyToDef(maxEle) +
                                      " weapon, and make sure to hit it's " + Dictionary.keyToDef(resArr[bestPart][0]) +
                                      "!");
                    }
                })
            }
            else message.reply('I don\'t have that monster\'s resistances, sorry!');
        });
    }
}


module.exports = Monsterrecc;
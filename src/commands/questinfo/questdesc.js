const Commando = require('discord.js-commando');
const Dictionary = require('../../dictionary');

function listPrereqs(str)
{
    let arr = str.split('|');
    let i, numArgs, argsDone, size;
    size = arr.length;
    argsDone = numArgs = 0;
    str = "";
    for(i = 0; i < size; ++i)
    {
        if(arr[i] !== " ")
        {
            ++numArgs;
        }
    }
    if(numArgs > 0 && arr[0] === " ") str += "have ";
    for(i = 0; i < size; ++i)
    {
        if(argsDone < numArgs && arr[i] !== " ")
        {
            if(argsDone === numArgs - 1 && argsDone !== 0) str += "and ";
            if(i === 1) str += "have ";
            switch(i)
            {
                case 0: str += "be HR " + arr[i] + ", "; break;
                case 1: str += "completed " + arr[i] + ", "; break;
                case 2: str += "found a " + arr[i] + ", "; break;
                case 3: str += "hunted a " + arr[i] + ", "; break;
                case 4: str += "captured a " + arr[i] + ", "; break;
                case 5: str += "researched a " + arr[i] + ", "; break;
            }
        }
    }
    str = str.substring(0, str.lastIndexOf(", ")) + ".";
    return str;
}

function listMonsters(str)
{
    let arr = Dictionary.stringToArr(str, ",");
    let size, i;
    str = "";
    size = arr.length;
    for(i = 0; i < size; ++i)
    {
        str += "\n\t" + arr[i][0] + ": " + Dictionary.keyToDef(arr[i][1]) + ", " + arr[i][2] + "% spawn chance. " +
               arr[i][3] + " HRP. " + arr[i][4] + "z.";
    }
    str = str.substring(0, str.lastIndexOf('.') + 1);
    return str;
}

function listDrops(str)
{
    let arr = Dictionary.stringToArr(str, ",");
    let size, i;
    str = "";
    size = arr.length;
    for(i = 0; i < size; ++i) str += "\t" + arr[i][0] + " (x" + arr[i][1] + ") " + arr[i][2] + "%\n";
    str = str.substring(0, str.lastIndexOf("\n"));
    return str;
}

class Questdesc extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'questdesc',
            group: 'questinfo',
            memberName: 'description',
            description: 'Gives the description of the components of the quest.'
        });
    }

    async run(message, args)
    {
        const request = require('request');
        const fs = require('fs');

        let rawText = fs.readFileSync('./resources/SophiaPWD.txt', 'utf8').toString().split("\r\n");
        const apiKey = rawText[1];
        const url = rawText[2] + 'quests?q={"Name": "' + Dictionary.toTitleCase(args) + '"}';

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
                let strHold;
                let name, rank, map, type, prereq, objective, fail, qReward, qDrops, monsters;
                //Remove the end bits of the string ("[{" and "}]), then separates the string using its separators.
                //Original format of the string is "[{"data-name":"data", "data-name":"data",...,"data-name":"data"}].

                body = body.toString().substring(2, body.lastIndexOf('}]'));
                body = body.substring(0, body.length - 1);
                body = body.split('","');
                name = rank = map = type = prereq = objective = fail = qReward = qDrops = monsters = "";
                //Searches through the array for the specific category of information.
                body.forEach(function (item) {
                    if(item.includes("Name")) name = Dictionary.getInfo(item);
                    else if(item.includes("Type")) type = Dictionary.getInfo(item);
                    else if(item.includes("Rank")) rank = Dictionary.getInfo(item);
                    else if(item.includes("Map")) map = Dictionary.getInfo(item);
                    else if(item.includes("Prerequisites")) prereq = Dictionary.getInfo(item);
                    else if(item.includes("Fail")) fail = Dictionary.getInfo(item);
                    else if(item.includes("QuestReward")) qReward = Dictionary.getInfo(item);
                    else if(item.includes("Objective")) objective = Dictionary.getInfo(item);
                    else if(item.includes("Drops")) qDrops = Dictionary.getInfo(item);
                    else if(item.includes("Monsters")) monsters = Dictionary.getInfo(item);
                });
                //console.log(name + '\n' + type + '\n' + rank + '\n' + map + '\n' + prereq + '\n' + fail + '\n' +
                //            qReward + '\n' + objective + '\n' + qDrops + '\n' + monsters);
                strHold = "\nAlright, " + name + " is " + Dictionary.checkVowel(type) + " rank " + rank + " quest.\n" +
                          "In order to take this quest, you must " + listPrereqs(prereq) + "\n" +
                          "In this quest, you must:\n\n" +
                          objective + "\n\n" +
                          "You fail if: " + fail + "\n" +
                          "Monsters that can appear in this quest:" + listMonsters(monsters) + "\n" +
                          "Completing this quest awards you with: " + qReward + "\n" +
                          "Potential drops from this quest include: \n" + listDrops(qDrops);
                message.reply(strHold);
            }
            else message.reply('I don\'t have a record of that quest!');
        });
    }
}

module.exports = Questdesc;
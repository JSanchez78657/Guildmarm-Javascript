##### *Monster Part Symbols*

|Symbol|Part|
|---|---|
|An|Antennae|
|Ba|Back|
|Bo|Body|
|Ch|Chest|
|Ex|Exhaust Organ|
|Fi|Fin|
|FA|Forearms|
|FL|Forelegs|
|He|Head|
|HL|Hindlegs|
|Ho|Horn|
|HS|Hard Shell|
|Ja|Jaw|
|Le|Legs|
|LB|Lower Body|
|Ne|Neck|
|No|Nose|
|NP|Neck Pouch|
|Ro|Rock|
|Sh|Shell|
|St|Stomach|
|Ta|Tail|
|TT|Tail Tip|
|To|Tongue|
|Wi|Wings|

##### *Monster Body Part Modifiers*

|Symbol|Modifier|
|---|---|
|-Bl|Black|
|-Bo|Bone|
|-CS|Critical State|
|-E|Electricity|
|-GB|Gloss Black|
|-H|Heated|
|-MA|Magma Armor|
|-M|Mud|
|-R1|Rock 1|
|-R2|Rock 2|
|-Wh|White|
|-Wo|Wounded|

# Monster Resistances
Monster resistances are stored on the database in strings of the format:
```
He 22 25 10 20 0 0 15 10
He-M 20 24 9 0 80 0 15 10
Bo 46 46 50 20 0 0 10 5
Bo-M 24 24 20 0 80 0 15 10
FA 80 85 75 30 0 0 10 5
FA-M 35 38 30 0 80 0 15 10
HL 40 35 25 20 0 0 10 5
HL-M 24 24 20 0 80 0 15 10
Ta 55 50 40 25 0 0 15 10
Ta-M 25 25 22 0 80 0 15 10
```
The string is line separated and tokenized with spaces. When a request
related to monster weaknesses is issued, part names and resistances for
those body parts are placed into a two dimensional array.

| |Name|Se|Bl|Sh|Fi|Wa|Th|Ic|Dr|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Index|0|1|2|3|4|5|6|7|8|
|0|He|22|25|10|20|0|0|15|10|
|1|He-M|20|24|9|0|80|0|15|10|
|2|Bo|46|46|50|20|0|0|10|5|
|3|Bo-M|24|24|20|0|80|0|15|10|
|4|FA|80|85|75|30|0|0|10|5|
|5|FA-M|35|38|30|0|80|0|15|10|
|6|HL|40|35|25|20|0|0|10|5|
|7|HL-M|24|24|20|0|80|0|15|10|
|8|Ta|55|50|40|25|0|0|15|10|
|9|Ta-M|25|25|22|0|80|0|15|10|

# How Weapon Damage Works
This is just off the top of my head, take it with a grain of salt.
In the game there are a number of factors that influence the damage an
attack does. These include Sharpness, Affinity, Affinity Multiplier,
Weapon Damage, Element Damage, and Motion Values. An attack is
calculated like so:
```
Attack Damage = (Motion Value)[(Weapon Damage)(Sharpness Multiplier)(Crit)+(Element Damage)(Sharpness Multiplier)(Crit if available)]
```

# Monster Weakness Calculation
Monsters have their weaknesses calculated in two categories using
the same method, weapon type weakness and elemental weakness.
Each of the resistances is totalled across all body parts (summing the 
column), and the maximum among the totals determines the monster 
weakness. There is also a consideration for the optimal location on the 
monster to strike. This location is determined by going through each 
body part available on the monster and calculating the damage an attack 
would deal with a motion value of 1 with a sharpness multiplier of on 
a normal hit, with the optimal element and damage type, the part that
returns the greatest value is be the recommended area to attack.
Each monster weakness recommendation is be given with both categories
and the area to concentrate, for example:
```
Alright doodle, if you want to take down a Rathalos, you should bring a blunt dragon weapon, 
and make sure to hit it's head!
```

##### *Item drop sources*
|Symbol|Part|
|---|---|
|Ca|Capture|
|IR|Investigation Reward|
|PB|Palico Bonus|
|Pl|Plunderblade|
|SD|Shiny Drop|
|Tr|Track|

##### *Item drop modifiers*
|Symbol|Modifier|
|---|---|
|-C|Carve|
|-G|Gold|
|-S|Silver|
|-W|Wound|

# Items
Monsters store a string list of the parts they drop, in the form:
```
P: Barroth Claw
FA-W 1 100
Pl 1 18
Ca 1 18
IR-G 1 25
IR-S 1 22
P: Barroth Shell
HL-W 2 100
Tr 1 100
Ta-C 1 20
Pl 1 37
Bo-C 1 31
Ca 1 31
IR-G 3 10
IR-S 2 14
P: Barroth Ridge
HS-C 1 20
Pl 1 30
Bo-C 1 24
Ca 1 24
IR-G 3 14
IR-S 2 18
P: Barroth Tail
Ta-C 1 80
Bo-C 1 12
Ca 1 12
IR-G 1 20
IR-S 1 16
P: Barroth Scalp
HS-C 1 80
Ca 1 15
IR-G 1 21
IR-S 1 18
P: Fertile Mud
SD 1 50
Pl 1 18
IR-G 3 10
IR-S 1 12
```
There is an entry for low rank and high rank in the same format. Quest reward drops will be given their own entry in the
quests themselves. The string is tokenized with spaces and newlines, and will be separated into an array as such:

| |Name|Quantity|Chance|
|:---:|:---:|:---:|:---:|
|Index|0|1|2|
|0|Barroth Claw|||
|1|FA-W|1|100|
|2|Pl|1|18|
|3|Ca|1|18|
|4|IR-G|1|25|
|5|IR-S|1|22|
|6|Barroth Shell|||
|7|HL-W|2|100|
|8|Tr|1|100|
|9|Ta-C|1|20|
|10|Pl|1|37|
|11|Bo-C|1|31|
|12|Ca|1|31|
|13|IR-G|3|10|
|14|IR-S|2|14|
|15|Barroth Ridge|||
|16|HS-C|1|20|
|17|Pl|1|30|
|18|Bo-C|1|24|
|19|Ca|1|24|
|20|IR-G|3|14|
|21|IR-S|2|18|
|22|Barroth Tail|||
|23|Ta-C|1|80|
|24|Bo-C|1|12|
|25|Ca|1|12|
|24|IR-G|1|20|
|25|IR-S|1|16|
|26|Barroth Scalp|||
|27|HS-C|1|80|
|28|Ca|1|15|
|29|IR-G|1|21|
|30|IR-S|1|18|
|31|Fertile Mud|||
|32|SD|1|50|
|33|Pl|1|18|
|34|IR-G|3|10|
|35|IR-S|1|12|

# Monster Drops
Monster drops will be shown in a list, drop sources will be shown followed by a list of all the items from the sources, 
sorted in a descending list of drop chances, as such:
```
Barroth Claw
    Forearms wound (x1): 100%
    Investigation reward(Gold) (x1): 25%
    Investigation reward(Silver) (x1): 22%
    Plunderblade (x1): 18%
    Capture (x1): 18%
Barroth Shell
    Hindlegs wound (x2): 100%
    Track (x1): 100%
    Plunderblade (x1): 37%
    Body carve (x1): 31%
    Capture (x1): 31%
    Tail carve (x1): 20%
    Investigation reward(Silver) (x2): 14%
    Investigation reward(Gold) (x3): 10%
Barroth Ridge
    Plunderblade (x1): 30%
    Body carve (x1): 24%
    Capture (x1): 24%
    Hard shell carve (x1): 20%
    Investigation reward(Silver) (x2): 18%
    Investigation reward(Gold) (x3): 14%
Barroth Tail
    Tail carve (x1): 80%
    Investigation reward(Gold) (x1): 20%
    Investigation reward(Silver) (x1): 16%
    Body carve (x1): 12%
    Capture (x1): 12%
Barroth Scalp
    Hard shell carve (x1): 80%
    Investigation reward(Gold) (x1): 21%
    Investigation reward(Silver) (x1): 18%
    Capture (x1): 15%
Fertile Mud
    Shiny drop (x1): 50%
    Plunderblade (x1): 18%
    Investigation reward(Silver) (x1): 12%
    Investigation reward(Gold) (x3): 10%
```
A list of drops for both high rank and low rank will be generated and sent to the user as to not spam chat too hard.

# Quests

##### *Quest Symbols*
|Symbol|Meaning|
|---|---|
|AC|After Cutscene|
|HRP|Hunter Rank Points|
|HR|Hunter Rank|
|In|Invasion Spawn|
|IS|Initial Spawn|
 
Quests will have data space for the name, rank, map, monster(s), type, prerequisites, objectives, failure conditions, 
reward, and drops.

Quest types include:
```
Assigned, Optional, Investigation, Event, Special, and Arena
```

Objectives are the literal text in any case with the exception of "Complete the assignment." quests. For these quests, 
the objective is stored with it's accompanying description as such:
```
Complete the assignment: We've finally tracked down the source of those mysterious tracks. Report to the Coral 
Highlands and seek it out! I'll be expecting your report as soon as you're done!
```
Monster will be stored as such:
```
Barroth|IS|100|210|2520
Rathian|IS|100|280|4320
Diablos|IS|100|350|5400 
```
Can be stored in array as such:

| |Name|Spawn|Chance|HRP|Zenny|
|:---:|:---:|:---:|:---:|:---:|:---:|
|Index|0|1|2|3|4|
|0|Barroth|IS|100|210|2520|
|1|Rathian|IS|100|280|4320|
|2|Diablos|IS|100|350|5400|

Drops will be stored as such:
```
Monster Bone M|1|24
Earth Crystal|1|20
Boulder Bone|1|16
Monster Bone S|2|15
Nitroshroom|3|12
Thunderbug|3|12
Armor Sphere|1|1
```
Can be stored in array as such:

| |Name|Quantity|Chance|
|:---:|:---:|:---:|:---:|
|Index|0|1|2|
|0|Monster Bone M|1|24|
|1|Earth Crystal|1|20|
|2|Boulder Bone|1|16|
|3|Monster Bone S|2|15|
|4|Nitroshroom|3|12|
|5|Thunderbug|3|12|
|6|Armor Sphere|1|1|

Prerequisites will be stored as such:
```
100|Barroth Quest|Barroth|Barroth|Barroth|Barroth|
```
> I couldn't find an example of a quest that had every requirement, forgive me for silliness.

Can be stored in array as such:

|HR|Quest(s)|Find|Hunt|Capture|Research|
|:---:|:---:|:---:|:---:|:---:|:---:|
|0|1|2|3|4|5|
|100|Barroth Quest|Barroth|Barroth|Barroth|Barroth|

# Quest Requests
When a request is made to give information about a quest, responses will be given as such:
```
Alright, Old World Monster In The New World is an assigned rank 7 quest.
In order to take this quest, you must be HR 12.
In this quest, you must:

Complete the assignment: We've finally tracked down the source of those mysterious tracks. Report to the Coral Highlands and seek it out! I'll be expecting your report as soon as you're done!

You fail if: 3 faints are reached, or time runs out.
Monsters that can appear in this quest:
    Pink Rathian: Initial spawn, 100% spawn chance. 550 HRP. 12600z.
    Tzitzi-Ya-Ku: Initial spawn, 100% spawn chance. 350 HRP. 5400z.
    Legiana: Initial spawn, 100% spawn chance. 500 HRP. 12600z.
    Odogaron: Invasion spawn, 65% spawn chance. 500 HRP. 12600z.
Completing this quest awards you with: 12600 Zenny
Potential drops from this quest include: 
    Monster Hardbone (x1) 24%
    Monster Keenbone (x1) 20%
    Carbalite Ore (x1) 18%
    Mysterious Feystone (x1) 18%
    Novacrystal (x1) 15%
    Spiritcore Ore (x1) 12%
    Advanced Armor Sphere (x1) 1%
```

# *Item Search*
When given a command to search for an item, Guildmarm queries the server for the collection of monsters and checks each 
monster's low rank and high rank drops to see if it contains the requested item. If it does, the string is extracted, 
and parsed to get the quantity and rarity of the item from the drop table. The same is done with the quest collection. 
Responses for monsters:
```
Monsters that drop Fertile Mud:
    Barroth
        Low Rank:
            Shiny Drop (x1): 50%
            Plunderblade (x1): 18%
            Investigation Reward (Silver) (x1): 12%
            Investigation Reward (Gold) (x3): 10%
```
Responses for quests:
```
Quests that drop Monster Keenbone:
    Old World Monster In The New World
         Quest Reward (x1) (20%)
```

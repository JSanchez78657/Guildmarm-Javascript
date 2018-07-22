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
would deal with a motion value of 1 with a sharpness multiplier of 1 on 
a normal hit, with the optimal element and damage type, the part that
returns the greatest value is be the recommended area to attack.
Each monster weakness recommendation is be given with both categories
and the area to concentrate, for example:
>Alright doodle, if you want to take down a Nergigante, you should hit
it's tail with a severing thunder weapon!

##### *Item drop sources*
|Symbol|Part|
|---|---|
|Bo|Body|
|Ca|Capture|
|FA|Forearms|
|HL|Hindlegs|
|HS|Hard Shell|
|IR|Investigation Reward|
|PB|Palico Bonus|
|Pl|Plunderblade|
|SD|Shiny Drop|
|Ta|Tail|
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
Barroth Claw
FA-W 1 100
Pl 1 18
Ca 1 18
IR-G 1 25
IR-S 1 22
Barroth Shell
HL-W 2 100
Tr 1 100
Ta-C 1 20
Pl 1 37
Bo-C 1 31
Ca 1 31
IR-G 3 10
IR-S 2 14
Barroth Ridge
HS-C 1 20
Pl 1 30
Bo-C 1 24
Ca 1 24
IR-G 3 14
IR-S 2 18
Barroth Tail
Ta-C 1 80
Bo-C 1 12
Ca 1 12
IR-G 1 20
IR-S 1 16
Barroth Scalp
HS-C 1 80
Ca 1 15
IR-G 1 21
IR-S 1 18
Fertile Mud
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
TBD

# Quests

##### *Quest Symbols*
|Symbol|Meaning|
|---|---|
|AC|After Cutscene|
|HRP|Hunter Rank Points|
|IS|Initial Spawn|
 
Quests will have data space for the name, rank, map, monster(s), type, prerequisites, objectives, failure conditions, 
reward, and drops.
Monster will be stored as such:
```
Barroth,IS,100,210,2520
Rathian,IS,100,280,4320
Diablos,IS,100,350,5400 
```
Can be stored in array as such:

| |Name|Spawn|Chance|HRP|Zenny|
|:---:|:---:|:---:|:---:|:---:|:---:|
|Index|0|1|3|4|5|
|0|Barroth|IS|100|210|2520|
|1|Rathian|IS|100|280|4320|
|2|Diablos|IS|100|350|5400|

Drops will be stored as such:
```
Monster Bone M,1,24
Earth Crystal,1,20
Boulder Bone,1,16
Monster Bone S,2,15
Nitroshroom,3,12
Thunderbug,3,12
Armor Sphere,1,1
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


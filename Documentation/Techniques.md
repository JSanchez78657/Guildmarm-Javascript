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

|Symbol|Part|
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

|Name|Se|Bl|Sh|Fi|Wa|Th|Ic|Dr|
|:-:|:--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
||0|1|2|3|4|5|6|7|
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

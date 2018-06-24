|**Test Case 1**|**No input**|
|---|---|
|**Tested Actors**|StringValidator|
|**Expected Result**|Guildmarm does not respond|
|**Flow of events for test scenario**||
|1.|Test queries "@Guildmarm"|
|2.|StringValidator receives empty string|
|3.|StringValidator does not bother Guildmarm.|
|4.|Nothing happens.|

|**Test Case 2**|**Invalid Input String**|
|---|---|
|**Tested Actors**|StringValidator, ErrorMessage|
|**Expected Result**|Guildmarm informs the user of illegal characters.|
|**Flow of events for test scenario**||
|1.|Test queries "@Guildmarm -Numeric-"|
|2.|StringValidator detects numeric input.|
|3.|StringValidator calls ErrorMessage, passing "Numeric."|
|4.|ErrorMessage tells Guildmarm of the numeric input.|
|5.|Guildmarm responds "Sorry, but I have never seen a monster with a number in it's name!"|
|6.|Test queries "@Guildmarm -Symbolic-"|
|7.|StringValidator detects symbolic input.|
|8.|StringValidator calls ErrorMessage, passing "Symbolic."|
|9.|ErrorMessage tells Guildmarm of the Symbolic input.|
|10.|Guildmarm responds "Sorry, but I have never seen a monster with those weird symbols in it's name!"|

|**Test Case 3**|**Attempted SQL injection**|
|---|---|
|**Tested Actors**|StringValidator, ErrorMessage|
|**Expected Result**|Guildmarm informs the user that may have just put in a SQL injection, and informs the admin of the possible attempt.|
|**Flow of events for test scenario**||
|1.|Test attempts an injection on Guildmarm.|
|2.|StringValidator detects an injection attempt.|
|3.|StringValidator calls ErrorMessage, passing "Injection."|
|4.|ErrorMessage tells Guildmarm of the injection.|
|5.|Guildmarm responds "I hope that was not on purpose! I detected an injection!"|
|6.|Guildmarm emails admin with the details of who attempted an injection and what it looked like.|
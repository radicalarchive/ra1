Thank you for downloading my version of Radical Aces! (made by Omar Waly)
The aim of this version is to update and maintain the game so that it remains
playable despite being written on old java.

If you run into any problems or have any comments, you can reach me at
https://www.youtube.com/user/PhyrexianNFM

The latest version is always availible at
https://bitbucket.org/Phyrexian/ra1-dist/downloads/

CHANGING KEY BINDINGS
You can change the key bindings by creating a file with the name KeySettings.txt
Inside it, you write 1 binding per 1 line, in the form

ACTION(CODE)

CODE is the ascii code of the letter/number/symbol for most buttons.
For buttons such as enter or tab, visit https://docs.oracle.com/javase/7/docs/api/java/awt/Event.html
or try to figure out the codes from the default key settings file provided below

ACTION is the name of the action that is performed when the given button is pressed.
Multiple buttons can be binded to the same action.
Also, multiple actions can share the same button (can be used to create macros).

KeySettings.txt
viewOne(49)
viewTwo(50)
viewThree(51)
viewFour(52)
viewFive(53)
nomusic(109)
nomusic(77)
switchmusic(116)
switchmusic(84)
nosound(115)
nosound(83)
radar(114)
radar(82)
tab(9)
plus(43)
plus(61)
mins(45)
mins(8)
jump(106)
jump(74)
enter(10)
enter(27)
fire(32)
left(1006)
right(1007)
down(1005)
up(1004)
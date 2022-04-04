let users= SugarCube.State.getVar("$users") || {};
console.log({userId},users)
if(!(userId  in users))
{
    users[userId]={}
    SugarCube.State.setVar("$users",users);
}

SugarCube.Engine.show();

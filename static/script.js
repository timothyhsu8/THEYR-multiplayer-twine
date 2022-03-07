var gameVars;
var lastStats=[];
$(document).ready(function () {
    // if (email == "") {
    //     //   window.location = "login"
   
    //    }
    // $.get("roles.php", loadRole);
});


function online() {
 
}


function init() {
    // $('#passages').html($('#passages').html().replace(/<br><br>/gm, ""));
    $("body").on("click",()=>
    {
        $("body").addClass("blur")
    }); 
    fade($("body"), 1);
    // setInterval(checkDif, 1000)
}


function setBackground(image) {
    // image = image || "paper.jpg"
    let { faction } = getUser();

    $(() => {
        $('#story').css({
            'background-image': `url('Twine/images/Borders/${faction}.jpg'),url('Twine/images/Borders/Observer.jpg')`,
            'background-position': '30% 70%,0 0',
            'background-size': '100% 100%'
        })
    })
}


function fade(el, destination) {
    $({
        opacity: 1 - destination
    })
    .animate({
        opacity: destination
    }, {
        duration: 2000,
        step: function () {
            $(el).css({
                opacity: this.opacity
            })
        }
    });
}


$(document).on(':passagestart', (ev) => {
    let { role, faction } = getUser();
    var passage = $(ev.content).data("passage");
    var passageLength= Math.sqrt( SugarCube.Story.get(passage).text.length);
    var fs=`${Math.log(passageLength)}rem`;
    
    console.log("Passage length:", passageLength)
    //$('#passages').css({"font-size":fs})
    SugarCube.State.setVar(`$${role}_currentPassage`, passage);
    fade($("#passages"), 1);
})


/* JavaScript code */
function checkDif() {
    var dif = {};
    var deleteVars=["role","faction","roles","roleInfo","isLeader","character"]
    var sugarVars = Object.assign({}, SugarCube.State.variables);
    deleteVars.forEach((item)=> delete sugarVars[item] )

    for (i in sugarVars) {
        if (sugarVars[i] != gameVars[i])
            dif[i] = JSON.stringify(sugarVars[i]);
    }

    gameVars = Object.assign({}, sugarVars);
    if (!$.isEmptyObject(dif)) {
        $.post("updateBatch.php", dif);
    }
}

function showMap(){
    var map = $('#map')
    if(!map.length) {
        $('#story').append($('<img/>',{
        "id":"map",
        "name":"map"
        }))
    }
 
    let { faction } = getUser();
    // var faction = SugarCube.State.getVar("$faction");  
    var currentMap = 1 && SugarCube.State.getVar(`$${faction}_currentMap`);
    var showMap=$('#map').data("currentMap")
 
    if(showMap!=currentMap){
        console.log((showMap, currentMap))
        SugarCube.State.setVar(`$${faction}_currentMap`,currentMap);
        $('#map').attr("src",`Twine/images/${faction}_${currentMap}.png`)
      $('#map').data("currentMap",currentMap)
    }
}

function showStats() {
    let { role, faction } = getUser();
    var stats = {
        "Strength": 0,
        "Wisdom": 0,
        "Loyalty": 0
    }
   
    var displayStats = $('<div/>', {
        "id": "displayStats",
    })

    let userId = SugarCube.State.variables.userId
    let twineStats = SugarCube.State.variables.users[userId].stats

    if (twineStats) {
        Object.keys(stats).forEach((stat,idx) => {
            var twineVar = twineStats[stat]

            displayStats.append(
                $('<div/>', {
                "class": "stat",
                "css":{"background-image":`url(images/Stats/${faction}_${stat}.png)`}
            }).append($('<div/>', {
                "class": "statNum",
                "html":twineVar || "0" 
            })))
        })

        var dispLayStatsDOM = $('#displayStats')

        if(!dispLayStatsDOM.length){
            $('#story').append(displayStats)
        }
        else{
            dispLayStatsDOM.replaceWith(displayStats)
        }
    }

    // let twineVar = SugarCube.State.variables.faction[faction].strength
    let twineVar = 7
    if(twineVar) { 
        // statString = `${faction}: ${twineVar} `;
    
        $('#story')
            .append($('<div/>', 
                {
                    "id": "factionStrength",
                })
                .append(
                    $('<div/>', {
                    "id": "factionStrengthBar",
                    // "html": statString
                }))
            )
        setFactionStrength(twineVar)
    }

}


function setFactionStrength(rawValue) {
    var maxValue=14;
    var value=rawValue/maxValue*100;
    var gradientMask= `linear-gradient(90deg, black 0%, black ${value}%, transparent ${Math.min(100,value+10)}%)`
    $("#factionStrengthBar").css({
        "-webkit-mask-image":gradientMask,"mask-image":gradientMask
    })
}

function makeRoleStats(statsIn) {
    var total = 0;
    let { role } = getUser();
    let userId = SugarCube.State.variables.userId;
    let user = SugarCube.State.variables.users[userId]
    var output = "";

    SugarCube.State.variables.roles[role]["stats"] = statsIn;
    Object.keys(statsIn).forEach((stat) => {
            val = parseInt(statsIn[stat]);
            output += `${stat}: ${val}\n`;
        } 
    )
    $('#statsPicker').html(output)

    // return output;
    showStats()
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function changeStats(rolePlay,newStats){
    let roleStats = SugarCube.State.variables.roles[rolePlay].stats

    Object.keys(roleStats).forEach((stat, idx) => {
        roleStats[stat] = parseInt(newStats[stat]) + parseInt(roleStats[stat])
    });
}

function loadRole(data) {
    //  var email = SugarCube.State.getVar("$email");
    var roles = $.csv.toObjects(data);
    
    var role = "Player"
    var foundRole = roles.find((item) => item.email == email)

    if (foundRole) {
        role = foundRole.role
    }

    SugarCube.State.setVar("$roles", roles);
    SugarCube.State.setVar("$role", role);

    $.get("roleInfo.php", (data) => loadRoleInfo(data, role))
}


function loadRoleInfo(data, role) {
    var roleInfo = $.csv.toObjects(data);
    var faction = "Observer";
    var isLeader = false;
    var character = "Observer"
    var foundRoleInfo = roleInfo.find((item) => item.Role == role)
    if (foundRoleInfo) {
        faction = foundRoleInfo.Faction;
        isLeader = foundRoleInfo.isLeader.toLowerCase();
        character = foundRoleInfo.Character
    }
    
    SugarCube.State.setVar("$roleInfo", roleInfo);
    SugarCube.State.setVar("$faction", faction);
    SugarCube.State.setVar("$isLeader", isLeader);
    SugarCube.State.setVar("$character", character);
    $.get("gameState.php", loadGameData);
}


function loadGameData(data) {
    var vars = $.csv.toObjects(data)[0];
    gameVars = vars;

    for (key in vars) {
        var val = parseInt(vars[key]);
        if (!val) {
            val = vars[key]
        }

        try {
            val = JSON.parse(val);
        } 
        catch {}
        SugarCube.State.setVar("$" + key, val||0);
    }

    let { role } = getUser();
    var currentPassage = SugarCube.State.getVar(`$${role}_currentPassage`) || vars["currentPassage"];
    console.log("Current Passage is: ", currentPassage)

    SugarCube.Engine.play(currentPassage)
    init();
}

// Returns the role of the current player
function getUser() {
    var userId = SugarCube.State.getVar("$userId");
    var user = SugarCube.State.getVar("$users")[userId];
    return user;
}

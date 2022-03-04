class valueChanger {

    constructor(currentValue) {
        this.currentValue = currentValue
        this.maxValue = currentValue;
    }

    change(direction, $currentInput) {
        var spinValue = parseInt($currentInput.val());
        var changed = false;
        var testValue = this.currentValue - direction;

        if (testValue < 0 || testValue > this.maxValue || spinValue < 0) {
            changed = false;
        } else {
            this.currentValue -= direction;
            $("#currentValue").html(this.currentValue);

            changed = true;
            disableButtons();
        }
        return changed;
    }
}


var valueChange = new valueChanger(20);

function dialog(text) {
    var dc = $("#dialog-confirm")
    dc.html(text);
    dc.dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {

            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function statPickerInit() {
    var statNames = ["Strength", "Wisdom", "Loyalty"]
    var userId = SugarCube.State.getVar("$userId");
    var user = SugarCube.State.getVar("$users")[userId];
    var role = user["role"];

    let stats = SugarCube.State.variables.roles[role]["stats"];
    if (stats) {
        setTimeout(toggleHide,1000);
        return "";
    }

    var pointsLeftLabel= $('<span/>',{html:"Points to assign: "})
    var pointsLeft = $("<span/>", {
        "id": "currentValue",
        "html": 20,
     
    });

    var container = $("<div/>", {
        "id": "stats"
    });

    statNames.forEach((stat) => makeStats(stat, container));

    var submitButton = $("<input/>", {
        "id": "submitButton",
        "value": "submit stats",
        type: "submit"
    });
    var newline = $("<br/>")
    container.append([newline]);

    var dialog = $("<div/>", {
        "id": "dialog-confirm",
        html: ""
    });

    var out = $("<div/>", {
        "class": "show"
    }).append([pointsLeftLabel,pointsLeft, container, submitButton, dialog])

    setTimeout(() => {
        $('#statsPicker').empty().append(out)
        //makeRoleStats()

        $("#submitButton").on("click", submitStats)
        $('#stats input[type="number"]').niceNumber({
            onIncrement: ($currentInput, amount, settings) => change($currentInput, amount, settings, 1),
            onDecrement: ($currentInput, amount, settings) => change($currentInput, amount, settings, -1),
        });
        disableButtons();
    }, 1000);
    return ""
}

function toggleHide() {
    $('.show').addClass('temp')
    $('.show').removeClass('show')

    $('.hide').addClass('show')
    $('.hide').removeClass('hide')
    $('.temp').addClass('hide')
}

function submitStats() {
    var niceNumber = $(".nice-number input");
    var stats = {}
    niceNumber.each((index, item) => {
        var jqItem = $(item);
        var statType = $(item).attr("id");
        var statValue = $(item).val();
        stats[statType] = statValue
    })

    if (valueChange.currentValue != 0) {
        dialog(`You still have points to assign`)
    } else {
        toggleHide()
        makeRoleStats(stats)
    }
}

function disableButtons() {
    var total = 0;
    $('.nice-number').each(function () {
        var value = $($(this).children()[1]).val()
        var minus = $($(this).children()[0]);
        minus.prop("disabled", false);
        if (value == 0) {
            minus.prop("disabled", true);
        }

        //
        //  
        //$( this) .attr("disabled","disabled");
    })
}


function change($currentInput, amount, settings, direction) {
    if (!valueChange.change(direction, $currentInput)) {
        $currentInput.val($currentInput.val() - direction);
    } else {

    }

    // if (amount >= 100) {
    //     $currentInput.classList.add('more-than-100');
    // } else {
    //     $currentInput.classList.remove('more-than-100');
    // }
}

function makeStats(item, container, value = 0) {
    var label = $("<div/>", {
        "html": item
    });
    var picker = $("<input/>", {
        "id": item,
        "type": "number",
        "value": value
    });
    // htm+=label[0].outerHTML+picker[0].outerHTML;
    var div = $("<div/>", {});
    container.append(div.append([label, picker]));
}
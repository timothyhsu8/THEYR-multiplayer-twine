
var stageWidth;
var stageHeight;
var stageTop;
var stageLeft;
var aspectW=4
var aspectH=2.64

// Fix aspect ratio of the stage
$(window).resize(function () {
    resizeWindow();
});

$(resizeWindow)
// Resize the window
function resizeWindow() {
    // Get window width and height
    var w = $(window).width();
    var h = $(window).height();
    // If the aspect ratio is greater than or equal to 4:3, fix height and set width based on height
    if ((w / h) >= aspectW / aspectH) {
        stageHeight = h;
        stageWidth = (aspectW / aspectH) * h ;
        stageLeft = (w - stageWidth) / 2;
        stageTop = 0;

    }
    // If the aspect ratio is less than 4:3, fix width and set height based on width
    else {
        stageWidth = w;
        stageHeight = (aspectH / aspectW) * w;
        stageTop = 0;
        stageLeft = 0;

    }

    // Set "screen" object width and height to stageWidth and stageHeight, and center screen
    $("#story").css({
        width: stageWidth + "px",
        height: stageHeight + "px",
        left: stageLeft + "px",
        top: stageTop + "px"
    });


    // Resize text based on stage height
    // To give a class a certain font size, assign it the class "fs-X" where X is an integer between 1 and 1000. 1000 is the height of the screen.
    // New font resize loop
    $("html").css("font-size", (stageHeight / 80) + "px");
}
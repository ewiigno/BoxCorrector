



document.addEventListener("mousedown", function(event){
    mousedown = true
    if (showingSolution) return

    var mousePos_ = getMousePos(canvas, event)
    var mousePos = new Point(mousePos_.x, mousePos_.y)
    selectedCornerIndex = getClickedCornerIndex(mousePos, cornersDistorted, cornerMovementRestrictions)
    console.log("ind" + selectedCornerIndex)


});


document.addEventListener("mousemove", function(event){

    var mousePos_ = getMousePos(canvas, event)
    var mousePos = new Point(mousePos_.x, mousePos_.y)

    if (mousedown && selectedCornerIndex != null) {
        selectedCornerRestriction = cornerMovementRestrictions[selectedCornerIndex]
        console.log("restr:" + selectedCornerRestriction)
        if (selectedCornerRestriction == -1) {
            // Allowed to move corner freely
            cornersDistorted[selectedCornerIndex] = mousePos
        } else {
            // Calculate new corner so that it has the smallest distance to the cursor
            // but is still allowed
            cornersDistorted[selectedCornerIndex] = getClosestPointOfLine(cornersDistorted[selectedCornerRestriction], cornersDistorted[selectedCornerIndex], mousePos)
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawABox(cornersDistorted, cornerMovementRestrictions, showLinesValue)
    }


});


document.addEventListener("mouseup", function(event){

    mousedown = false
    selectedCornerIndex = null
});


function swapSettingsVPsButtonValue() {
    switch (settingsVPsButton.innerHTML) {
        case "near": settingsVPsButton.innerHTML = "medium"; break;
        case "medium": settingsVPsButton.innerHTML = "far"; break;
        case "far": settingsVPsButton.innerHTML = "mixed"; break;
        case "mixed": settingsVPsButton.innerHTML = "near"; break;
    }
    setSettingsValues()
}


function swapSettingsDistortionButtonValue() {
    switch (settingsDistortionButton.innerHTML) {
        case "small": settingsDistortionButton.innerHTML = "medium"; break;
        case "medium": settingsDistortionButton.innerHTML = "huge"; break;
        case "huge": settingsDistortionButton.innerHTML = "mixed"; break;
        case "mixed": settingsDistortionButton.innerHTML = "small"; break;
    }
    setSettingsValues()
}


function swapSettingsBoxesButtonValue() {
    switch (settingsBoxesButton.innerHTML) {
        case "small": settingsBoxesButton.innerHTML = "medium"; break;
        case "medium": settingsBoxesButton.innerHTML = "huge"; break;
        case "huge": settingsBoxesButton.innerHTML = "mixed"; break;
        case "mixed": settingsBoxesButton.innerHTML = "small"; break;
    }
    setSettingsValues()
}




// Settings
var VPsMinDistance = 0
var VPsMaxDistance = 0
var minDistortion = 0
var maxDistortion = 0
var minInitialYLength = 0
var maxInitialYLength = 0
var showLinesValue = false
var showingSolution = false


// Array initialization
var cornersCorrect = []
var cornerMovementRestrictions = []
var cornersDistorted = []
var vanishingPoints = []

// Get Buttons
var settingsVPsButton = document.getElementById("settingsVPsButton") // near, far, mixed
var settingsDistortionButton = document.getElementById("settingsDistortionButton") // small, huge, mixed
var settingsBoxesButton = document.getElementById("settingsBoxesButton") // small, huge, mixed
// score text
var scoreText = document.getElementById("scoreText")

function setDefaultSettings() {
    settingsVPsButton.innerHTML = "medium"
    settingsDistortionButton.innerHTML = "medium"
    settingsBoxesButton.innerHTML = "medium"
}

function setSettingsValues() {
    switch (settingsVPsButton.innerHTML) {
        case "near": VPsMinDistance = 30; VPsMaxDistance = 100; break;
        case "medium": VPsMinDistance = 80; VPsMaxDistance = 300; break;
        case "far": VPsMinDistance = 1000; VPsMaxDistance = 6000; break;
        case "mixed": VPsMinDistance = 5; VPsMaxDistance = 1500; break;
    }
    
    switch (settingsDistortionButton.innerHTML) {
        case "small": minDistortion = 0; maxDistortion = 20; break;
        case "medium": minDistortion = 5; maxDistortion = 35; break;
        case "huge": minDistortion = 40; maxDistortion = 100; break;
        case "mixed": minDistortion = 0; maxDistortion = 60; break;
    }

    switch (settingsBoxesButton.innerHTML) {
        case "small": minInitialYLength = 30; maxInitialYLength = 200; break;
        case "medium": minInitialYLength = 200; maxInitialYLength = 280; break;
        case "huge": minInitialYLength = 300; maxInitialYLength = 500; break;
        case "mixed": minInitialYLength = 30; maxInitialYLength = 500; break;
    }
}


// Add the distances of lines to the VPs they should hit together
function checkBox() {
    var totalDistance = 0
    console.log(vanishingPoints)
    totalDistance += getDistanceOfPointToLine(cornersDistorted[0], cornersDistorted[1], vanishingPoints[0])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[0], cornersDistorted[2], vanishingPoints[1])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[0], cornersDistorted[3], vanishingPoints[2])

    totalDistance += getDistanceOfPointToLine(cornersDistorted[1], cornersDistorted[4], vanishingPoints[1])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[2], cornersDistorted[4], vanishingPoints[0])
    
    totalDistance += getDistanceOfPointToLine(cornersDistorted[1], cornersDistorted[5], vanishingPoints[2])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[3], cornersDistorted[5], vanishingPoints[0])
    
    totalDistance += getDistanceOfPointToLine(cornersDistorted[2], cornersDistorted[6], vanishingPoints[2])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[3], cornersDistorted[6], vanishingPoints[1])
    
    totalDistance += getDistanceOfPointToLine(cornersDistorted[4], cornersDistorted[7], vanishingPoints[2])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[5], cornersDistorted[7], vanishingPoints[1])
    totalDistance += getDistanceOfPointToLine(cornersDistorted[6], cornersDistorted[7], vanishingPoints[0])

    scoreText.innerHTML = "Off by " + Math.floor(totalDistance)
}

function showLines() {
    showLinesValue = !showLinesValue
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawABox(showingSolution ? cornersCorrect : cornersDistorted, cornerMovementRestrictions, showLinesValue)
}

function showSolution() {
    showingSolution = !showingSolution
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawABox(showingSolution ? cornersCorrect : cornersDistorted, cornerMovementRestrictions, showLinesValue)

}

function newBox() {
    showingSolution = false;
    showLinesValue = false;
    // "canvas" var should be known here
    [cornersCorrect, cornersDistorted, cornerMovementRestrictions, vanishingPoints] = getBoxCorners(
            new Point(canvas.width/2,canvas.height/2), 
            minInitialYLength, maxInitialYLength, VPsMinDistance, VPsMaxDistance, minDistortion, maxDistortion)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("jkdlsajkdslj" + cornersDistorted)
    drawABox(cornersDistorted, cornerMovementRestrictions, showLinesValue)
}

function init() {
    setDefaultSettings()
    setSettingsValues()
    newBox()
}

init()




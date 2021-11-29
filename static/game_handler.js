function incrementClicks() {
    SugarCube.State.variables.clickCount = SugarCube.State.variables.clickCount + 1
    SugarCube.Engine.show()  // Refreshes the passage
}
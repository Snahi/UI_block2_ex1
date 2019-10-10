
// activity ////////////////////////////////////////////////////////////////////////////////////////////////////////////



function fitFontSizeForActivities()
{
    var activities = document.getElementsByClassName("activity");

    var i;
    for (i = 0; i < 1; i++)
    {
        fitFontSizeForActivity(
            activities[i].getElementsByTagName("p")[0],
            activities[i].getElementsByClassName("activity_image")[0]
        );
    }
}



function fitFontSizeForActivity(text, image)
{
    var textHeight  = getElementHeight(text);
    var imageHeight = getElementHeight(image);

    var fontSizeStr = window.getComputedStyle(text, null).fontSize;
    var fontSize    = parseInt(fontSizeStr.substring(0, fontSizeStr.length - 2), 10);

    while (textHeight < imageHeight)
    {
        fontSize += 1;
        text.style.fontSize = fontSize + "px";

        textHeight = getElementHeight(text);

        console.log(textHeight + " " + imageHeight);
    }

    // in case text is bigger than image, then come back to previous value
    if (textHeight > imageHeight)
    {
        text.style.fontSize = fontSize - 1 + "px";
        image.style.height  = getElementHeight(text);
    }
}



function getElementHeight(element)
{
    var elementComputedStyle = window.getComputedStyle(element);
    var elementHeightStr        = elementComputedStyle.height;

    return parseInt(
        elementHeightStr.substring(0, elementHeightStr.length - 2),
        10
    );
}



function closeActivity(activityToClose)
{
    // TODO show confirmation dialog before
    // first make activity disappear
    activityToClose.style.opacity   = "0.0";

    // and then fill the empty space with other activities (set total height of deleted activity to 0)
    activityToClose.style.height    = "0px";
    activityToClose.style.margin    = "0px";
    activityToClose.style.padding   = "0px";

    setTimeout(function() {activityToClose.style.display = "none";}, 1500)
}



// general /////////////////////////////////////////////////////////////////////////////////////////////////////////////
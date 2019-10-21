
// document wide ///////////////////////////////////////////////////////////////////////////////////////////////////////
var ACTIVITY_GROUP_MENU_CLASS   = "group_menu";
var GROUP_HAMBURGER_CLASS       = "group_hamburger";


function loadSite()
{
    fitFontSizeForActivities();
    hideGroupMenuPopupWhenClick();
}



function hideGroupMenuPopupWhenClick()
{
    document.onmouseup = function(e)
    {
        var activityGroupMenus = document.getElementsByClassName(ACTIVITY_GROUP_MENU_CLASS);

        if (e.target.class !== GROUP_HAMBURGER_CLASS && e.target.class !== ACTIVITY_GROUP_MENU_CLASS)    // if clicked out of menu and hamburger
        {
            var i;
            for (i = 0; i < activityGroupMenus.length; i++)
            {
                activityGroupMenus[i].style.display = "none";
            }
        }
    };
}



// cookies /////////////////////////////////////////////////////////////////////////////////////////////////////////////



function setCookie(name, value, daysTillExpire)
{
    var d = new Date();
    d.setTime(d.getTime() + (daysTillExpire * 24 * 60 * 60 * 1000));    // transform days to milliseconds
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}



function getCookie(cookieName)
{
    var name            = cookieName + "=";
    var decodedCookie   = decodeURIComponent(document.cookie);
    var ca              = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) === ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



// log in / out / register /////////////////////////////////////////////////////////////////////////////////////////////
var CURRENT_USER_NICK_NAME  = "currUserNick";
var CONTENT_ID              = "content";
var USER_DATA_ID            = "user_data";
var SIGNED_IN_CLASS         = "signed_in";
var SIGNED_OUT_CLASS        = "signed_out";
var ACTIVITIES_GROUP_CLASS  = "activities_group";
var REGISTER_FORM_ID        = "register_form";
var USER_DATA_SEPARATOR     = "&";


function logOut()
{
    // hide activities
    var activitiesGroups = document.getElementsByClassName(ACTIVITIES_GROUP_CLASS);

    for (var c = 0; c < activitiesGroups.length; c++)
    {
        activitiesGroups[c].style.display = "none";
    }

    // change menu
    var menuItemsForSignedInUsers   = document.getElementsByClassName(SIGNED_IN_CLASS);
    var menuItemsForSignedOutUsers  = document.getElementsByClassName(SIGNED_OUT_CLASS);
    var userData                    = document.getElementById(USER_DATA_ID);

    for (var i = 0; i < menuItemsForSignedInUsers.length; i++)
    {
        menuItemsForSignedInUsers[i].style.display = "none";
    }

    for (var j = 0; j < menuItemsForSignedOutUsers.length; j++)
    {
        menuItemsForSignedOutUsers[j].style.display = "inline-block";
    }

    userData.style.display = "none";
}



function showRegisterForm()
{
    var registerForm = document.getElementById(REGISTER_FORM_ID);

    registerForm.style.display = "flex";
}



function register(email, password, username, name, surname, birthDate, language, interests, purpose)
{
    let isEmailUnique = obtainUser(email) === null;

    if (isEmailUnique)
    {
        storeUser(email, password, username, name, surname, birthDate, language, interests, purpose);
        window.alert("account created");
    }
    else
    {
        window.alert("user with such email already exists");
    }
}



function storeUser(email, password, username, name, surname, birthDate, language, interests, purpose)
{
    var userCookie = email + USER_DATA_SEPARATOR + password + USER_DATA_SEPARATOR + username + USER_DATA_SEPARATOR +
        name + USER_DATA_SEPARATOR + surname + USER_DATA_SEPARATOR + birthDate + USER_DATA_SEPARATOR + language +
        USER_DATA_SEPARATOR + interests + USER_DATA_SEPARATOR + purpose;

    setCookie(email, userCookie, 1000);
}



function obtainUser(email)
{
    var userCookie  = getCookie(email);
    var user        = null;

    if (userCookie !== "")
    {
        var userData = userCookie.split(USER_DATA_SEPARATOR);
        user = {
            email:      userData[0],
            password:   userData[1],
            username:   userData[2],
            name:       userData[3],
            surname:    userData[4],
            birthDate:  userData[5],
            language:   userData[6],
            interests:  userData[7],
            purpose:    userData[8]
        }
    }

    return user;
}



// activity group //////////////////////////////////////////////////////////////////////////////////////////////////////
var GROUP_MENU_CLASS = "group_menu";



function showGroupMenu(activity)
{
    var menu = activity.getElementsByClassName(GROUP_MENU_CLASS)[0];

    menu.style.display = "block";
}



function archiveActivityGroup(activityGroup)
{
    if (window.confirm("Are you sure that you want to archive this activity group?"))
    {
        activityGroup.style.opacity = "0.0";
        activityGroup.style.flex    = "0 1 auto"; // 0 so that it's not filling free space, 1 so that it can shrink, auto so that width is considered
        activityGroup.style.width   = "0px";
        activityGroup.style.margin  = "0px";
        activityGroup.style.padding = "0px";

        setTimeout(function() {activityGroup.remove(); fitFontSizeForActivities();}, 1500);
    }
}


// activity ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const
var LIKE_ICON_NAME              = "like.png";
var LIKE_ICON_PATH              = "images/like.png";
var CLICKED_LIKE_ICON_PATH      = "images/like_clicked.png";
var SHARE_POPUP_ID              = "share_popup";
var SHARE_POPUP_ACTIVITY_DESC   = "activity_name";


function fitFontSizeForActivities()
{
    var activities = document.getElementsByClassName("activity");

    var i;
    for (i = 0; i < activities.length; i++)
    {
        fitFontSizeForActivity(
            activities[i].getElementsByTagName("p")[0],
            activities[i].getElementsByClassName("activity_image")[0]
        );
    }
}



function fitFontSizeForActivity(text, image)
{
    if (!isMultiLine(text)) // adjust size only for multiline texts
    {
        text.style.fontSize = "24px";   // so that they are always equal
        return;
    }

    text.style.fontSize = "10px";
    var textHeight  = getElementHeight(text);
    var imageHeight = getElementHeight(image);

    var fontSizeStr = window.getComputedStyle(text, null).fontSize;
    var fontSize    = parseInt(fontSizeStr.substring(0, fontSizeStr.length - 2), 10);

    while (textHeight < imageHeight)
    {
        fontSize += 1;
        text.style.fontSize = fontSize + "px";

        textHeight = getElementHeight(text);
    }

    // in case text is bigger than image, then come back to previous value
    if (textHeight > imageHeight)
    {
        text.style.fontSize = fontSize - 1 + "px";
        textHeight = getElementHeight(text);
        if (imageHeight > textHeight)
        {
            image.style.height = getElementHeight(text) + "px"; // adjust image to text so that they are the same in height
        }
    }
}



function isMultiLine(text)
{
    var textStyle       = window.getComputedStyle(text);
    var lineHeightStr   = textStyle.lineHeight;
    var lineHeight      = lineHeightStr.substr(0, lineHeightStr.length - 2);

    return getElementHeight(text) / lineHeight > 1;
}



function getElementHeight(element)
{
    var elementComputedStyle = window.getComputedStyle(element);
    var elementHeightStr     = elementComputedStyle.height;

    return parseInt(
        elementHeightStr.substring(0, elementHeightStr.length - 2),
        10
    );
}



function closeActivity(activityToClose)
{
    var dialog  = document.getElementById("confirm_activity_delete_popup");
    var butYes  = document.getElementById("yes_button");
    var butNo   = document.getElementById("no_button");

    dialog.style.display = "flex";

    butYes.onclick = function()
    {
        dialog.style.display = "none";
        getDeleteActivityFunction(activityToClose)();
    };

    butNo.onclick   = function() {dialog.style.display = "none";}
}



function getDeleteActivityFunction(activityToClose)
{
    return function()
    {
        // first make activity disappear
        activityToClose.style.opacity   = "0.0";

        // and then fill the empty space with other activities (set total height of deleted activity to 0)
        activityToClose.style.height    = "0px";
        activityToClose.style.margin    = "0px";
        activityToClose.style.padding   = "0px";

        setTimeout(function() {activityToClose.remove();}, 1500)
    }
}



function onLikeClicked(likeImg)
{
    var splitPath    = likeImg.src.split("/");
    var imgName         = splitPath[splitPath.length - 1];

    if (imgName === LIKE_ICON_NAME)
    {
        likeImg.src = CLICKED_LIKE_ICON_PATH;
    }
    else
    {
        likeImg.src = LIKE_ICON_PATH;
    }
}



function onShareClicked(activity)
{
    var text = activity.getElementsByClassName("activity_description")[0].textContent;

    var sharePopup = document.getElementById(SHARE_POPUP_ID);
    sharePopup.style.display = "flex";
    var popupText = document.getElementById(SHARE_POPUP_ACTIVITY_DESC);
    popupText.innerHTML = text;
}



function closeSharePopup()
{
    var sharePopup = document.getElementById(SHARE_POPUP_ID);
    sharePopup.style.display = "none";
}



// general /////////////////////////////////////////////////////////////////////////////////////////////////////////////
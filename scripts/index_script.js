// CONST ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ACTIVITY_GROUP_MENU_CLASS   = "group_menu";
const GROUP_HAMBURGER_CLASS       = "group_hamburger";
const USER_DATA_ID                = "user_data";
const SIGNED_IN_CLASS             = "signed_in";
const SIGNED_OUT_CLASS            = "signed_out";
const ACTIVITIES_GROUP_CLASS      = "activities_group";
const REGISTER_FORM_ID            = "register_form";
const USER_DATA_SEPARATOR         = "&";
const LOGIN_FORM_ID               = "login_form";
const REGISTER_BIRTH_DATE_ID      = "register_birth_date";
const GROUP_MENU_CLASS            = "group_menu";
const USER_NAME_ID                = "user_name";
const LIKE_ICON_NAME              = "like.png";
const LIKE_ICON_PATH              = "images/like.png";
const CLICKED_LIKE_ICON_PATH      = "images/like_clicked.png";
const SHARE_POPUP_ID              = "share_popup";
const SHARE_POPUP_ACTIVITY_DESC   = "activity_name";


// document wide ///////////////////////////////////////////////////////////////////////////////////////////////////////


function loadSite()
{
    fitFontSizeForActivities();
    hideGroupMenuPopupWhenClick();
    showLoginForm();
}



function hideGroupMenuPopupWhenClick()
{
    document.onmouseup = function(e)
    {
        let activityGroupMenus = document.getElementsByClassName(ACTIVITY_GROUP_MENU_CLASS);

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



function hideContentContent()
{
    // hide activities
    let activitiesGroups = document.getElementsByClassName(ACTIVITIES_GROUP_CLASS);

    for (let c = 0; c < activitiesGroups.length; c++)
    {
        activitiesGroups[c].style.display = "none";
    }

    // hide register form
    document.getElementById(REGISTER_FORM_ID).style.display = "none";

    // hide login form
    document.getElementById(LOGIN_FORM_ID).style.display = "none";
}



function changeMenu(signedInDisplay, signedOutDisplay)
{
    // change menu
    let menuItemsForSignedInUsers   = document.getElementsByClassName(SIGNED_IN_CLASS);
    let menuItemsForSignedOutUsers  = document.getElementsByClassName(SIGNED_OUT_CLASS);
    let userData                    = document.getElementById(USER_DATA_ID);

    for (let i = 0; i < menuItemsForSignedInUsers.length; i++)
    {
        menuItemsForSignedInUsers[i].style.display = signedInDisplay;
    }

    for (let j = 0; j < menuItemsForSignedOutUsers.length; j++)
    {
        menuItemsForSignedOutUsers[j].style.display = signedOutDisplay;
    }

    userData.style.display = signedInDisplay;
}



// cookies /////////////////////////////////////////////////////////////////////////////////////////////////////////////



function setCookie(name, value, daysTillExpire)
{
    let d = new Date();
    d.setTime(d.getTime() + (daysTillExpire * 24 * 60 * 60 * 1000));    // transform days to milliseconds
    let expires = "expires="+ d.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}



function getCookie(cookieName)
{
    let name            = cookieName + "=";
    let decodedCookie   = decodeURIComponent(document.cookie);
    let ca              = decodedCookie.split(';');
    let c;

    for(let i = 0; i <ca.length; i++)
    {
        c = ca[i];
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



function logOut()
{
    hideContentContent();
    changeMenu("none", "inline-block")
}


function logIn(email, password)
{
    let user = obtainUser(email);

    if (user !== null)
    {
        if (user.password === password)
        {
            showSignedInUserPage(user.username);
            return;
        }
    }

    // show info about fail
    window.alert("There is no user with such email and password");
}



function showLoginForm()
{
    hideContentContent();
    document.getElementById(LOGIN_FORM_ID).style.display = "flex";
}



function showRegisterForm()
{
    hideContentContent();

    let registerForm = document.getElementById(REGISTER_FORM_ID);

    registerForm.style.display = "flex";
}



function register(email, password, username, name, surname, birthDate, language, interests, purpose)
{
    let isEmailUnique = obtainUser(email) === null;

    if (isEmailUnique)
    {
        storeUser(email, password, username, name, surname, birthDate, language, interests, purpose);
        window.alert("account created");
        showLoginForm();
    }
    else
    {
        window.alert("user with such email already exists");
    }
}


function validateBirthDate(birthDate)
{
    if (new Date(birthDate) >= new Date())
    {
        window.alert("we do not allow creation of account for people not yet born. Enter proper date");
        document.getElementById(REGISTER_BIRTH_DATE_ID).value = "";
    }
}



function storeUser(email, password, username, name, surname, birthDate, language, interests, purpose)
{
    let userCookie = email + USER_DATA_SEPARATOR + password + USER_DATA_SEPARATOR + username + USER_DATA_SEPARATOR +
        name + USER_DATA_SEPARATOR + surname + USER_DATA_SEPARATOR + birthDate + USER_DATA_SEPARATOR + language +
        USER_DATA_SEPARATOR + interests + USER_DATA_SEPARATOR + purpose;

    setCookie(email, userCookie, 1000);
}



function obtainUser(email)
{
    let userCookie  = getCookie(email);
    let user        = null;

    if (userCookie !== "")
    {
        let userData = userCookie.split(USER_DATA_SEPARATOR);
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




function showSignedInUserPage(username)
{
    hideContentContent();

    let activitiesGroups = document.getElementsByClassName(ACTIVITIES_GROUP_CLASS);

    for (let c = 0; c < activitiesGroups.length; c++)
    {
        activitiesGroups[c].style.display = "flex";
    }

    // change menu
    changeMenu("inline-block", "none");

    // show user username in menu
    document.getElementById(USER_NAME_ID).textContent = username;
}



function showGroupMenu(activity)
{
    let menu = activity.getElementsByClassName(GROUP_MENU_CLASS)[0];

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



function fitFontSizeForActivities()
{
    let activities = document.getElementsByClassName("activity");

    let i;
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
    let textHeight  = getElementHeight(text);
    let imageHeight = getElementHeight(image);

    let fontSizeStr = window.getComputedStyle(text, null).fontSize;
    let fontSize    = parseInt(fontSizeStr.substring(0, fontSizeStr.length - 2), 10);

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
    let textStyle       = window.getComputedStyle(text);
    let lineHeightStr   = textStyle.lineHeight;
    let lineHeight      = lineHeightStr.substr(0, lineHeightStr.length - 2);

    return getElementHeight(text) / lineHeight > 1;
}



function getElementHeight(element)
{
    let elementComputedStyle = window.getComputedStyle(element);
    let elementHeightStr     = elementComputedStyle.height;

    return parseInt(
        elementHeightStr.substring(0, elementHeightStr.length - 2),
        10
    );
}



function closeActivity(activityToClose)
{
    let dialog  = document.getElementById("confirm_activity_delete_popup");
    let butYes  = document.getElementById("yes_button");
    let butNo   = document.getElementById("no_button");

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
    let splitPath    = likeImg.src.split("/");
    let imgName         = splitPath[splitPath.length - 1];

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
    let text = activity.getElementsByClassName("activity_description")[0].textContent;

    let sharePopup = document.getElementById(SHARE_POPUP_ID);
    sharePopup.style.display = "flex";
    let popupText = document.getElementById(SHARE_POPUP_ACTIVITY_DESC);
    popupText.innerHTML = text;
}



function closeSharePopup()
{
    let sharePopup = document.getElementById(SHARE_POPUP_ID);
    sharePopup.style.display = "none";
}

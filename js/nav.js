"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $("#favorites-list").empty();
  retrieveFavsFromCurrentUser();
  $("#new-story-div").hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** add a new story after user submits. */

function navSubmitClick() {
  $("#new-story-div").show();
}

$("#nav-submit").on("click", navSubmitClick);

function navFavoriteClick() {
  addFavsToFavsOlOnClick();
  $("#all-stories-list").css("display", "none");
  $("#favorites-list").css("display", "block");
}

$("#nav-favorites").on("click", navFavoriteClick);

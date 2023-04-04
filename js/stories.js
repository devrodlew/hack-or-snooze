"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star"><i class="fa fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${currentUser.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  $("li").on("click", async function (event) {
    console.log(event.target);
    const target = event.target;
    if (target.tagName !== "I") {
      //do nothing
    } else {
      if (!target.classList.contains("checked")) {
        await currentUser.addFavorite(event);
      } else {
        await currentUser.removeFavorite(event);
      }
    }
  });

  retrieveFavsFromCurrentUser();
  appendRemoveButton();

  //remove story from DOM and API
  $(".remove").on("click", currentUser.removeStory);
}

//This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.

async function addNewStoryToPage() {
  const author = $("#new-author").val();
  const title = $("#new-title").val();
  const url = $("#new-url").val();

  await storyList.addStory(currentUser, {
    title: title,
    author: author,
    url: url,
  });

  putStoriesOnPage();
}

$("#new-story-form").on("submit", addNewStoryToPage);

//retrieve favorites from local storage and update the stars on the page

function retrieveFavsFromCurrentUser() {
  const retrieveFavsObj = currentUser.favorites;

  for (let i = 0; i < retrieveFavsObj.length; i++) {
    if (!$(`#${retrieveFavsObj[i].storyId}`).children().get(0)) {
      //do nothing
    } else {
      let starSpan = $(`#${retrieveFavsObj[i].storyId}`).children().get(0);

      starSpan.firstChild.classList.add("checked");
    }
  }
}

async function addFavsToFavsOlOnClick() {
  const retrieveFavsObj = currentUser.favorites;

  for (let i = 0; i < retrieveFavsObj.length; i++) {
    if (!$(`#${retrieveFavsObj[i].storyId}`).children().get(0)) {
      // do nothing
    } else {
      let favsLi = $(`#${retrieveFavsObj[i].storyId}`).clone();
      $("#favorites-list").append(favsLi);
    }
  }
}

function appendRemoveButton() {
  const liObj = $("li");
  for (let i = 0; i < liObj.length; i++) {
    const removeButton = document.createElement("BUTTON");
    removeButton.setAttribute("class", "remove");
    removeButton.innerText = "Remove";
    liObj[i].append(removeButton);
  }
}

// Document setup
$(document).ready(pageSetup);

//updatedKeyArray();

/***EVENT LISTENTERS**/
$('.save-idea').on('click', updateIdea);
$('.title-storage').on('input', enableSave);
$('.body-storage').on('input', enableSave);
$('.idea-container')
  .on('click', '.upvote-icon', adjustQuality)
  .on('click', '.downvote-icon', adjustQuality)
  .on('click', '.delete-icon', deleteCard);


/***FUNCTIONS*/
function Idea(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.quality = 'swill';
}

function clearInputFields() {
  var $title = $('.title-storage');
  var $body = $('.body-storage');
  $title.val('');
  $body.val('');
  toggleDisabled($('.save-idea'), true);
  enableSave();
}

/***REFACTORED FUNCTIONS***/
function pageSetup() {
  writeIdeasToPage(getIdeasFromLocalStorage());
}

function toggleDisabled(element, value) {
  element.prop('disabled', value);
}

function updateIdea() {
  var $title = $('.title-storage').val();
  var $body = $('.body-storage').val();
  var $newIdea = new Idea($title, $body);
  clearInputFields();
  addIdeaToLocalStorage($newIdea);
  prependIdea($newIdea);
}

function enableSave() {
  var $title = $('.title-storage').val();
  var $body = $('.body-storage').val();
  if ($title !== '' && $body !== '') {
    toggleDisabled($('.save-idea'), false);
  } else {
    toggleDisabled($('.save-idea'), true);
  }
};

function upVote() {
  var $qualityElement = $(this).parent().find('.quality-text');
  if ($qualityElement.text() === 'swill') {
    $qualityElement.text('plausible');
  } else if ($qualityElement.text() === 'plausible') {
    $qualityElement.text('genius');
  };
};

function downVote() {
  var $qualityElement = $(this).parent().find('.quality-text');
  if ($qualityElement.text() === 'genius') {
    $qualityElement.text('plausible');
  } else if ($qualityElement.text() === 'plausible') {
    $qualityElement.text('swill');
  };
};

function adjustQuality() {
  var $button = $(this).prop('class');
  var qualityArray = ['swill','plausible', 'genius'];
  var $qualityValue = $(this).parent().find('.quality-value').text();
  switch($button) {
    case  'upvote-icon':
    var newValue = qualityArray[qualityArray.indexOf($qualityValue) + 1] || $qualityValue;
    break;
    case  'downvote-icon':
    var newValue = qualityArray[qualityArray.indexOf($qualityValue) - 1] || $qualityValue;
    break;
    default:
  }
  $(this).parent().find('.quality-value').text(newValue);
    var $ideaId = $(this).closest('.idea-card').attr('id');
    var ideaArray = getIdeasFromLocalStorage();
    var newArray = ideaArray.map(function(idea) {
      if(idea.id == $ideaId) {
        //update quality value
        idea['quality'] = newValue;
      }
      return idea;
    });
    addIdeaArrayToLocalStorage(newArray);
}

function deleteCard() {
  var $ideaId = $(this).closest('.idea-card').attr('id');
  var newArray = getIdeasFromLocalStorage().filter(function(idea) {
    return idea.id != $ideaId;
  })
  addIdeaArrayToLocalStorage(newArray);
  $(this).closest('.idea-card').remove();
};



function updatedKeyArray() {
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    keyArray.push(key);
  }
}

// STORAGE FUNCTIONS

function addIdeaToLocalStorage(idea) {
  var ideaArray = getIdeasFromLocalStorage();
  ideaArray.unshift(idea);
  addIdeaArrayToLocalStorage(ideaArray);
}

function addIdeaArrayToLocalStorage(ideas) {
  localStorage.setItem('ideaBoxArray', JSON.stringify(ideas));
}

function getIdeasFromLocalStorage() {
  return JSON.parse(localStorage.getItem('ideaBoxArray')) || [];
}

function writeIdeasToPage(ideaArray) {
  ideaArray.reverse().forEach(function(idea) {
    prependIdea(idea);
  })
}

function prependIdea(newIdea) {
  var $title = newIdea.title;
  var $body = newIdea.body;
  var $quality = newIdea.quality;
  var $id = newIdea.id;
  $('.idea-container').prepend(
    `<article class="idea-card" id=
  ${newIdea.id}>
      <div class="card-header">
        <h2 contenteditable="true">${newIdea.title}</h2>
        <button class="delete-icon" type="button" name="delete-button"></button>
      </div>
      <p class="body-text" contenteditable="true">${newIdea.body}</p>
      <div class="quality-container">
        <button class="upvote-icon" type="button" name="upvote-btn"></button>
        <button class="downvote-icon" type="button" name="downvote-btn"></button>
        <p class="quality-text">quality: <span class="quality-value">${$quality}</span></p>
      </div>
    </article>`
  );
}

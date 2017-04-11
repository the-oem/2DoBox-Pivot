var keyArray = [];

updatedKeyArray();
onPageLoad();

function updatedKeyArray() {
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    keyArray.push(key);
  }
}

function onPageLoad() {
  retrieveLocally();
}

$('.save-idea').on('click', function () {
  var $title = $('.title-storage').val();
  var $body = $('.body-storage').val();
  var $id = Date.now();
  var $newIdea = new Idea($title, $body, $id);
  clearInputFields();
  storeLocally($newIdea, $id);
  prependIdea($newIdea);
});

function storeLocally(Idea, id) {
  var stringifiedIdea = JSON.stringify(Idea);
  localStorage.setItem(id, stringifiedIdea);
}

function retrieveLocally() {
  var retrievedObject;
  keyArray.forEach(function (key) {
    retrievedObject = JSON.parse(localStorage.getItem(key));
    prependIdea(retrievedObject);
  });
}

$('.title-storage').on('input', enableSave);
$('.body-storage').on('input', enableSave);

function clearInputFields() {
  var $title = $('.title-storage');
  var $body = $('.body-storage');
  $title.val('');
  $body.val('');
  toggleSaveDisable();
  enableSave();
}

function enableSave() {
  var $title = $('.title-storage').val();
  var $body = $('.body-storage').val();
  if ($title !== '' && $body !== '') {
    toggleSaveDisable(false);
  } else {
    toggleSaveDisable(true);
  }
}

function toggleSaveDisable(value) {
  $('.save-idea').prop('disabled', value);
}

function Idea(title, body, id) {
  this.title = title;
  this.body = body;
  this.id = id;
  this.quality = 'quality: swill';
}

function prependIdea(newIdea) {
  var $title = newIdea.title;
  var $body = newIdea.body;
  var $quality = newIdea.quality;
  var $id = newIdea.id;
  $('.idea-container').prepend(
    `<article class="idea-card" id=
  ${$id}>
      <div class="card-header">
        <h2 contenteditable="true">${$title}</h2>
        <button class="delete-icon" type="button" name="delete-button"></button>
      </div>
      <p class="body-text" contenteditable="true">${$body}</p>
      <div class="quality-container">
        <button class="upvote-icon" type="button" name="upvote-btn"></button>
        <button class="downvote-icon" type="button" name="downvote-btn"></button>
        <p class="quality-text">${$quality}</p>
      </div>
    </article>`
  );
}

$('.idea-container').on('click', '.upvote-icon', function () {
  var $qualityElement = $(this).parent().find('.quality-text');
  if ($qualityElement.text() === 'quality: swill') {
    $qualityElement.text('quality: plausible');
  } else if ($qualityElement.text() === 'quality: plausible') {
    $qualityElement.text('quality: genius');
  };
});

$('.idea-container').on('click', '.downvote-icon', function () {
  var $qualityElement = $(this).parent().find('.quality-text');
  if ($qualityElement.text() === 'quality: genius') {
    $qualityElement.text('quality: plausible');
  } else if ($qualityElement.text() === 'quality: plausible') {
    $qualityElement.text('quality: swill');
  };
});

$('.idea-container').on('click', '.delete-icon', function () {
  var ideaId = $(this).closest('.idea-card').attr('id');
  localStorage.removeItem(ideaId);
  $(this).closest('.idea-card').remove();
});

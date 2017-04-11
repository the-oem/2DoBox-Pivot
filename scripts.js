// Document setup
$(document).ready(pageSetup);

//updatedKeyArray();

/***EVENT LISTENTERS**/
$('.save-idea').on('click', updateIdea);
$('.title-storage').on('input', enableSave);
$('.body-storage').on('input', enableSave);
$('.idea-container')
	.on('click', '.upvote-icon', upVote)
	.on('click', '.downvote-icon', downVote)
	.on('click', '.delete-icon', deleteCard);


/***FUNCTIONS*/
function Idea(title, body) {
	this.id = Date.now();
	this.title = title;
	this.body = body;
	this.quality = 'quality: swill';
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
	if ($qualityElement.text() === 'quality: swill') {
		$qualityElement.text('quality: plausible');
	} else if ($qualityElement.text() === 'quality: plausible') {
		$qualityElement.text('quality: genius');
	};
};

function downVote() {
	var $qualityElement = $(this).parent().find('.quality-text');
	if ($qualityElement.text() === 'quality: genius') {
		$qualityElement.text('quality: plausible');
	} else if ($qualityElement.text() === 'quality: plausible') {
		$qualityElement.text('quality: swill');
	};
};

function deleteCard() {
	var $ideaId = $(this).closest('.idea-card').attr('id');
	var newArray = getIdeasFromLocalStorage().filter(function (idea) {
		return idea.id != $ideaId;
	})
	addIdeaArrayToLocalStorage(newArray);
	$(this).closest('.idea-card').remove();
};

function updateIdea() {
	var $title = $('.title-storage').val();
	var $body = $('.body-storage').val();
	var $newIdea = new Idea($title, $body);
	clearInputFields();
	addIdeaToLocalStorage($newIdea);
	prependIdea($newIdea);
}

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
	ideaArray.forEach(function (idea) {
		prependIdea(idea);
	})
}

function prependIdea(newIdea) {
	var $title = newIdea.title;
	var $body = newIdea.body;
	var $quality = newIdea.quality;
	var $id = newIdea.id;
	$('.idea-container').append(
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
        <p class="quality-text">${$quality}</p>
      </div>
    </article>`
	);
}

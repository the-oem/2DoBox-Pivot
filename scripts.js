// Document setup
$(document).ready(pageSetup);

/***EVENT LISTENTERS**/
$('.save-idea').on('click', createIdea);
$('.title-storage').on('input', enableSave);
$('.body-storage').on('input', enableSave);
$('.search-input').on('input', showSearchResults);
$('.idea-container')
	.on('click', '.upvote-icon', adjustQuality)
	.on('click', '.downvote-icon', adjustQuality)
	.on('click', '.delete-icon', deleteIdea);

/***FUNCTIONS*/
function Idea(title, body) {
	this.id = Date.now();
	this.title = title;
	this.body = body;
	this.quality = 'swill';
}

function clearInputFields() {
	$('.title-storage').val('');
	$('.body-storage').val('');
	enableSave();
}

/***REFACTORED FUNCTIONS***/
function pageSetup() {
	writeIdeasToPage(getIdeasFromLocalStorage());
}

function toggleDisabled(element, value) {
	element.prop('disabled', value);
}

function createIdea() {
	var $newIdea = new Idea($('.title-storage').val(), $('.body-storage').val());
	clearInputFields();
	addIdeaToLocalStorage($newIdea);
	prependIdea($newIdea);
}

function enableSave() {
	if ($('.title-storage').val() !== '' && $('.body-storage').val() !== '') {
		toggleDisabled($('.save-idea'), false);
	} else {
		toggleDisabled($('.save-idea'), true);
	}
};

function adjustQuality() {
	var $button = $(this).prop('class');
	var qualityArray = ['swill', 'plausible', 'genius'];
	var $qualityValue = $(this).parent().find('.quality-value').text();
	switch ($button) {
		case 'upvote-icon':
			var newValue = qualityArray[qualityArray.indexOf($qualityValue) + 1] || $qualityValue;
			break;
		case 'downvote-icon':
			var newValue = qualityArray[qualityArray.indexOf($qualityValue) - 1] || $qualityValue;
			break;
		default:
	}
	updatePageText($(this).parent().find('.quality-value'), newValue);
	updateIdea($(this).closest('.idea-card').attr('id'), 'quality', newValue);
}

function updatePageText(element, value) {
	element.text(value);
}

function updateIdea(id, property, value) {
	var newArray = getIdeasFromLocalStorage().map(function (idea) {
		if (idea.id == id) {
			idea[property] = value;
		}
		return idea;
	});
	addIdeaArrayToLocalStorage(newArray);
}

function deleteIdea() {
	var $ideaId = $(this).closest('.idea-card').attr('id');
	$(this).closest('.idea-card').remove();
	deleteIdeaFromLocalStorage($ideaId);
};

// STORAGE FUNCTIONS

function addIdeaToLocalStorage(idea) {
	var ideaArray = getIdeasFromLocalStorage();
	ideaArray.unshift(idea);
	addIdeaArrayToLocalStorage(ideaArray);
}

function deleteIdeaFromLocalStorage(ideaId) {
	var newArray = getIdeasFromLocalStorage().filter(function (idea) {
		return idea.id != ideaId;
	})
	addIdeaArrayToLocalStorage(newArray);
}

function addIdeaArrayToLocalStorage(ideaArray) {
	localStorage.setItem('ideaBoxArray', JSON.stringify(ideaArray));
}

function getIdeasFromLocalStorage() {
	return JSON.parse(localStorage.getItem('ideaBoxArray')) || [];
}

function writeIdeasToPage(ideaArray) {
	ideaArray.reverse().forEach(function (idea) {
		prependIdea(idea);
	})
}

function prependIdea(newIdea) {
	$('.idea-container').prepend(`<article class="idea-card" id=${newIdea.id}>
      <div class="card-header"><h2 contenteditable="true">${newIdea.title}</h2>
        <button class="delete-icon" type="button" name="delete-button"></button></div>
      <p class="body-text" contenteditable="true">${newIdea.body}</p>
      <div class="quality-container">
        <button class="upvote-icon" type="button" name="upvote-btn"></button><button class="downvote-icon" type="button" name="downvote-btn"></button>
        <p class="quality-text">quality: <span class="quality-value">${newIdea.quality}</span></p>
      </div></article>`);
}

function toggleDisabled(buttonReference, value) {
	buttonReference.prop('disabled', value);
}

function showSearchResults() {
	var $searchTerm = $(this).val().toUpperCase();
	if ($searchTerm !== '') {
		var results = getIdeasFromLocalStorage().filter(function (idea) {
			return idea.title.toUpperCase().indexOf($searchTerm) > -1 || idea.body.toUpperCase().indexOf($searchTerm) > -1 || idea.quality.toUpperCase().indexOf($searchTerm) > -1;
		});
	} else {
		var results = getIdeasFromLocalStorage();
	}
	$('.idea-container').children().remove();
	writeIdeasToPage(results);
}

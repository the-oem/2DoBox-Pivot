// Document setup
$(document).ready(pageSetup);

/***EVENT LISTENTERS**/
$('.save-task').on('click', createCard);
$('.title-storage').on('input', enableSave);
$('.task-storage').on('input', enableSave);
$('.filter-input').on('input', showSearchResults);
$('.task-container')
  .on('input keydown', '.title-text', editCardInline)
  .on('input keydown', '.body-text', editCardInline)
	.on('click', '.upvote-icon', adjustQuality)
	.on('click', '.downvote-icon', adjustQuality)
	.on('click', '.delete-icon', deleteCard);


/***FUNCTIONS*/
function Card(title, body) {
	this.id = Date.now();
	this.title = title;
	this.body = body;
	this.quality = 'swill';
}

function clearInputFields() {
	$('.title-storage').val('');
	$('.task-storage').val('');
	enableSave();
}

/***REFACTORED FUNCTIONS***/
function pageSetup() {
	writeCardsToPage(getCardsFromLocalStorage());
}

function toggleDisabled(element, value) {
	element.prop('disabled', value);
}

function createCard() {
	var $newCard = new Card($('.title-storage').val(), $('.task-storage').val());
	clearInputFields();
	addCardToLocalStorage($newCard);
	prependCard($newCard);
}

function enableSave() {
	if ($('.title-storage').val() !== '' && $('.task-storage').val() !== '') {
		toggleDisabled($('.save-task'), false);
	} else {
		toggleDisabled($('.save-task'), true);
	}
};

function adjustQuality() {
	var qualityArray = ['swill', 'plausible', 'genius'];
	var $qualityValue = $(this).parent().find('.quality-value').text();
	switch ($(this).prop('class')) {
		case 'upvote-icon':
			var newValue = qualityArray[qualityArray.indexOf($qualityValue) + 1] || $qualityValue;
			break;
		case 'downvote-icon':
			var newValue = qualityArray[qualityArray.indexOf($qualityValue) - 1] || $qualityValue;
			break;
		default:
	}
	updatePageText($(this).parent().find('.quality-value'), newValue);
	updateCard($(this).closest('.task-card').attr('id'), 'quality', newValue);
}

function updatePageText(element, value) {
	element.text(value);
}

function updateCard(id, property, value) {
	var newArray = getCardsFromLocalStorage().map(function (card) {
		if (card.id == id) {
			card[property] = value;
		}
		return card;
	});
	addCardArrayToLocalStorage(newArray);
}

function deleteCard() {
	var $cardId = $(this).closest('.task-card').attr('id');
	$(this).closest('.task-card').remove();
	deleteCardFromLocalStorage($cardId);
};

function editCardInline() {
  if(event.keyCode === 13) {
    event.preventDefault();
    this.blur();
  }
  var $cardId = $(this).closest('.task-card').attr('id');
  updateCard($cardId, 'title', $(this).closest('.task-card').find('.title-text').text());
  updateCard($cardId, 'body', $(this).closest('.task-card').find('.body-text').text());
}

// STORAGE FUNCTIONS
function addCardToLocalStorage(card) {
	var cardArray = getCardsFromLocalStorage();
	cardArray.unshift(card);
	addCardArrayToLocalStorage(cardArray);
}

function deleteCardFromLocalStorage(cardId) {
	var newArray = getCardsFromLocalStorage().filter(function (card) {
		return card.id != cardId;
	})
	addCardArrayToLocalStorage(newArray);
}

function addCardArrayToLocalStorage(cardArray) {
	localStorage.setItem('cardBoxArray', JSON.stringify(cardArray));
}

function getCardsFromLocalStorage() {
	return JSON.parse(localStorage.getItem('cardBoxArray')) || [];
}

function writeCardsToPage(cardArray) {
	cardArray.reverse().forEach(function (card) {
		prependCard(card);
	})
}

function prependCard(newCard) {
	$('.task-container').prepend(`<article class="task-card" id=${newCard.id}>
      <div class="card-header"><h2 class="title-text" contenteditable="true">${newCard.title}</h2>
        <button class="delete-icon" type="button" name="delete-button"></button></div>
      <p class="body-text" contenteditable="true">${newCard.body}</p>
      <div class="quality-container">
        <button class="upvote-icon" type="button" name="upvote-btn"></button><button class="downvote-icon" type="button" name="downvote-btn"></button>
        <p class="quality-text">quality: <span class="quality-value">${newCard.quality}</span></p>
      </div></article>`);
}

function showSearchResults() {
	var $searchTerm = $(this).val().toUpperCase();
	if ($searchTerm !== '') {
		var results = getCardsFromLocalStorage().filter(function (card) {
			return card.title.toUpperCase().indexOf($searchTerm) > -1 || card.body.toUpperCase().indexOf($searchTerm) > -1 || card.quality.toUpperCase().indexOf($searchTerm) > -1;
		});
	} else {
		var results = getCardsFromLocalStorage();
	}
	$('.task-container').children().remove();
	writeCardsToPage(results);
}

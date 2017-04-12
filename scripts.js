// Document setup
$(document).ready(pageSetup);

/***EVENT LISTENTERS**/
$('.save-task').on('click', createCard);
$('.title-storage').on('input', enableSave);
$('.task-storage').on('input', enableSave);
$('.filter-input').on('input', showSearchResults);
$('.show-completed').on('click', showCompletedTasks)
$('.task-container')
	.on('input keydown', '.title-text', editCardInline)
	.on('input keydown', '.body-text', editCardInline)
	.on('click', '.upvote-icon', adjustImportance)
	.on('click', '.downvote-icon', adjustImportance)
	.on('click', '.delete-icon', deleteCard)
	.on('click', '.complete-task', completeTask);


/***FUNCTIONS*/
function Card(title, body) {
	this.id = Date.now();
	this.title = title;
	this.body = body;
	this.importance = 'normal';
	this.completed = false;
}

function clearInputFields() {
	$('.title-storage').val('');
	$('.task-storage').val('');
	enableSave();
}

/***REFACTORED FUNCTIONS***/
function pageSetup() {
	writeCardsToPage(getUncompletedCardsFromLocalStorage());
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

function adjustImportance() {
	var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
	var $importanceValue = $(this).parent().find('.importance-value').text();
	switch ($(this).prop('class')) {
		case 'upvote-icon':
			var newValue = importanceArray[importanceArray.indexOf($importanceValue) + 1] || $importanceValue;
			break;
		case 'downvote-icon':
			var newValue = importanceArray[importanceArray.indexOf($importanceValue) - 1] || $importanceValue;
			break;
		default:
	}
	updatePageText($(this).parent().find('.importance-value'), newValue);
	updateCard($(this).closest('.task-card').attr('id'), 'importance', newValue);
}

function updatePageText(element, value) {
	element.text(value);
}

function updateCard(id, property, value) {
	var newArray = getAllCardsFromLocalStorage().map(function (card) {
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
	if (event.keyCode === 13) {
		event.preventDefault();
		this.blur();
	}
	var $cardId = $(this).closest('.task-card').attr('id');
	updateCard($cardId, 'title', $(this).closest('.task-card').find('.title-text').text());
	updateCard($cardId, 'body', $(this).closest('.task-card').find('.body-text').text());
}

function completeTask() {
	var $cardId = $(this).closest('.task-card').attr('id');
	updateCard($cardId, 'completed', true);
	// TODO Update the DOM with styling for completed card.
}

function showCompletedTasks() {
	writeCardsToPage(getCompletedCardsFromLocalStorage());
}

// STORAGE FUNCTIONS
function addCardToLocalStorage(card) {
	var cardArray = getAllCardsFromLocalStorage();
	cardArray.unshift(card);
	addCardArrayToLocalStorage(cardArray);
}

function deleteCardFromLocalStorage(cardId) {
	var newArray = getAllCardsFromLocalStorage().filter(function (card) {
		return card.id != cardId;
	})
	addCardArrayToLocalStorage(newArray);
}

function addCardArrayToLocalStorage(cardArray) {
	localStorage.setItem('cardBoxArray', JSON.stringify(cardArray));
}

function getAllCardsFromLocalStorage() {
	return JSON.parse(localStorage.getItem('cardBoxArray')) || [];
}

function getCompletedCardsFromLocalStorage() {
	var newArray = getAllCardsFromLocalStorage().filter(function (card) {
		return card.completed == true;
	})
	console.log('Completed cards: ' + newArray);
	return newArray;
}

function getUncompletedCardsFromLocalStorage() {
	var newArray = getAllCardsFromLocalStorage().filter(function (card) {
		return card.completed == false;
	})
	console.log('Uncompleted cards: ' + newArray);
	return newArray;
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
      <div class="importance-container">
        <button class="upvote-icon" type="button" name="upvote-btn"></button><button class="downvote-icon" type="button" name="downvote-btn"></button>
        <p class="importance-text">importance: <span class="importance-value">${newCard.importance}</span></p>
      </div><button class="complete-task" type="button" name="complete-button">Complete Task</button> : ${newCard.completed}</article>`);
}

function showSearchResults() {
	var $searchTerm = $(this).val().toUpperCase();
	if ($searchTerm !== '') {
		var results = getAllCardsFromLocalStorage().filter(function (card) {
			return card.title.toUpperCase().indexOf($searchTerm) > -1 || card.body.toUpperCase().indexOf($searchTerm) > -1 || card.importance.toUpperCase().indexOf($searchTerm) > -1;
		});
	} else {
		var results = getAllCardsFromLocalStorage();
	}
	$('.task-container').children().remove();
	writeCardsToPage(results);
}

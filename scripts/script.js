document.addEventListener("DOMContentLoaded", function () {
    // Создать container div
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container");

    // Создать hangman section
    const hangmanSection = document.createElement("div");
    hangmanSection.classList.add("hangman-section");
    const hangmanImage = document.createElement("img");
    hangmanImage.src = "images/hangman-0.svg";
    hangmanImage.setAttribute("draggable", "false");
    hangmanImage.alt = "image-hangman";
    const hangmanTitle = document.createElement("h1");
    hangmanTitle.innerText = "HANGMAN GAME";
    hangmanSection.appendChild(hangmanImage);
    hangmanSection.appendChild(hangmanTitle);

    // Создать game section
    const gameSection = document.createElement("div");
    gameSection.classList.add("game-section");
    const wordDisplay = document.createElement("ul");
    wordDisplay.classList.add("word-display");
    const hintText = document.createElement("h4");
    hintText.classList.add("hint-text");
    hintText.innerHTML = "Hint: <b></b>";
    const guessesText = document.createElement("h4");
    guessesText.classList.add("guesses-text");
    guessesText.innerHTML = "Incorrect guesses: <b></b>";
    const keyboardDiv = document.createElement("div");
    keyboardDiv.classList.add("keyboard");
    gameSection.appendChild(wordDisplay);
    gameSection.appendChild(hintText);
    gameSection.appendChild(guessesText);
    gameSection.appendChild(keyboardDiv);

    // Создать game modal
    const gameModal = document.createElement("div");
    gameModal.classList.add("game-modal");
    const modalContent = document.createElement("div");
    modalContent.classList.add("content");
    const modalImage = document.createElement("img");
    modalImage.src = "images/sad-bunny.gif";
    modalImage.alt = "sad-bunny-gif";
    const modalTitle = document.createElement("h4");
    modalTitle.innerText = "Game Over!";
    const modalParagraph = document.createElement("p");
    modalParagraph.innerHTML = "The correct word was: <b></b>";
    const playAgainBtn = document.createElement("button");
    playAgainBtn.classList.add("play-again");
    playAgainBtn.innerText = "Play Again";
    modalContent.appendChild(modalImage);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalParagraph);
    modalContent.appendChild(playAgainBtn);
    gameModal.appendChild(modalContent);

    // Добавить элементы to the container
    containerDiv.appendChild(hangmanSection);
    containerDiv.appendChild(gameSection);
    containerDiv.appendChild(gameModal);

    // Добавить container to the body
    document.body.appendChild(containerDiv);

const wordQuestion = [
    {
        word: "dog",
        hint: "Man's best friend"
    },
    {
        word: "cat",
        hint: "Walking on his own"
    },
    {
        word: "job",
        hint: "That is not a wolf and will not run into the forest"
    },
    {
        word: "laptop",
        hint: "An object with which a working person always interacts"
    },
    {
        word: "friend",
        hint: "Who helps in trouble"
    },
    {
        word: "fir",
        hint: "Winter and summer in the same color"
    },
    {
        word: "dream",
        hint: "What can you see with your eyes closed"
    },
    {
        word: "airplane",
        hint: "Doesn't flap its wings, but flies; not a bird, but outruns birds"
    },
    {
        word: "lessons",
        hint: "What can you cook but can't eat"
    },
    {
        word: "cabbage",
        hint: "100 clothes and all without fasteners"
    },
];

// const hangmanImage = document.querySelector(".hangman-section img")
 const keyBoardDiv = document.querySelector(".keyboard");
// const wordDisplay = document.querySelector(".word-display");
// const guessesText = document.querySelector(".guesses-text b");
// const gameModal = document.querySelector(".game-modal");
//const playAgainBtn = document.querySelector(".play-again");

let currentWord;
let correctLetters;
let wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    //сбрасіваем все игровые переменные и UI элементы
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;
    keyBoardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => ` <li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
}
let lastRandomIndex = -1;
const getRandomWord = () => {
    let randomIndex;
    //проверка, чтобы новый индекс не совпадал с предыд
    do {
        randomIndex = Math.floor(Math.random() * wordQuestion.length);
    } while (randomIndex === lastRandomIndex);

    lastRandomIndex = randomIndex;
    //рандом слова/вопросы
    const {word, hint} = wordQuestion[randomIndex];
    currentWord = word;
    //console.log(word);
    // console.log(word, hint);
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}
//модал окно
const gameOver = (isVictory) => {
    //после завершения игры показывается модальное онко с деталями
    setTimeout(() => {
        const modalText = isVictory ? `You found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'yaaaay' : 'sad-bunny'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!!!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    //console.log(button, clickedLetter);
    //проверка если clickedLetter существует в currentWord
    if (currentWord.includes(clickedLetter)) {
        //console.log(clickedLetter, "is exist on the word");
        //показываем все правильнвые буквы на дисплее
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        //console.log(clickedLetter, "is not exist on the word");
        //если нажатая буква не сущ - то обновляем wrongGuessCount изображение и счетчик
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `Incorrect guesses: ${wrongGuessCount} / ${maxGuesses}`;

    //вызов функции gameOver, если эти условия выполн
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
};
//созд кнопок алфавита и добав список событий
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    //console.log(String.fromCharCode(i));
    keyBoardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));

}
document.addEventListener("keydown", function (event) {

const isModalVisible = gameModal.classList.contains("show");//проверка. видно ли модалку
      if (!isModalVisible) {
        const keyPressed = event.key.toLowerCase();
        // Проверка, что нажатая клавиша - буква
        if (/^[a-z]$/.test(keyPressed)) {
            const buttons = document.querySelectorAll(".keyboard button");
            for (const button of buttons) {
                const buttonText = button.innerText.toLowerCase();
                if (buttonText === keyPressed && !button.disabled) {
                    initGame(button, keyPressed);
                    break; // Прерываем цикл, если кнопка найдена
                }
            }
        }
      }
    });

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
});
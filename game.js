"use strict"
const $ = document.querySelectorAll.bind(document);

//get the character info
let character = $("#character")[0];
let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue("right"));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue("width"));

//get the ground info
let ground = $("#ground")[0];
let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue("bottom"));
let groundHeignt = parseInt(window.getComputedStyle(ground).getPropertyValue("height"));

let isJumping = false;
let upTime;
let downTime;

let gameResult = $("#result")[0];
let gameScore = $("#score")[0];
let score = 0;

let startbtnDiv = $("#startbtndiv");
let startbtn = $("#startbtn");

startbtn.addEventListener("click", {
    control
    })

function jump() {
    if(isJumping) return;
    upTime = setInterval(() => {
        if(characterBottom >= groundHeignt + 150) {
            clearInterval(upTime);
            downTime = setInterval(() => {
                if(characterBottom <= groundHeignt + 10) {
                    clearInterval(downTime);
                    isJumping = false;
                }
                characterBottom -= 10;
                character.style.bottom = characterBottom + "px";        
            }, 20)
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + "px";
        isJumping = true;
    }, 20)
}

function showScore() {
    score++;
    gameScore.innerText = score;
}

setInterval(showScore, 100)

function getBlock() {
    let blocks = $(".blocks")[0];
    let block = document.createElement("div");
    block.setAttribute("class", "block");
    blocks.appendChild(block);

    let randomTimeout = Math.floor(Math.random() * 1000) + 1000
    let blockRight = -30;
    let blockBottm = 30;
    let blockWidth = 40;
    let blockHeight = 36;

    function moveBlock() {
        blockRight += 5;
        block.style.right = blockRight + "px";
        block.style.bottom = blockBottm + "px";
        block.style.width = blockWidth + "px";
        block.style.height = blockHeight + "px";
        if(characterRight >= blockRight - characterWidth && 
            characterRight <= blockRight + blockWidth && 
            characterBottom <= blockBottm + blockHeight) {
                gameResult.innerHTML = `<h4>Game Over</h4>
                                        <h6>Your score is ${score}`;
                clearInterval(blockInterval);
                clearTimeout(blockTimeout);
                location.reload()
            }

    }

    //console.log(Math.floor(Math.random() * 50));
    let blockInterval = setInterval(moveBlock, 20);
    let blockTimeout = setTimeout(getBlock, randomTimeout);

}


function control(e) {
    if (e.key == "ArrowUp" || e.key == " "){
        jump();
    }
}
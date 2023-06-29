"use strict"
const $ = document.querySelectorAll.bind(document);
//default setting
let isStart=false;
let isFirsttime=true;
control();


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

let startbtnDiv = $("#startbtndiv")[0];
let startbtn = $("#startbtn")[0];

//button ctrl jump
startbtn.addEventListener("click", e=>{
    isStart=true;
    //console.log(isStart);
    startbtnDiv.classList.add("d-none")
    getBlock();
    showScore();
})

//jump function
function jump(isFirst) {
    if(isJumping) return;
    showScore()
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

// show the score function
function showScore() {
    gameScore.innerText = score;
    score++
}

//geting the block run
function getBlock() {
    let blocks = $(".blocks")[0];
    let block = document.createElement("div");
if(isStart){
    block.classList.add("block");
    block.classList.add("block"+(parseInt(Math.random()*3+1)));
    blocks.appendChild(block);
}
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
            characterRight <= blockRight-12 + blockWidth && 
            characterBottom <= blockBottm + blockHeight-6) {//hit 
                isStart=false;
                gameResult.innerHTML = `Your score is ${score-1}`;
                startbtnDiv.classList.remove("d-none");
                $("#btn")[0].innerHTML=`
                <div><button onclick="location.reload()">reset</button></div>
                
                `
                $("#gameOver")[0].classList.remove("d-none");
                
                clearInterval(blockInterval);
                clearTimeout(blockTimeout)
            }

    }
    let blockInterval = setInterval(_=>{
        moveBlock();
    }, 20);
    let blockTimeout = setTimeout(getBlock, randomTimeout);

}

//game control function
function control() {
    window.addEventListener("keypress", e=>{
        if(isStart){
            // if(e.key="")
            if (e.key == "ArrowUp" || e.key == " "){
                jump()
            }
        }
    })  
    window.addEventListener("click",e=>{
         if(isStart && !isFirsttime) jump(isFirsttime)
         isFirsttime=false;
     })
}

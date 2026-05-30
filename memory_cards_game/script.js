let cards
const card_holder=document.querySelector(".wrapper ul.cards ")
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
let number_of_items=15
let arrjj = [1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15];
let bot_selection=false,user_select=true
let allElementIndex=[]
let card_fliping=false
const shuffle = (array) => { 
    return array.sort(() => Math.random() - 0.5);
};
for (let i = 0; i <number_of_items*2; i++) {
    card_holder.innerHTML+=`
        <li class="card" data-pos=${i}>
          <div class="view front-view">
            <img src="images/que_icon.svg" alt="icon">
          </div>
          <div class="view back-view">
            <img src="images/que_icon.svg" alt="card-img">
          </div>
        </li>
    `
    cards= document.querySelectorAll(".card");
}
function check_status(bot,player){
    bot_selection=bot
    user_select=player
    if (!user_select && bot_selection){
        document.documentElement.style.setProperty("--table_value",2)
        bot_player()
    }else{
        document.documentElement.style.setProperty("--table_value",0)
        
    }
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15];
    
    let arr_hld=[]
    for (let i=0; i<2;i++){
        arr_hld=(shuffle(arr))
    }
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr_hld[i]}.svg`;
        allElementIndex.push(i)
        card.addEventListener("click",flipCard)
    });
}
shuffleCard();
function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
            
        }

        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
        
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        allElementIndex=allElementIndex.filter(item=> item!==parseInt(cardOne.dataset.pos))
        allElementIndex=allElementIndex.filter(item=> item!==parseInt(cardTwo.dataset.pos))
        if(matched == 15) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}
function bot_player(){
    let botSelectionList=allElementIndex
    if (bot_selection && !user_select){

    }
}
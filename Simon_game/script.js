const boxes=document.querySelectorAll(".boxes")
const butn=document.querySelector(".img")
const but=document.querySelector(".responsive-wrapper")
const but2=document.querySelector(".container2")
const game_over=document.querySelector(".div")
// Generating a random function
function getRanInt(min,max){
    return Math.floor(Math.random()*(max - min +1))+min;
}
// function to play audio
function func(audio) {
    audio.play()
}

// function to show user click gesture
function showClick(index){
    boxes[index].style="filter:brightness(1.5); transform:scaleY(1.2) scaleX(1.2);z-index:1;"
    var audio=new Audio(`${index}.mp3`); 
    func(audio)
    setTimeout(()=>{
        boxes[index].style="filter:brightness(1); transform:scaleY(1) scaleX(1); z-index:0;"
    },250)
}
// function to run the audio function when click a show click gesture NOT USEABLE FOR NAW SHA
function Toggle(index){
    var audio=new Audio(`${index}.mp3`); 
    boxes[index].click()
    showClick(index)
    func(audio)
}

// start game dev
butn.addEventListener("click",()=>{
    but2.style.display="none"
    but.style.display="flex"
    const but0=document.querySelector(".container")
    document.querySelector(".container").style.height=`${(but0.offsetWidth).toFixed(2)}px`
    // document.querySelector(".container").style.width=`${but0.offsetWidth.toFixed(2)}px`
    startGame()
})
window.addEventListener("resize",()=>{
    const but0=document.querySelector(".container")
    document.querySelector(".container").style.height=`${but0.offsetWidth.toFixed(2)}px`
    // document.querySelector(".container").style.width=`${but0.offsetWidth.toFixed(2)}px`
})
//declaring the game variables 
let bot_selection=false
let user_selection=false
const user_memory=[]
let game_timeout=1

// the function that determines weather the bot is still selecting  clicked boxes or the user is still selecting to avoid bugs
// if bot selection is true that means the bot is free to select boxes to click
// causing the user to be unable to click any box
function startGame(){
    if (!user_selection & !bot_selection){
        bot_selection=true
        user_selection=false
        bot_select()
    }
}

// Generating random sequence for for user to memorize  
const bot_memory=[]
function slect_bot_data(){
    const data=getRanInt(0,3)
    bot_memory.push(data)
}
let count=0
function bot_select(){
    slect_bot_data()
    let rounds=-1
    var game_interval=setInterval(()=>{
        //console.log("running" + bot_memory)
        rounds++
        
        showClick(bot_memory[rounds])
    },1000)
    setTimeout(()=>{
        clearInterval(game_interval)
        bot_selection=false
        user_selection=true
        count++
        document.querySelector(".center .holder h2").innerHTML=count
    },1000*bot_memory.length)
}
let match=false
function checkMatch(a){
    if (a.join("")===bot_memory.join("")){
        return true

    }else {
        return false
        
    }
}
let flow_count=0
let user_flow=[]
function check_flow(i){   
    user_flow.push(i)
    if (bot_memory[flow_count]===user_flow[flow_count]) {
        /* return true */
        console.log("continue")
        
    }else{
        /* return false */
        setTimeout(()=>{
            document.querySelector(".score-value").innerHTML=bot_memory.length-1
            document.body.style.background="#161a22"
            game_over.classList.add("view-gameover")
        },1000)
        
    }
    flow_count+=1
}
let a=[]
boxes.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        if (!bot_selection && user_selection){           
            a.push(index)          
            check_flow(index)  
            if (a.length===bot_memory.length ){
                match =checkMatch(a)
                user_flow=[]
                flow_count=0
            }
            
            showClick(index)
            if (match){
                a=[]
                match=false
                setTimeout(()=>{
                    bot_select()
                    bot_selection=true
                    user_selection=false
                },1000)
            }
        }
        
    })
})

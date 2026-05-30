let children
let items
const shuffle = (array) => { 
    return array.sort(() => Math.random() - 0.5);
}; 
let emptyIndex
let RandomArray
let ra
let emptyItem
let count=0
let play_permit=false
let endpoint=16
let divisor
const holder=document.querySelector(".game ul")
const  selection=document.querySelectorAll(".options")
const selection_page=document.querySelector(".selection")
const container=document.querySelector(".container")
var root=document.documentElement
var style1=getComputedStyle(root)
const headTag=document.getElementsByTagName("head")[0]
const styletag=document.createElement("style")
let path

let items_value=[]
let reff
selection[0].onclick=()=>{
    holder.classList.add("three")
    endpoint=9
    reff=10
    divisor=3
    load(reff)
    path="3x3crown"
    selection_page.style.display="none"
    container.style.display="flex"
    styletag.innerHTML=positions[0]
    headTag.appendChild(styletag)
    const but0=document.querySelector(".container")
    document.querySelector(".container").style.height=`${but0.offsetWidth.toFixed(2)}px`
    start_game()
}
window.addEventListener("resize",()=>{
    const but0=document.querySelector(".container")
    document.querySelector(".container").style.height=`${but0.offsetWidth.toFixed(2)}px`
    // document.querySelector(".container").style.width=`${but0.offsetWidth.toFixed(2)}px`
})
selection[1].onclick=()=>{
    holder.classList.add("four")
    endpoint=16
    divisor=4
    reff=17
    load(reff)
    path="4x4crown"
    selection_page.style.display="none"
    container.style.display="flex"
    styletag.innerHTML=positions[1]
    headTag.appendChild(styletag)
    start_game()
}
selection[2].onclick=()=>{
    holder.classList.add("five")
    endpoint=25
    divisor=5
    reff=26
    load(reff)
    path="r3"
    selection_page.style.display="none"
    container.style.display="flex"
    styletag.innerHTML=positions[2]
    headTag.appendChild(styletag)
    start_game()
}
console.log(items_value)
function getIndex(params,item) {
    emptyIndex=params
    emptyItem=item
}

function load(reff){
    for (let i=1; i<reff; i++){
        items_value.push(i)
    }
    for (let i=0; i<items_value.length;i++){
        holder.innerHTML+=` <li data-pos=${i}>${i}</li>`
    }
}
function start_game(){
    const inter=setInterval(()=>{ 
        ra=shuffle(items_value)
        items=document.querySelectorAll(".game ul li")
        items.forEach((item,index)=>{
            item.innerHTML=ra[index] 
            item.style.backgroundImage =`url(./${path}/${ra[index]}.png)`
            if (item.innerText==endpoint){
                item.classList.add("empty")
                
                item.style.backgroundImage="none"
                getIndex(index,item)
            } else{
                item.classList.remove("empty")
            }
        })
        children=document.querySelector("ul").children
    },100)
    // detecting gameover
    
    setTimeout(()=>{
        clearInterval(inter)
        play_permit=true
         items.forEach((item,index,array)=>{
             
            item.addEventListener("click",(e)=>{
                e.preventDefault();    
                if (play_permit){
                    move(e)
                    moveEntireRowsOrColumn(e)
                    game_status()
                }
                if(parseInt(item.innerText)==parseInt(item.dataset.pos)+1){
                    item.classList.add("dd")
                }else{
                    item.classList.remove("dd")
                }
                
            })
        }) 
    },3000)
}
window.onclick=()=>{
    game_status()
}
function move(e){
    // the box u clicked is set to the first position
    var firstPos = parseInt(e.target.dataset.pos);
    // the empty box is the box that has no image that empty space
    var empty = emptyItem
    // just getting the data position of the empty element
    var secondPos = parseInt(empty.dataset.pos);
    // the top box from the empty box will always be the data position of the empty element - the number of items in a row
    // for example in a box of 3 items in a row and 3 items in a column total 9 element in the box including the empty element
    // if the data position of the empty element is 5 that means it is the second element in the second row
    // so the item at the top of the empty element will have a data position of 2 also 5 - 3=2
    let top = secondPos-divisor;
    // same as the bottom 5 + 3 = 8 for a 3*3 box the data position of the item under the empty element will be 8
    let bottom = secondPos+divisor;
    // no talking too much on the right and left please think
    let left = secondPos-1;
    let right = secondPos+1;
    // so this is the condition if the empty element data position % 3 (in a 3*3 box) - bla bla bla 
    // dont worry i will explain this one to you my self i no get strenght to type 
    if (secondPos%divisor-left%divisor < 1) {
        left = -1;
    }
    if (right%divisor-secondPos%divisor < 1) {
        right = -1;
    }
    // okay here is where we push all the possibilites both the top ,left right and bottom 
    var posibilities = [left, right, top, bottom];  
    // so if we click an element its data position so be either one of the posibilities for the sliding magic o happen 
    if (posibilities.includes(firstPos)) {
        // so here is where we swap the two items data positions 
        empty.dataset.pos = firstPos;
        e.target.dataset.pos = secondPos;
        count++
    
        // document.querySelector("h3 span").innerHTML=count;
        // document.querySelector(".h3").innerHTML=count;
    }else{
        e.target.classList.add("shake")
        setTimeout(()=>{
            e.target.classList.remove("shake")
        },450)
    }
}
function moveEntireRowsOrColumn(e){
   null
}
let stable_items
function game_status(){
    stable_items=document.querySelectorAll(".dd")
    if (stable_items.length===endpoint-1) { 
        play_permit=false
        setTimeout(()=>{
            items[emptyIndex].classList.add("join")
            items[emptyIndex].innerHTML=""
            items[emptyIndex].style.backgroundImage =`url(./${path}/${endpoint}.png)`
            items[emptyIndex].style.zIndex="0"
            for (let i=0; i<stable_items.length; i++){
                stable_items[i].classList.add("join")
                stable_items[i].innerHTML=""
                document.querySelector(".container .game ul").classList.add("show-background")
                
            }
        },1000)
    }
}


function reload(){
    window.location.reload()
}

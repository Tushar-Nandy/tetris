document.addEventListener('DOMContentLoaded',()=>{
    const grid=document.querySelector('.grid')
    const scoreDisplay=document.querySelector('#score')
    const width = 10
    const height =20
    const startButton=document.querySelector('#start-button')
    let timerId
    let score=0
    const leftButton=document.querySelector('#left')
    const rightButton=document.querySelector('#right')
    const rotateButton=document.querySelector('#rotate')

    //the tetrominoes
    const lTetromino=[
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]
    const zTetromino=[
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]
    const tTetromino=[
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    const oTetromino=[
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const iTetroino=[
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    
    const theTetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetroino]
    let currentPosition=0
    let currentRotation=0
    //randomly select a tetromino and its first rotation    
    let random=Math.floor(Math.random()*theTetrominoes.length)
    let current= theTetrominoes[random][currentRotation]

    //console.log(current)

    function createGrid(){
        for(let i=0;i<height*width;i++){
            const sqaure=document.createElement('div')
            sqaure.classList.add('sqaure')
            grid.appendChild(sqaure)            
        }
        sqaures=Array.from(grid.querySelectorAll('.sqaure'))  
        for(let i=0;i<width;i++){
            const sqaure=document.createElement('div')
            sqaure.classList.add('taken')
            grid.appendChild(sqaure)  
            sqaures.push(sqaure)          
        }
            
    }
   
    createGrid()

    //draw the first rotation in the first tetromino
    function draw(){
        current.forEach(index=>{
            sqaures[currentPosition+index].classList.add('tetromino')
        })
    }
    //console.log(sqaures)
    
    function undraw(){
        current.forEach(index=>{
            sqaures[currentPosition+index].classList.remove('tetromino')
        })
    }

    //make the tetromino move down every second
    //timerId=setInterval(moveDown,250)

    //assign functions to keyCodes
    function control(e){
        if(e.keyCode===37){
            moveLeft()
    }
    else if(e.keyCode===39){
        moveRight()
    }
    else if(e.keyCode===38){
        //arrow up key
        rotate()
    }
    else if(e.keyCode===40){
        rotate()}

    }

    document.addEventListener('keyup',control)

    function moveDown(){
        undraw()
        currentPosition+=width
        draw()
        freeze()
    }

    //freeze function
    function freeze(){
        if(current.some(index=>sqaures[currentPosition+index+width].classList.contains('taken'))){
            current.forEach(index=>sqaures[currentPosition+index].classList.add('taken'))
            //start a new tetromino falling
            random=Math.floor(Math.random()*theTetrominoes.length)
            current=theTetrominoes[random][currentRotation]
            //new tetromino position
            currentPosition=(currentPosition+4)%width
            draw()
            addScore()
            gameOver()
        }
    }
    
    //move the tetromino left,unless is at the edge or there is a blockage
    function moveLeft(){
        undraw()
        const isAtLeftEdge=current.some(index=>(currentPosition+index)%width===0)

        if(!isAtLeftEdge) {currentPosition-=1}
        if(current.some(index=>sqaures[currentPosition+index].classList.contains('taken'))){
            currentPosition+=1
        }
        draw()
    }

    //move the tetromino right,unless is at the edge or there is a blockage
    function moveRight(){
        undraw()
        const isAtRightEdge=current.some(index=>(currentPosition+index)%width===width-1)
        if(!isAtRightEdge) currentPosition+=1
        if(current.some(index=>(sqaures[currentPosition+index].classList.contains('taken')))){
            currentPosition-=1
        }
        draw()
    }

    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation===current.length){
            currentRotation=0
        }
        current=theTetrominoes[random][currentRotation]
        draw()
    }
//add functionality to the button
leftButton.addEventListener('click',moveLeft)
rightButton.addEventListener('click',moveRight)
rotateButton.addEventListener('click',rotate)
startButton.addEventListener('click',()=>{
    if(timerId){
        clearInterval(timerId)
        timerId=null
    }
    else{
        draw()
        timerId=setInterval(moveDown,250)
    }
})

// add score
function addScore(){
    for(let i=0;i<199;i+=width){
        const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
        if(row.every(index=>sqaures[index].classList.contains('taken'))){
            score+=10
            scoreDisplay.innerHTML=score
            row.forEach(index=>{
                sqaures[index].classList.remove('taken')
                sqaures[index].classList.remove('tetromino')
            })
            const sqauresRemoved=sqaures.splice(i,width)
            sqaures=sqauresRemoved.concat(sqaures)
            sqaures.forEach(cell=>grid.appendChild(cell))
            
    }
}
}

//game over
function gameOver(){
    if(current.some(index=>sqaures[currentPosition+index].classList.contains('taken'))){
        scoreDisplay.innerHTML='end'
        clearInterval(timerId)
    }
}


})
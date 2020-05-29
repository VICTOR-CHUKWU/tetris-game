document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score=0;
    let speed = 1000;
    let flagTimer = 'resume';
    let gameEnd = false;


    //making the shapes
    const Ltetromino =[
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]
    const Ztetromino =[
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],

    ]
    const Ttetromino =[
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    const Otetromino =[
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const Itetromino =[
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
    ]

    const theTetrominoes =[Ltetromino,Ztetromino,Ttetromino,Otetromino,Itetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    //randomly sellect a tetromino
    let random = null;
    let current = null;


    //draw the tetromino
    function draw(){
        console.log('draw')
        current.forEach(index=>{
            squares[currentPosition + index].classList.add('tetromino');
        })
    }
    // draw();

    //undraw the tetromino
    function undraw(){
        console.log('undraw')
        current.forEach(index=>{
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

     //make the tetromino move down every second
     //timerId = setInterval(moveDown,1000);

    //assign key codes
    function control(e) {
        if(e.keyCode ===37){
            moveLeft()
        }else if(e.keyCode ===38){
            rotate();
        }else if(e.keyCode ===39){
           moveRight()
        }else if(e.keyCode ===40){
            moveDown()
        }
    }

    function setTouchKeys () {
        document.querySelector('.up').addEventListener('click', rotate);
        document.querySelector('.down').addEventListener('click', moveDown);
        document.querySelector('.right').addEventListener('click', moveRight);
        document.querySelector('.left').addEventListener('click', moveLeft);
    }

    function disableTouchKeys () {
        document.querySelector('.up').removeEventListener('click', rotate);
        document.querySelector('.down').removeEventListener('click', moveDown);
        document.querySelector('.right').removeEventListener('click', moveRight);
        document.querySelector('.left').removeEventListener('click', moveLeft);
    }

    //move down function
    function moveDown(){
        freeze();
        if (currentPosition >= 0) undraw()
        console.log(88888)
        currentPosition +=width;
        draw();
    }
   

    //freeze function to make the tetrominos stop at the base of d grid
    function freeze() {
        if(current.some(index=>squares[currentPosition+ index + width].classList.contains('taken'))){
            current.some(index=>squares[currentPosition+ index ].classList.add('taken'));
            random= nextRandom
            currentRotation = 0;
            current = theTetrominoes[random][currentRotation];
            currentPosition= 4;
            // draw();
            displayShape();
            addScore();
            gameOver();
            currentPosition= -6;
        }
    }

    //draw tetromino to the left,unless they is a current tetromino
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index=>(currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }
        draw();
    }

    //draw tetromino to the right,unless they is a current tetromino
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index=>(currentPosition+ index) % width ===width -1);
        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }
        draw();
        
    }

    //write function to rotate the terominoes shape
    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === theTetrominoes[random].length) {
            currentRotation = 0;
        }

        let useRight = current.some(index=>(currentPosition+ index) % width ===width -1);
        useRight = useRight || current.some(index=>(currentPosition + 1 + index) % width ===width -1);

        current = theTetrominoes[random][currentRotation];
        
        if (useRight) {
            let isAtRightEdge = current.some(index=>(currentPosition+ index) % width ===width -1);
            if(isAtRightEdge) currentPosition -=1;
            isAtRightEdge = current.some(index=>(currentPosition+ index) % width ===width -1);
            if(isAtRightEdge) currentPosition -=1;
        } else {
            let isAtLeftEdge = current.some(index=>(currentPosition + index) % width === 0);
            if(isAtLeftEdge) currentPosition = Math.floor(currentPosition/width) * width
        }
        


        if(current.some(index=>squares[currentPosition + index].classList.contains('taken'))){
            currentRotation -=1
            current = theTetrominoes[random][currentRotation];
        }

        

        draw()
    }

    //show up next tetromino in the grid div
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the tetrominoes withot rotation
    const upNextTetromino =[
        [1,displayWidth+1,displayWidth*2+1,2], //l tetromino first index
        [0,displayWidth,displayWidth+1,displayWidth*2+1],  //z tetromino first index
        [1,displayWidth,displayWidth+1,displayWidth+2],  // t tetromino first index
        [0,1,displayWidth,displayWidth+1],         //o tetromino index
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],  // i tetromino first index

    ]

    //display the tetromino in the mini grid
    function displayShape(){
        nextRandom =Math.floor(Math.random()*theTetrominoes.length);
        //remove any trace of tetromino in the grid
        displaySquares.forEach(index=>{
            index.classList.remove('tetromino');
        })
        upNextTetromino[nextRandom].forEach(index=>{
            displaySquares[displayIndex + index].classList.add('tetromino');
        })
    }
    displayShape();
    
    //to add functionality to our button
    startBtn.addEventListener('click', ()=>{
        if (gameEnd) {
            restartGame();
        }
       if(timerId) {
           clearInterval(timerId);
           timerId = null;
           document.removeEventListener('keydown', control)
           disableTouchKeys()
       }else{
           if (random === null) { 
               random = nextRandom;
               current = theTetrominoes[random][currentRotation];
               displayShape();
           }
           draw();
           timerId = setInterval(moveDown,speed);
           document.addEventListener('keydown', control)
           setTouchKeys()
       }
       pause();
    })

    //trying resume from stack overflow
    function pause() { 
        if( flagTimer=='resume') {
          document.getElementById('start-button').innerHTML="Pause";
          flagTimer='pause';
        } else {
          flagTimer='resume';
          document.getElementById('start-button').innerHTML="Resume";
        }
      
      }
      

    //add score
    function addScore() {
        for(i=0;i<199;i+=width) {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

            if(row.every(index=>squares[index].classList.contains('taken'))){
            score +=10
            scoreDisplay.innerHTML = score;
            row.forEach(index=>{
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            })

            const squareRemoved = squares.splice(i,width);

            squares = squareRemoved.concat(squares);
            squares.forEach(cell=>grid.appendChild(cell))
           }
        }
        if(score>40){
            speed -=500
        }
        console.log(speed)
        
    }

    function restartGame() {
        gameEnd = false;
        score = 0;
        scoreDisplay.innerHTML = score;
        for(let i = 0; i < 200; i++) {
            squares[i].classList.remove('tetromino')
            squares[i].classList.remove('taken')
        }
        document.querySelector('.go').style.display = 'none';
    }

    // game over
    function gameOver() {
        if(current.some(index=>squares[currentPosition+ index].classList.contains('taken'))){
            scoreDisplay.innerHTML = score;
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener('keydown', control);
            disableTouchKeys();
            gameEnd = true;
            document.getElementById('start-button').innerHTML="Restart";
            document.querySelector('.go').style.display = 'block';
        }
    }
  
})
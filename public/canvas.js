
let canvas = document.querySelector("canvas");
let tool = canvas.getContext("2d");
let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let eraserTool = document.querySelector(".eraser");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = "red";
let pencilWidth = pencilWidthElem.value;

let eraserColor = "white";
let eraserWidth = eraserWidthElem.value;


tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

let mouseDown = false;
let eraserDown = false;


// performing undo and redo 
let undoRedoTracker = []; // this has the graphic data jo humne perform kara
let track = -1; // this to track data graphic

// undo and redo functionality
undo.addEventListener("click",(e)=>{
    // track action
    if(track > 0){
        track--;
    }

    // let trackObj = {
    //     trackValue: track,
    //     undoRedoTracker
    // };
    let data = {
        trackValue: track,
        undoRedoTracker
    };

    socket.emit("redoUndo",data);

    console.log(track);

    // undoRedoCanvas(trackObj);
})

redo.addEventListener("click",(e)=>{
    if(track < undoRedoTracker.length-1) track++;

    // action
    // let trackObj = {
    //     trackValue: track,
    //     undoRedoTracker

    // }

    let data = {
        trackValue: track,
        undoRedoTracker
    };


    socket.emit("redoUndo",data);
    console.log(track);
    // undoRedoCanvas(trackObj);
})


// ye function array mei se last action ki image bana ka usko draw karta hai
function undoRedoCanvas(trackObj){

    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    

    // tool.putImageData(undoRedoTracker[track],0,0);


    let url = undoRedoTracker[track];
    let image = new Image();
    image.src = url;
    image.onload = (e) =>{
        tool.drawImage(image,0,0,canvas.width,canvas.height);
    }

}




// applying event listener to the canvas for mouseDown
canvas.addEventListener("mousedown",(e)=>{
    mouseDown = true;
    let data = {
        x:e.clientX,
        y: e.clientY
    }

    // send data to server
    socket.emit("beginPath",data);

    // beginPath({
    //     x:e.clientX,
    //     y:e.clientY
    // });
    
});


canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown) {
        let data = {
            x:e.clientX,
            y:e.clientY,
            color : eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }
        socket.emit("drawStroke",data);
    }
    
    // drawStroke({
    //     x:e.clientX,
    //     y:e.clientY,
    //     color : eraserFlag ? eraserColor : pencilColor,
    //     width: eraserFlag ? eraserWidth : pencilWidth
    // })

});

canvas.addEventListener("mouseup",(e)=>{
    mouseDown = false;

    // undoRedoTracker.push(tool.getImageData(0,0,canvas.width,canvas.height));
    // track++;
    
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;

    console.log(undoRedoTracker);
    console.log(track);
})

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}


pencilColors.forEach((colorElem) =>{
    colorElem.addEventListener("click",(e)=>{
        let color = colorElem.classList[0];
        console.log(color);
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
});

pencilWidthElem.addEventListener("change",(e)=>{
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})
eraserWidthElem.addEventListener("change",(e) =>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
    console.log(eraserWidth);
})

eraserTool.addEventListener("click",(e)=>{

    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else{
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
})


download.addEventListener("click",(e)=>{
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "canvas.jpg";
    a.click();
})


socket.on("beginPath",(data) =>{
    beginPath(data);
})


socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("redoUndo",(data)=>{
    undoRedoCanvas(data);
})
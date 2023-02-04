let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true // true matlab the tools container is showing & false matlab ki toools container hidden

let toolsCont = document.querySelector(".tools-cont");
let toolsAnimationFlag = true;

let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

let pencilIconElem = document.querySelector(".pencil");
let pencilFlag = false; // false means pencil cont is not showing for now

let eraserToolElem = document.querySelector(".eraser");
let eraserFlag = false; // false means eraser cont is not showing for now

let stickyIconElem = document.querySelector(".stickyNote");

let upload = document.querySelector(".upload");




optionsCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;
    if (optionsFlag) openToolsCont();
    else closeToolsCont();
})


function openToolsCont() {
    let optionIconElem = optionsCont.children[0];
    optionIconElem.classList.remove("fa-times");
    optionIconElem.classList.add("fa-bars");
    toolsCont.classList.remove("scale-down-tools");
    toolsCont.classList.add("scale-tools");
    // toolsCont.style.display = "flex";
}

// function to close the toools container
function closeToolsCont() {
    let optionIconElem = optionsCont.children[0];
    optionIconElem.classList.remove("fa-bars");
    optionIconElem.classList.add("fa-times");
    toolsCont.classList.remove("scale-tools");
    toolsCont.classList.add("scale-down-tools");
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    // toolsCont.style.display="none"

}


pencilIconElem.addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) pencilToolCont.style.display = "flex";
    else pencilToolCont.style.display = "none";
})

eraserToolElem.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    if (eraserFlag) eraserToolCont.style.display = "flex";
    else eraserToolCont.style.display = "none";
})

upload.addEventListener("click",(e)=>{
    // to open the file explorer
    let input =  document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="sticky-cont">
            <div class="sticky-header">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="sticky-note">
                <img src="${url}"/>
            </div>
        </div>`
        createSticky(stickyTemplateHTML);
    })

});


stickyIconElem.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="sticky-cont">
        <div class="sticky-header">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="sticky-note">
            <textarea spellcheck="false"></textarea>
        </div>
    </div>`

    createSticky(stickyTemplateHTML);

})

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let note = stickyCont.querySelector(".sticky-note");
        let display = getComputedStyle(note).getPropertyValue("display");
        if (display === "none") note.style.display = "block"
        else note.style.display = "none"
    })

}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
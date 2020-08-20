
const PRESET_WIDTH = 16;
const PRESET_HEIGHT = 16;

const drawContainer = document.querySelector("#drawContainer");
const submitButton = document.querySelector("#submitButton");
const widthField = document.querySelector("#widthInput");
const heightField = document.querySelector("#heightInput");

function createDiv(obj){
    let divEl = document.createElement("DIV");

    if(obj){//Pass styles, classes or ids via optional object parameters
            //Syntax: { property: value }
        for(item in obj){
            if(item === "id" || item === "className"){
                divEl[item] = obj[item];
            }else{
                divEl.style[item] = obj[item];
            }
            
        }
    }

    return divEl;
}


function createGrid(numRows, numCols){
    let divWidth = (drawContainer.clientWidth /numCols);
    let divHeight = (drawContainer.clientHeight /numRows);

    let borderW = divWidth/(drawContainer.clientWidth/PRESET_WIDTH);
    let rowEl, divEl;

    console.log(`createGrid) clientWidth: ${drawContainer.clientWidth}, clientHeight: ${drawContainer.clientHeight}, divWidth: ${divWidth}, divHeight: ${divHeight}`);
    console.log(`borderW: ${borderW}`);
    for(let i = 0; i < numRows; i++){
        
        rowEl = createDiv({
            className: "row",
            width: "100%",
            height: divHeight + "px"
        });

        for(let j = 0; j < numCols; j++){

            divEl = createDiv({
                className: "gridPixel",
                width: divWidth + "px",
                height: "100%",
                borderWidth: borderW + "px"
            });
            
            rowEl.appendChild(divEl); 
        }
         drawContainer.appendChild(rowEl); 
    }


}

function preserveAspectRatio(e){
    console.log(`preserveAspectRatio) e.target.id: ${e.target.id}`);
    let ratio = drawContainer.clientWidth/drawContainer.clientHeight;
    if(e.target.id === "widthInput"){
        heightInput.value = ratio * widthInput.value;
    }else{
        widthInput.value = ratio * heightInput.value;
    }
}



function colorPixel(e){
    if(e.target.className.indexOf("filledPixel") === -1){//Do not repeatedly add filledPixel class
        e.target.className += " filledPixel";
    }
}

//drawContainer.addEventListener('mousemove', colorPixel);

function clearGrid(){
    console.log("clearGrid called");
    drawContainer.innerHTML = "";
}


function dragEvent(el, func){//Sets mousemove, mouseup and mousedown events to simulate drag
    console.log(`dragEvent) ${this}`);
    let mouseMoveFunc = function(e){
        console.log("mouseMove");
        func(e);
        e.stopPropagation();
    };

    let mouseUpFunc = function(e){
        console.log(`mouseUpEvent`);
        el.removeEventListener('mousemove', mouseMoveFunc);
        el.removeEventListener('mouseup', mouseUpFunc);
        e.stopPropagation();
    };

    let mouseDownFunc = function(e){
        func(e); //Calling function once on mousedown feels more responsive
        el.addEventListener('mousemove',mouseMoveFunc);
        el.addEventListener('mouseup', mouseUpFunc);
        e.stopPropagation();
    }

    el.addEventListener('mousedown', mouseDownFunc);
    
}

dragEvent(drawContainer, colorPixel);

createGrid(PRESET_HEIGHT, PRESET_WIDTH);

widthInput.addEventListener('focusout', preserveAspectRatio);
heightInput.addEventListener('focusout',preserveAspectRatio);

submitButton.addEventListener('click', function(){
    
    let w = widthField.value || PRESET_WIDTH;
    let h = heightField.value || PRESET_HEIGHT;

    console.log(`submitButton pressed) w:${w}, h:${h}`);

    clearGrid();
    createGrid(h, w);
});


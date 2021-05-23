
const PRESET_WIDTH = 16;
const PRESET_HEIGHT = 16;

const DEFAULT_COLOR = [0,0,0,0];
const DEFAULT_OPACITY = 0.1;

const drawContainer = document.querySelector("#drawContainer");
const submitButton = document.querySelector("#submitButton");
const widthField = document.querySelector("#widthInput");
const heightField = document.querySelector("#heightInput");
const aspectRatioLink = document.querySelector("#aspectRatioLink");
const aspectRatioSVGArr = document.querySelectorAll(".svg-lock");

console.dir(aspectRatioSVGArr);

//Changeable settings
let COLORING_METHOD;
let OPACITY = 0.1;
let PRESERVE_ASPECT_RATIO = true;

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
        /*
        rowEl = createDiv({
            className: "row",
            width: "100%",
            height: divHeight + "px"
        });*/

        for(let j = 0; j < numCols; j++){

            divEl = createDiv({
                className: "gridPixel",
                width: divWidth + "px",
                height: divHeight + "px",
                borderWidth: borderW + "px",
                float: "left"
            });
            /*
            rowEl.appendChild(divEl); */
            drawContainer.appendChild(divEl);
        }
         /* drawContainer.appendChild(rowEl); */
    }


}

function preserveAspectRatio(e){
    if(PRESERVE_ASPECT_RATIO){
        console.log(`preserveAspectRatio) e.target.id: ${e.target.id}`);
    let ratio = drawContainer.clientWidth/drawContainer.clientHeight;
    if(e.target.id === "widthInput"){
        heightInput.value = ratio * widthInput.value;
    }else{
        widthInput.value = ratio * heightInput.value;
    }
    }
    
}

let fillStyle;
let prevTarget;

function colorPixel(e){
    //Do not paint the drawContainer or a pixel more than once before touching another pixel
    if(e.target.id === "drawContainer" || e.target === prevTarget){
        return;
    }

            let colorArr = getFillColor(e.target);
            console.log("colorArr: "+colorArr);
            let r = colorArr[0];
            let g = colorArr[1];
            let b = colorArr[2];
            let a = colorArr[3];
            
            e.target.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
    

    prevTarget = e.target;
}

function returnColorArray(divEl){
    let colorArr;
    let str = divEl.style.backgroundColor;
    console.log("returnColorArray) str: "+str);
    if(str === ""){
        console.log("no string");
        colorArr = [...DEFAULT_COLOR];
    }else{
        let pattern = /[0-9.]{1,3}/g;
        colorArr = str.match(pattern);
        console.log("returnColorArray) colorArr: " + colorArr);
        if(colorArr.length === 3){
            colorArr.push(1);
        }
    }
    return colorArr;
}

function increaseOpacity(aVal){
    let newVal = (aVal*100 + OPACITY*100)/100;
    console.log("increaseOpacity) aVal: "+aVal+", newVal: "+newVal);
    if(newVal > 1){
        return 1;
    }
    return newVal;
}

function getFillColor(divEl){
    
    let colorArr = returnColorArray(divEl)
    console.log("getFillColor) divEl: "+divEl+", colorArr: "+colorArr);

    if(COLORING_METHOD === "random"){
        for(let i = 0; i < 3; i++){
            colorArr[i] = Math.floor(Math.random()*255);
        }
        colorArr[3] = increaseOpacity(colorArr[3]);
    }else if(COLORING_METHOD === "erase"){
        colorArr = [...DEFAULT_COLOR];
    }else{
        colorArr[3] = increaseOpacity(colorArr[3]);
    }

    return colorArr;
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
        prevTarget = null;
        previousX = previousY = null;
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

drawContainer.childNodes[1].style.backgroundColor = "rgba(0,0,0,1)";

function turnKnob(e){
    let knob = e.target.parentNode;
    let currentX = e.clientX;
    let currentY = e.clientY;
    let deltaX = previousX? currentX - previousX : 0;
    let deltaY = previousY? currentY - previousY : 0;
}

aspectRatioLink.addEventListener('click', togglePreserveAspectRatio);

function togglePreserveAspectRatio(){
    PRESERVE_ASPECT_RATIO = !PRESERVE_ASPECT_RATIO;

   for(let i = 0; i < aspectRatioSVGArr.length;i++){
       toggleClass(aspectRatioSVGArr[i],"hidden");
   }
    
}

function toggleClass(el, str){
    console.log("toggleClass) el: "+el+", str: "+str);
    let prevClass = el.getAttribute("class");
    console.log("prevClass: "+prevClass);
    if(!prevClass || prevClass.indexOf(str) === -1){
        console.log(str + " found");
        el.setAttribute("class", prevClass + " " + str);
    }else{
        console.log(str+ " not found");
        el.setAttribute("class", prevClass.replace((" " + str), ""));
    }
}

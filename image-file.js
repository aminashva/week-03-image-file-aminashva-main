/*
    Code samle for CSCI 2408 Computer Graphics Fall 2022 
    (c)2022 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;
var fileopen;
// Image to read supported image files
var image = new Image();
// File reader to read TGA files
var filereader = new FileReader();
window.onload = init;

function init() {
    console.log("init... Begin");
    // Get reference to the file input
    fileopen = document.getElementById("file-open");
    if (fileopen) {
        //Set a listener for the selected file change event
        fileopen.onchange = onChange;
        console.log("init... Okay");
    }
    // Get reference to the button
    button = document.getElementById("proc-button");
    button.onclick = processImage;
    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");
    // Once the image is loaded draw it on the canvas
    image.onload = onImageLoad;
    // Once the TGA file is loaded draw it on the canvas
    filereader.onloadend = onLoadEnd;
    console.log("init... End");
}

function onImageLoad() {
    console.log("onImageLoad... Begin");
    // Resize the canvas to match the image size
    canvas.width = image.width;
    canvas.height = image.height;
    // Draw the image from the top left
    context.drawImage(image, 0, 0);
    console.log("onImageLoad... End");
}

function onLoadEnd() {
    console.log("onLoadEnd... Begin");
    // Read image specifications from the file
    view = new DataView(filereader.result, 0, 2);
    let tgaIDLength = view.getUint8(0);
    let tgaColorMapType = view.getUint8(1);
    view = new DataView(filereader.result, 12, 6);
    let tgaWidth = view.getUint16(0, true);
    let tgaHeight = view.getUint16(2, true);
    let tgaPixelDepth = view.getUint8(4);
    let tgaDescriptor = view.getUint8(5);
    let tgaAlphaBits = tgaDescriptor % 16;
    //console.log("onLoadEnd... "+ tgaWidth +"x"+ tgaHeight +"x"+ tgaPixelDepth +"x"+ tgaAlphaBits);
    // Use template literals delimited with backtick to show specification
    console.log(`onLoadEnd... Size: ${tgaWidth}x${tgaHeight} Depth: ${tgaPixelDepth} Alpha: ${tgaAlphaBits} Color map: ${tgaColorMapType}`);
    // Resize the canvas to match the image size
    canvas.height = tgaHeight;
    canvas.width = tgaWidth;
    // Get image data for all the canvas
    const imgdata = context.getImageData(0, 0, canvas.width, canvas.height);
    // Get the array containing the pixel data in the RGBA order
    const data = imgdata.data;
    // Fetch the pixel data from the file
    view = new DataView(filereader.result, 18 + tgaIDLength + tgaColorMapType);
    for (var y = 0; y < tgaHeight; y++) {
        for (var x = 0; x < tgaWidth; x++) {
            var icanvas = (y * tgaWidth + x) * 4;
            var ifile = (y * tgaWidth + x) * tgaPixelDepth / 8;
            switch (tgaPixelDepth) {
                case 16:
                    // TODO 
                    break;
                case 24: 
                    // TODO
                    break;
                case 32: // AAAAAAAA RRRRRRRR GGGGGGGG BBBBBBBB
                    blue = view.getUint8(ifile +0);
                    green = view.getUint8(ifile +1);
                    red = view.getUint8(ifile +2);
                    alpha = view.getUint8(ifile +3);
                    break;
            }
            data[icanvas+0] = red;
            data[icanvas+1] = green;
            data[icanvas+2] = blue;
            data[icanvas+3] = alpha;
        }
    }
    context.putImageData(imgdata, 0, 0);
    console.log("onLoadEnd... End");
}

function onChange(e) {
    console.log("onChange... Begin");
    // Get the name of the selected file
    const files = fileopen.files;
    // Get the file name extension (pop removes the last element in the array)
    fileext = files[0].name.split('.').pop().toLowerCase();
    if (fileext == "tga") {
        console.log("onChange... TGA");
        filereader.readAsArrayBuffer(files[0]);
    } else {
        console.log("onChange... Non-TGA");
        //image.src = files[0].name;
        image.src = URL.createObjectURL(files[0]);
    }
    //console.log(image.src);
    console.log("onChange... End");
}

function processImage() {
    console.log("Processing... Begin")
    // Get image data for all the canvas
    const imgdata = context.getImageData(0, 0, canvas.width, canvas.height);
    // Get the array containing the pixel data in the RGBA order
    const data = imgdata.data;
    for (var i = 0; i < data.length; i += 4) {
        // Manipulating colors (inverting)
       let tr = 0.393*data[i] + 0.769*data[i+1] + 0.189*data[i+2];
       let tg = 0.349*data[i] + 0.686*data[i+1] + 0.168*data[i+2];
       let tb = 0.272*data[i] + 0.534*data[i+1] + 0.131*data[i+2];
       if (tr > 255){ data[i] = 255 }else data[i] = tr
       if (tg > 2550) { data[i+1] = 255} else data[i+1] = tg
       if (tb > 255)  {data[i+2] = 255} else data[i+2] = tb
       /*data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];*/
    }
    context.putImageData(imgdata, 0, 0);
    console.log("Processing... End")
}

// Draw a line using the canvas coordinates
function drawLine(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
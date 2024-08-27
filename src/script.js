console.log("Hello, world! | script.js")

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const preview = document.getElementById('preview');
    const shredder = document.getElementById('shredder');

    const canvas = document.getElementById('canvas');

    let srcToShred;

    let secondImage = new Image();
    secondImage.src = './assets/graph.png';
    secondImage.classList.add('shredder-image');
    shredder.appendChild(secondImage);

    const realSize = getConfig('RealisticSize') == 1;

    if (file) {
        let pdfMode = file.type === 'application/pdf';

        if (pdfMode) {
            console.log('PDF detected.')
            try {
                const pdfUrl = URL.createObjectURL(file);
                
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                
                const page = await pdf.getPage(1);
                
                const viewport = page.getViewport({ scale: realSize ? 0.75 : 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
    
                const dataURL = canvas.toDataURL();
    
                preview.innerHTML = `<img src="${dataURL}" class="image-preview">`;
                srcToShred = dataURL;
                
                pdfMode = false;
            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        } else {
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" class="image-preview">`;

                srcToShred = e.target.result;
            };

            reader.readAsDataURL(file);
        }

        anime({
            targets: preview,
            opacity: [0, 1],
            translateY: [-100, 0],
            duration: 500,
            easing: 'easeOutQuad',
            complete: function(anim) {

                document.getElementById('formContainer').classList.add('invisible');
                
                // preview.classList.add('swipe-out') // Debug

                // anime({
                //     targets: preview,
                //     keyframes: [
                //         {duration: 2000, maskPosition: ["448px 0px", "0px 0px"]}
                //     ], 
                //     easing: 'linear',
                //     duration: 3500
                // })

                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const img = preview.querySelector('img');

                const sizeX = getConfig('XSpacing'), sizeY = getConfig('YSpacing');
                const maxObjects = getConfig('MaxObjects');

                let imgToShred = new Image();
                imgToShred.src = srcToShred;

                const width = imgToShred.width/(sizeX);
                const height = imgToShred.height/(sizeY);

                console.log(`img.width: ${img.width}`)
                console.log(`img.height: ${img.height}`)

                const physicsContainer = document.getElementById('physics');

                physicsContainer.width = window.innerWidth;
                physicsContainer.height = window.innerHeight;

                let latch = new CountdownLatch(sizeY * sizeX);

                for (let y = 0; y < sizeY; y++) {               
                    for (let i = 0; i < sizeX; i++) {
                        if ((y * sizeX + i) >= maxObjects) break;

                        const div = document.createElement('div');

                        div.style.width = `${width}px`;
                        div.style.height = `${height}px`;

                        const shreddedImg = document.createElement('img');
                        // shreddedImg.src = srcToShred;
                        cropImageDataURL(srcToShred, i*width, y*height, imgToShred.width/sizeX, imgToShred.height/sizeY, function(croppedDataURL) {

                            shreddedImg.src = croppedDataURL;
            
                        });

                        shreddedImg.addEventListener('load', () => {
                            latch.countDown();
                        })

                        shreddedImg.classList.add('image-shred');
                        div.appendChild(shreddedImg);

                        // div.style.backgroundColor = getRandomColor();

                        div.classList.add('box2d');

                        div.style.position = 'absolute';
                        // div.style.left = `${5+(i % 18)*5/*+randomPercentage(5)*/}%`
                        
                        const dxpx = 40, dypx = 200;
                        // const dxpx = 20, dypx = 75;

                        div.style.left = `${i * dxpx}px`
                        div.style.top = `${y * dypx}px`

                        // div.style.top = `${(y/*  % 4 */)*200}px`

                        // div.style.left = `${5+(i % 30)*40}px`


                        physicsContainer.appendChild(div);
                    }
                }

                latch.await(() => {
                    console.log('done all');
                    init(); // Reinitialize Physics Engine
                    run(); // Activate Physics Engine
                });
                  

                return; // Debug

                anime({
                    targets: shredder,
                    keyframes: [
                        {duration: 200, opacity: [0, 1]},
                        {duration: 2500, right: ['-50%', '50%']},
                        {delay: 50, duration: 250, opacity: [1, 0]}
                    ],
                    duration: 3500,
                    easing: 'linear',
                });

                function getRandomColor() {
                    const letters = '0123456789ABCDEF';
                    let color = '#';
                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };

                function randomPercentage(n = 30) {
                    return Math.floor(Math.random() * n);
                }
            }
        });
    } else {
        preview.innerHTML = '<p class="text-red-500 font-semibold transition-all">No file selected!</p>';
        setTimeout(() => {});
    }
});

const dropArea = document.getElementById('formContainer');
const fileInput = document.getElementById('file');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files; // Simulate file selection
        // Here you can handle the file upload or display the file
    }
});

function cropImageDataURL(imageData, x, y, width, height, callback) {
    const img = new Image();
    img.src = imageData;
    
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(x, y, width, height);
        const croppedCanvas = document.createElement('canvas');

        croppedCanvas.width = width;
        croppedCanvas.height = height;

        croppedCanvas.getContext('2d').putImageData(imageData, 0, 0);
        
        callback(croppedCanvas.toDataURL());
    };
}

// From Github Gist by nowelium
let CountdownLatch = function (limit) {
    this.limit = limit;
    this.count = 0;
    this.waitBlock = function (){};
};

CountdownLatch.prototype.countDown = function () {
    this.count = this.count + 1;
    if(this.limit <= this.count){
        return this.waitBlock();
    }
};

CountdownLatch.prototype.await = function(callback) {
    this.waitBlock = callback;
};

function getConfig(name) {
    return document.getElementById(`setting${name}`).value;
}
console.log("Virtual Paper Shredder | Created by AdrianR3 with Box2D Physics Engine")

document.getElementById('uploadForm').addEventListener('submit', handleForm);

document.getElementById('shredder').ondragstart = function() { return false; };

document.getElementById('sample').addEventListener('click', async function(event) {
    event.preventDefault();

    if (getConfig('XSpacing') == 40 && getConfig('YSpacing') == 20) {
        const rand = Math.random() < 0.1;
        setConfig('XSpacing', rand ? 40 : 35);
        setConfig('YSpacing', rand ? 20 : 95)
    }

    setConfig('MaxObjects', 1500);

    handleForm(null, getSampleImageURI());
});


async function handleForm(event, sampleImageSrc = false) {
    if (event) event.preventDefault();

    console.log("Current Configuration:")
    console.log(getConfigData())

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const preview = document.getElementById('preview');
    const shredder = document.getElementById('shredder');

    // const canvas = document.getElementById('canvas');

    let srcToShred;

    let shredderImg = new Image();
    shredderImg.src = './assets/shredder.jpg';
    shredderImg.classList.add('shredder-image');
    shredder.appendChild(shredderImg);

    const realSize = getConfig('RealisticSize') == 1;

    if (file || sampleImageSrc) {
        if (!sampleImageSrc && file.type === 'application/pdf') {
            console.log('PDF detected.')
            try {
                const pdfUrl = URL.createObjectURL(file);
                
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                
                const page = await pdf.getPage(1);
            
                const viewport = page.getViewport({ scale: realSize ? 0.75 : getConfig('Scale') });
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

            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        } else {
            if (!sampleImageSrc) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" class="image-preview">`;

                    srcToShred = e.target.result;
                };

                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = `<img src="${sampleImageSrc}" class="image-preview">`;
                srcToShred = sampleImageSrc;
            }
        }

        document.body.classList.add('dissappear');

        anime({
            targets: preview,
            opacity: [0, 1],
            translateY: [-100, 0],
            duration: 500,
            delay: 1000,
            easing: 'easeOutQuad',
            complete: function(anim) {

                document.getElementById('formContainer').classList.add('dissappear');

                const shredDelay = 1000;

                anime({
                    targets: shredder,
                    keyframes: [
                        {duration: 200, opacity: [0, 1]},
                        {duration: 3000/2, right: ['-50%', '0%']},
                        {delay: 0, duration: 3000/2, right: ['0%', '50%']},
                        {delay: 0, duration: 250, opacity: [1, 0]},
                        {delay: 0, duration: 300, opacity: [0, 0]}
                    ],
                    delay: shredDelay,
                    duration: 3500,
                    easing: 'linear',
                    begin: () => {
                        anime({
                            targets: preview,
                            opacity: [1, 0],
                            duration: 500,
                            delay: 1000 + shredDelay,
                            easing: 'easeOutQuad',
                        });
                    },
                    complete: () => latch.countDown()
                });

                // const ctx = canvas.getContext('2d');
                // canvas.width = window.innerWidth;
                // canvas.height = window.innerHeight;

                const img = preview.querySelector('img');

                const sizeX = getConfig('Columns'), sizeY = getConfig('Rows');
                const maxObjects = getConfig('MaxObjects');

                let imgToShred = new Image();
                imgToShred.src = srcToShred;

                const width = imgToShred.width/(sizeX);
                const height = imgToShred.height/(sizeY);

                console.log(`img.width: ${img.width}/${sizeX}`)
                console.log(`img.height: ${img.height}/${sizeY}`)

                const physicsContainer = document.getElementById('physics');

                physicsContainer.width = window.innerWidth;
                physicsContainer.height = window.innerHeight;

                let latch = new CountdownLatch(sizeY * sizeX + 1);

                const trueScale = realSize ? 1 : getConfig('Scale');

                for (let y = 0; y < sizeY; y++) {               
                    for (let i = 0; i < sizeX; i++) {
                        if ((y * sizeX + i) >= maxObjects) {
                            latch.countDown();
                            continue;
                        };

                        const div = document.createElement('div');

                        div.style.width = `${width * trueScale}px`;
                        div.style.height = `${height * trueScale}px`;

                        const shreddedImg = document.createElement('img');
                        cropImageDataURL(srcToShred, i*width, y*height, imgToShred.width/sizeX, imgToShred.height/sizeY, function(croppedDataURL) {

                            shreddedImg.src = croppedDataURL;
            
                        });

                        shreddedImg.addEventListener('load', () => {
                            latch.countDown();
                        })

                        shreddedImg.classList.add('image-shred');
                        shreddedImg.classList.add('invisible');
                        div.appendChild(shreddedImg);

                        div.classList.add('box2d');

                        div.style.position = 'absolute';
                        
                        const dxpx = getConfig('XSpacing'), dypx = getConfig('YSpacing');

                        div.style.left = `${i * dxpx}px`
                        div.style.top = `${y * dypx}px`

                        physicsContainer.appendChild(div);
                    }
                }

                latch.await(() => {

                    document.querySelectorAll('.image-shred.invisible').forEach((el) => el.classList.remove('invisible'));

                    init(); // Reinitialize Physics Engine
                    run(); // Activate Physics Engine
                });

                function getRandomColor() {
                    const letters = '0123456789ABCDEF';
                    let color = '#';
                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };

            }
        });
    } else {
        clearTimeout(timeout);
        var timeout = setTimeout(() => {preview.querySelector('p').style.opacity = 0}, 1000);
        preview.innerHTML = '<p class="text-red-500 font-semibold transition-all duration-1000">No file selected!</p>';
    }
}

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


const realisticSizeSlider = document.getElementById('settingRealisticSize');
realisticSizeSlider.addEventListener('input', (e) => {
    const scaleSlider = document.getElementById('settingScale');
    if (e.target.value == 1) {
        scaleSlider.setAttribute('disabled', '');
    } else {
        scaleSlider.removeAttribute('disabled');
    }
})


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

function setConfig(key, value) {
    document.getElementById(`setting${key}`).value = value;
}

function getConfigData() {
    const config = {};
    const keys = [
        'MaxObjects', 
        'XSpacing', 
        'YSpacing', 
        'Rows', 
        'Columns', 
        'RealisticSize', 
        'Scale'
    ];

    keys.forEach(key => config[key] = getConfig(key));

    return config;
}
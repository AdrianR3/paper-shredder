console.log("Hello, world! | script.js")

document.getElementById('uploadForm').addEventListener('submit', function(event) {
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

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview">`;

            srcToShred = e.target.result;
        };

        anime({
            targets: preview,
            opacity: [0, 1],
            translateY: [-100, 0],
            duration: 500,
            easing: 'easeOutQuad',
            complete: function(anim) {
                
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

                const width = 80;
                const height = 80;

                const img = preview.querySelector('img');
                const physicsContainer = document.getElementById('physics');

                physicsContainer.width = window.innerWidth;
                physicsContainer.height = window.innerHeight;

                for (let i = 0; i < 10; i++) {
                    const div = document.createElement('div');

                    div.style.width = `${width}px`;
                    div.style.height = `${height}px`;

                    const shreddedImg = document.createElement('img');
                    // shreddedImg.width = '100px'; //
                    // shreddedImg.src = srcToShred;
                    cropImageDataURL(srcToShred, i*width, 50, width, height, function(croppedDataURL) {

                        shreddedImg.src = croppedDataURL;
        
                    });

                    // shreddedImg.style.objectPosition = `${i * div.offsetWidth}px 0px`; // Not working yet
                    // setTimeout(() => {
                    //     console.log(shreddedImg.style.objectPosition); // Not working yet
                    // }, 500);
                    shreddedImg.classList.add('image-shred');
                    div.appendChild(shreddedImg);

                    div.style.backgroundColor = getRandomColor();

                    div.classList.add('box2d');

                    div.style.position = 'absolute';
                    div.style.left = `${5+(i % 9)*10+randomPercentage(5)}%`
                    div.style.top = `${10+randomPercentage()}px`

                    physicsContainer.appendChild(div);
                }

                init(); // Reinitialize Physics Engine
                run(); // Activate Physics Engine

                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                // ctx.drawImage(img, (canvas.width - img.width)/2, (canvas.height - img.height)/2, img.width, img.height);

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

        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p class="text-red-500 font-semibold">No file selected!</p>';
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
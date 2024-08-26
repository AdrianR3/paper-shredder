console.log("Hello, world! | script.js")

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const preview = document.getElementById('preview');
    const shredder = document.getElementById('shredder');

    const canvas = document.getElementById('canvas');

    let secondImage = new Image();
    secondImage.src = './assets/graph.png';
    secondImage.classList.add('shredder-image');
    shredder.appendChild(secondImage);

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview">`;
        };

        anime({
            targets: preview,
            opacity: [0, 1],
            translateY: [-100, 0],
            duration: 500,
            easing: 'easeOutQuad',
            complete: function(anim) {
                
                // preview.classList.add('swipe-out') // Debug

                anime({
                    targets: preview,
                    keyframes: [
                        {duration: 2000, maskPosition: ["448px 0px", "0px 0px"]}
                    ], 
                    easing: 'linear',
                    duration: 3500
                })

                const ctx = canvas.getContext('2d');

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const img = preview.querySelector('img');
                const physicsContainer = document.getElementById('physics');

                physicsContainer.width = window.innerWidth;
                physicsContainer.height = window.innerHeight;

                for (let i = 0; i < 20; i++) {
                    const div = document.createElement('div');

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

                    // TODO: add part of image inside div

                    div.style.width = '80px';
                    div.style.height = '180px';
                    div.style.backgroundColor = getRandomColor();

                    div.classList.add('box2d');
                    div.style.position = 'absolute';
                    // div.style.top = '50%';
                    // div.style.left = '50%';
                    div.style.transform = `translate(${50+(i % 10)*150+randomPercentage()}px, ${50+randomPercentage()}px)`;

                    physicsContainer.appendChild(div);
                }

                init(); // Reinitialize Physics Engine

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
            }
        });

        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p class="text-red-500 font-semibold">No file selected!</p>';
    }
});
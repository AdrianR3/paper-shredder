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
                
                preview.classList.add('swipe-out') // Debug

                anime({
                    targets: preview,
                    keyframes: [
                        {duration: 2000, maskPosition: ["448px 0px", "0px 0px"]}
                    ], 
                    easing: 'easeOutQuad',
                    duration: 3500
                })

                const ctx = canvas.getContext('2d');

                // Set canvas size to match the window size
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                preview.innerHTML.onload = function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    ctx.drawImage(preview.innerHTML, 0, 0, canvas.width, canvas.height);
                };

                // Stack overflow
                // fileInput.addEventListener('change', (event) => {
                //     const file = event.target.files[0];

                //     if (file) {
                //         const reader = new FileReader();

                //         reader.onload = function(e) {
                //             const img = new Image();

                //             img.onload = function() {
                //                 // Clear the canvas before drawing the new image
                //                 ctx.clearRect(0, 0, canvas.width, canvas.height);
                //                 // Draw the image on the canvas
                //                 ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                //             };

                //             img.src = e.target.result;
                //         };

                //         reader.readAsDataURL(file);
                //     }
                // });

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
                    // complete: function() {
                    //     anime({
                    //         targets: mask,
                    //         background: [
                    //             'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%)',
                    //             'linear-gradient(to right, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 1) 100%)'
                    //         ],
                    //         duration: 1000,
                    //         easing: 'easeOutQuad'
                    //     });
                    // }
                });
            }
        });

        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p class="text-red-500">No file selected!</p>';
    }
});
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
                    easing: 'linear',
                    duration: 3500
                })

                const ctx = canvas.getContext('2d');

                console.log(ctx)

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const img = preview.querySelector('img');

                // preview/*.querySelector('img')*/.addEventListener('load', () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    ctx.drawImage(img, (canvas.width - img.width)/2, (canvas.height - img.height)/2, img.width, img.height);
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
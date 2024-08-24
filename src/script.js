console.log("Hello, world! | script.js")

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const preview = document.getElementById('preview');

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="image-preview">`;
        };

        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<p class="text-red-500">No file selected!</p>';
    }
});
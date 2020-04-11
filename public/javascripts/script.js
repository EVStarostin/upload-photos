document.addEventListener('DOMContentLoaded', init);

function init() {
    getImages();
    subscribe();
}

function getImages() {
    fetch(location.origin + '/files')
        .then(res => res.json())
        .then(renderImages)
        .catch(console.error)
}

function renderImages(images) {
    const containerNode = document.querySelector('.image-list');

    images.forEach(image => {
        const template = document.getElementById('list-item');
        const templateContent = template.content;
        const img = templateContent.querySelector('.image-list__image');
        const tag = templateContent.querySelector('.image-list__tags');
        
        img.src = 'images/' + image.filename;
        img.alt = image.tags.join(', ');
        tag.innerText = image.tags.join(', ');

        containerNode.appendChild(templateContent.cloneNode(true));
    });
}

function subscribe() {
    const formNode = document.querySelector('.upload');

    formNode.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
    e.preventDefault();

    const inputNode = document.querySelector('#file');
    const formData = new FormData();
    const options = { method: 'POST', body: formData };

    formData.append(inputNode.name, inputNode.files[0]);

    fetch(e.target.action, options)
        .then(res => res.json())
        .then(image => renderImages([image]))
        .catch(console.error)
}

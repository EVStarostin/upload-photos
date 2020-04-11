document.addEventListener('DOMContentLoaded', init);

function init() {
    fetchImages();
    subscribeForm();
}

function fetchImages() {
    const url = location.origin + '/files';

    fetch(url)
        .then(res => res.json())
        .then(renderImages)
        .catch(console.error)
}

function renderImages(images) {
    console.log(images);

    const containerNode = document.querySelector('.images__list');

    images.forEach(image => {
        const itemNode = document.createElement('div');
        itemNode.className = 'images__item';

        const imageContainerNode = document.createElement('div');
        imageContainerNode.className = 'image';

        const imageWrapperNode = document.createElement('div');
        imageWrapperNode.className = 'image__wrapper';

        const imageNode = document.createElement('img');
        imageNode.className = 'image__img';
        imageNode.src = 'images/' + image.filename;

        const tagsNode = document.createElement('div');
        tagsNode.className = 'images__tags';
        tagsNode.innerText = image.tags.join('; ');

        imageWrapperNode.append(imageNode);
        imageContainerNode.append(imageWrapperNode);

        itemNode.append(imageContainerNode);
        itemNode.append(tagsNode);

        containerNode.append(itemNode);
    });
}

function subscribeForm() {
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

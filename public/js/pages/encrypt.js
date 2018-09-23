import StreamingFileReader from '/js/components/StreamingFileReader.js'

const fileInput = document.getElementById('file-to-encrypt');

fileInput.addEventListener('change', event => {
    const [ file ] = event.target.files;
    console.log(file);
    const reader = Object.create(StreamingFileReader);
    
    reader.StreamingFileReader(file);
    reader.onProgress = p => console.log(p);
    reader.onLoad = result => console.log(result);

    reader.start();
}, false);

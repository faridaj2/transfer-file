const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileInput');
const keyPin = document.getElementById('keyPin')
var conn;


dropArea.addEventListener('click', () => {
    fileInput.click()
})
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('dropped-content').innerHTML = file.name
    }
})

const generatePin = () => {
    const characters = '0123456789';
    let pin = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pin += characters.charAt(randomIndex);
    }
    return pin;
}

const peer = new Peer(generatePin(), {
    secure: false,
    debug: 2
})

peer.on("open", (id) => {
    document.getElementById('your-pin').innerHTML = id
})




const transferFile = () => {
    conn = peer.connect(keyPin.value);
    console.log('trf')
    const file = fileInput.files[0];
    if (file) {
        conn.on("open", () => {
            const buffer = file;
            conn.send({ name: file.name, type: file.type, size: file.size, data: file });
            console.log('File sent:', file.name);

        })

    } else {
        console.error('No file selected');
    }

};


peer.on("connection", (data) => {
    keyPin.value = data.peer
    if (!conn) {
        conn = peer.connect(data.peer);
    }
    data.on("data", fileData => {
        console.log('File received:', fileData);
        // Buat Blob dari data yang diterima
        const blob = new Blob([fileData.data], { type: fileData.type });

        // Membuat URL sementara untuk file yang diterima
        const url = URL.createObjectURL(blob);

        // Tampilkan link untuk mendownload file
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileData.name;
        downloadLink.textContent = `Download ${fileData.name}`;
        divData = document.getElementById('received-files')
        divData.appendChild(downloadLink);
    })

})
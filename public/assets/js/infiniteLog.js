let offset = 0; // For tracking the number of documents fetched
let lastDir = null;
const limit = 50; // Number of documents to fetch at a time
const documentArea = document.getElementById('logmessage');


// Function to fetch documents from the server
async function fetchDocuments() {
    const response = await fetch(`/documents?offset=${offset}&limit=${limit}`);
    const documents = await response.json();
    return documents;
}

//Function to add create date and format log message
function formatMessage(msg){
    let res = new Date(msg.created).toLocaleString("en-US") + " " + msg.message + '\n'; // Assuming each msg has a content field
    return res
}

// Function to load documents and append to textarea
async function loadDocuments(bottom) {
    
    if (bottom){ // hit bottom of box
        console.log("Hit bottom of box")
        if (lastDir === "up"){
            lastDir = "down"
            offset += limit
        }
        const documents = await fetchDocuments();
        if (documents.length > 0) {
            documents.forEach(doc => {
                documentArea.value += formatMessage(doc)
            });
            offset += documents.length; // Update offset for next fetch
        }
 
    } else { //hit top of box
        console.log("Hit top of box")
        if (lastDir === "down"){
            lastDir = "up"
            offset -= limit
            if (offset < 0){
                offset = 0
            }
        }
        const documents = await fetchDocuments();
        if (documents.length > 0) {
            documents.forEach(doc => {
                documentArea.value += formatMessage(doc)
            });
            offset -= documents.length; // Update offset for next fetch
            if (offset <= 0){
                offset = 0
            }
        }
    }
    console.log(offset)
}

// Event listener for scrolling
documentArea.addEventListener('scroll', () => {
    if (documentArea.scrollTop + documentArea.clientHeight >= documentArea.scrollHeight) {
        loadDocuments(true); // Load more documents when at the bottom
    }

    if (documentArea.scrollTop == 0) {
        loadDocuments(false); // Load more documents when at the top
    }
});

// Initial load
loadDocuments(true);
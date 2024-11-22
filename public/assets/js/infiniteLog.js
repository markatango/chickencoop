let offset = 0; // For tracking the number of documents fetched
const limit = 50; // Number of documents to fetch at a time
const documentArea = document.getElementById('logmessage');

// Function to fetch documents from the server
async function fetchDocuments() {
    const response = await fetch(`/documents?offset=${offset}&limit=${limit}`);
    const documents = await response.json();
    return documents;
}

// Function to load documents and append to textarea
async function loadDocuments() {
    const documents = await fetchDocuments();
    if (documents.length > 0) {
        documents.forEach(doc => {
            documentArea.value += doc.message + '\n'; // Assuming each doc has a content field
        });
        offset += documents.length; // Update offset for next fetch
    }
}

// Event listener for scrolling
documentArea.addEventListener('scroll', () => {
    if (documentArea.scrollTop + documentArea.clientHeight >= documentArea.scrollHeight) {
        loadDocuments(); // Load more documents when at the bottom
    }
});

// Initial load
loadDocuments();
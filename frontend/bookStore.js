

const apiUrl = 'http://localhost:8000/api/book';

let currentPage = 1;
let totalPages = 1;
let searchTimeout;

async function fetchBooks(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

function renderBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    booksContainer.innerHTML = '';

    if (books.length > 0) {

        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
            `;
            bookElement.addEventListener('click', () => {
                showBookDetails(book);
            });
            booksContainer.appendChild(bookElement);
        });

    } else {

        booksContainer.innerHTML = '<p>No results found.</p>';

    }
}

function updatePagination(isSearch = false) {
    const paginationContainer = document.getElementById('currentPage');

    if (isSearch) {

        for (let i = 1; i <= totalPages; i++) {
            const pageText = document.createElement('span');
            pageText.textContent = `Page ${i}`;
            if (i === currentPage) {
                pageText.classList.add('active');
            }
            pageText.addEventListener('click', () => {
                fetchBooksByTitle(document.getElementById('searchInput').value, i);
            });
            paginationContainer.appendChild(pageText);
        }
    } else {
        paginationContainer.textContent = `Page ${currentPage}`;

    }

}

async function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        const data = await fetchBooks(currentPage);
        renderBooks(data.books);
        updatePagination();
    }
}

async function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        const data = await fetchBooks(currentPage);
        renderBooks(data.books);
        updatePagination();
    }
}

async function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.trim();

    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }


    searchTimeout = setTimeout(async () => {
        if (searchInput === '') {
            hideDropdown();
            return;
        }


        try {
            const response = await fetch(`${apiUrl}/search/?query=${searchInput}`);
            const data = await response.json();
            const searchResults = data.results.slice(0, 10);

            if (searchResults.length > 0) {
                showDropdown(searchResults);
            } else {

                hideDropdown();
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            hideDropdown();
        }
    }, 100);
}

function showDropdown(searchResults) {
    console.log('show');
    const dropdownContainer = document.getElementById('dropdownContainer');
    dropdownContainer.innerHTML = '';

    searchResults.forEach(book => {
        const dropdownItem = document.createElement('div');
        dropdownItem.textContent = book.title;
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.addEventListener('click', () => {
            document.getElementById('searchInput').value = book.title;

            fetchBooksByTitle(book.title);
            hideDropdown();
        });
        dropdownContainer.appendChild(dropdownItem);
    });

    dropdownContainer.style.display = 'block';
}


async function fetchBooksByTitle(title, page = 1) {
    console.log('fetchby Title');
    try {
        const response = await fetch(`${apiUrl}/search/?query=${title}`);
        const data = await response.json();

        if (data.results.length > 0) {

            renderBooks(data.results);


            const resultsPerPage = 10;
            totalPages = Math.ceil(data.count / resultsPerPage);
            currentPage = page;
            updatePagination();
        } else {

            renderBooks([]);
            currentPage = 1;
            totalPages = 1;
            updatePagination();
        }
    } catch (error) {
        console.error('Error fetching books by title:', error);
        renderBooks([]);
        currentPage = 1;
        totalPages = 1;
        updatePagination();
    }
}


function hideDropdown() {
    console.log('hide');
    const dropdownContainer = document.getElementById('dropdownContainer');
    dropdownContainer.innerHTML = '';
    dropdownContainer.style.display = 'none';
}

async function goHome() {
    currentPage = 1;
    const data = await fetchBooks(currentPage);
    renderBooks(data.books);
    updatePagination();
    document.getElementById('searchInput').value = '';
    hideDropdown();
}

function showBookDetails(book) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('book-details');
    detailsContainer.innerHTML = `
        <p>You chose an amazing book</p>
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Author:</strong> This book is written by ${book.author}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p>Thank you!</p>
    `;
    document.body.appendChild(detailsContainer);

    function handleOutsideClick(event) {
        if (!detailsContainer.contains(event.target)) {
            detailsContainer.remove();
            document.removeEventListener('click', handleOutsideClick);
        }


        setTimeout(() => {
            detailsContainer.remove();
            document.removeEventListener('click', handleOutsideClick);
        }, 5000);


    }
}

document.getElementById('searchInput').addEventListener('input', searchBooks);

window.onload = async () => {
    const data = await fetchBooks(`${apiUrl}?page=1`);
    totalPages = data.total_pages;
    renderBooks(data.books);
    updatePagination();

    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            const searchInput = document.getElementById('searchInput').value.trim();

            if (searchInput === '') {
                hideDropdown();
                return;
            }

            const initialSearchValue = searchInput;

            await fetchBooksByTitle(initialSearchValue);
            updatePagination(true);
            if (document.getElementById('searchInput').value.trim() === initialSearchValue) {
                hideDropdown();
            }
        });
    }
};


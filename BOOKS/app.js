const htmlSelectors = {
    'loadBooks': () => document.getElementById('loadBooks'),
    'createBtn': () => document.querySelector('#create-form>button'),
    'createTitleInput': () => document.getElementById('title'),
    'createAuthorInput': () => document.getElementById('author'),
    'createIsbnInput': () => document.getElementById('isbn'),
    'booksContainer': () => document.querySelector('table>tbody'),
    'errorContainer': () => document.getElementById('notification'),
    'editForm': () => document.getElementById('edit-form'),
    'editBtn': () => document.querySelector('#edit-form>button'),
    'editTitle': () => document.getElementById('edit-title'),
    'editAuthor': () => document.getElementById('edit-author'),
    'editIsbn': () => document.getElementById('edit-isbn'),
    'deleteForm': () => document.getElementById('delete-form'),
    'deleteBtn': () => document.querySelector('#delete-form>button'),
    'deleteTitle': () => document.getElementById('delete-title'),
    'deleteAuthor': () => document.getElementById('delete-author'),
    'deleteIsbn': () => document.getElementById('delete-isbn'),

}
htmlSelectors['loadBooks']().addEventListener('click', fetchAll);
htmlSelectors['createBtn']().addEventListener('click', createBook);
htmlSelectors['editBtn']().addEventListener('click', editBook);
htmlSelectors['deleteBtn']().addEventListener('click',deleteBook);




function fetchAll() {
    fetch('https://test-project-9adc2.firebaseio.com/books/.json')
        .then(response => response.json())
        .then(render)
        .catch(handleError);

}



function handleError(err) {
    let error = htmlSelectors['errorContainer']();
    error.style.display = 'block';
    error.textContent = err.message
    setTimeout(() => {
        error.style.display = 'none';

    }, 3000)

}

function render(booksData) {
    let booksContainer = htmlSelectors['booksContainer']();
    if (booksContainer.innerHTML != '') {
        booksContainer.innerHTML = ''

    }
    Object.keys(booksData)
        .forEach(id => {
            const { title, author, isbn } = booksData[id];

            const tableRow = create('tr', '', {}, {},
                create('td', title, {}, {}),
                create('td', author, {}, {}),
                create('td', isbn, {}, {}),
                create('td', '', {}, {},
                    create('button', 'Edit', { 'data-key': id }, { click: loadEditForm }),
                    create('button', 'Delete', { 'data-key': id }, { click: loadDeleteForm })))

            booksContainer.appendChild(tableRow);



        });


}
function createBook(e) {
    e.preventDefault();
    let titleInput = htmlSelectors['createTitleInput']();
    let authorInput = htmlSelectors['createAuthorInput']();
    let isBnInput = htmlSelectors['createIsbnInput']();

    if (titleInput.value !== '' && authorInput.value !== '' && isBnInput.value !== '') {
        let obj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ title: titleInput.value, author: authorInput.value, isbn: isBnInput.value })

        };
        fetch('https://test-project-9adc2.firebaseio.com/books/.json', obj)
            .then(fetchAll)
            .catch(handleError);

        titleInput.value = '';
        authorInput.value = '';
        isBnInput.value = '';

    } else {
        let error = { messsage: '' };
        if (titleInput === '') {
            error.message += 'title input is empty';

        }
        if (authorInput === '') {
            error.message += 'author input is empty';
        }
        if (isBnInput === '') {
            error.message += 'isbn input is empty';
        }
        handleError(error);
    }
}

function loadEditForm() {
    const id = this.getAttribute('data-key');

    fetch(`https://test-project-9adc2.firebaseio.com/books/${id}.json`)
        .then(response => response.json())
        .then(({ title, author, isbn }) => {
            htmlSelectors['editTitle']().value = title;
            htmlSelectors['editAuthor']().value = author;
            htmlSelectors['editIsbn']().value = isbn;
            htmlSelectors['editForm']().style.display = 'block';
            htmlSelectors['editBtn']().setAttribute('data-key', id);
        })
        .catch(handleError)
}
function loadDeleteForm() {
    const id = this.getAttribute('data-key');

    fetch(`https://test-project-9adc2.firebaseio.com/books/${id}.json`)
        .then(response => response.json())
        .then(({ title, author, isbn }) => {
            htmlSelectors['deleteTitle']().value = title;
            htmlSelectors['deleteAuthor']().value = author;
            htmlSelectors['deleteIsbn']().value = isbn;
            htmlSelectors['deleteForm']().style.display = 'block';
            htmlSelectors['deleteBtn']().setAttribute('data-key', id);


        })
        .catch(handleError)
}

function editBook(e) {
    e.preventDefault();

    let titleInput = htmlSelectors['editTitle']();
    let authorInput = htmlSelectors['editAuthor']();
    let isBnInput = htmlSelectors['editIsbn']();

    if (titleInput.value !== '' && authorInput.value !== '' && isBnInput.value !== '') {
        let id = this.getAttribute('data-key');
        let obj = {
            method: 'PATCH',
            body: JSON.stringify({ title: titleInput.value, author: authorInput.value, isbn: isBnInput.value })
        }
        htmlSelectors['editForm']().style.display = 'none';
        fetch(`https://test-project-9adc2.firebaseio.com/books/${id}/.json`, obj)
            .then(fetchAll)
            .catch(handleError);
    } else {
        let error = { messsage: '' };
        if (titleInput === '') {
            error.message += 'title input is empty';

        }
        if (authorInput === '') {
            error.message += 'author input is empty';
        }
        if (isBnInput === '') {
            error.message += 'isbn input is empty';
        }
        handleError(error);
    }

}

function deleteBook(e) {
    e.preventDefault();
    
    let id = this.getAttribute('data-key');
    let obj = {
        method: 'DELETE'
    }
    htmlSelectors['deleteForm']().style.display='none';
    fetch(`https://test-project-9adc2.firebaseio.com/books/${id}/.json`, obj)
        .then(fetchAll)
        .catch(handleError);

}






function create(type, text, attributes, events, ...children) {
    let domElement = document.createElement(type);

    if (text !== '') {
        domElement.textContent = text;
    }
    
    Object.entries(attributes)
        .forEach(([attrKey, attrValue]) => {
            domElement.setAttribute(attrKey, attrValue)
        });

    Object.entries(events)
        .forEach(([eventName, handler]) => {
            domElement.addEventListener(eventName, handler)
        });

    children
        .forEach((child) => {
            domElement.appendChild(child)
        });
    return domElement;
}
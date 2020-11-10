let htmlSelectors = {
    'studentsDb': () => document.querySelector('table>tbody'),
    'getTable': () => document.querySelector('#results')
}

htmlSelectors['getTable']().addEventListener('mouseover', loadAll);




function loadAll() {
    fetch('https://students-test-264be.firebaseio.com/database.json')
        .then(response => response.json())
        .then(render);

}


function render(data) {
    let studentsDb = htmlSelectors['studentsDb']();

    Object.keys(data)
        .forEach(student => {
            let { id, firstName, lastName, facultyNum, grade } = data[student];

            let tableRow = create('tr', '', {}, {},
                create('td', id, {}, {}),
                create('td', firstName, {}, {}),
                create('td', lastName, {}, {}),
                create('td', facultyNum, {}, {}),
                create('td', grade, {}, {}))

            studentsDb.appendChild(tableRow);
        })
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
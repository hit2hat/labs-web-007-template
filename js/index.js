const HOST = 'http://localhost:8080';

let guides = [];

const getGuidesList = async () => {
    return fetch(`${HOST}/guide`)
        .then((response) => response.json())
        .catch(() => []);
}

const deleteGuideById = async (id) => {
    return fetch(`${HOST}/guide/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .catch(() => []);
}

const createGuide = async (name, age, phone) => {
    return fetch(`${HOST}/guide`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            name,
            age,
            phone,
        }),
    })
        .then((response) => response.json())
        .catch(() => []);
}

const renderElement = (obj) => {
    const rootElement = document.createElement('tr');  // tr

    const idElement = document.createElement('td'); // td (id)
    idElement.innerText = obj.id;

    const nameElement = document.createElement('td'); // td (name)
    nameElement.innerText = obj.name;

    const ageElement = document.createElement('td'); // td (age)
    ageElement.innerText = obj.age;

    const phoneElement = document.createElement('td'); // td (phone)
    phoneElement.innerText = obj.phone;

    const actionsElement = document.createElement('td'); // td (actions)

    const deleteButton = document.createElement('button'); // button (delete)
    deleteButton.innerText = 'Удалить';
    deleteButton.onclick = async () => {
        await deleteGuideById(obj.id);
        guides = guides.filter((x) => x.id !== obj.id);
        render();
    };

    actionsElement.append(deleteButton);

    rootElement.append(idElement);
    rootElement.append(nameElement);
    rootElement.append(ageElement);
    rootElement.append(phoneElement);
    rootElement.append(actionsElement);

    return rootElement;
};


const render = () => {
    const listElement = document.getElementById('guides-list');
    listElement.innerHTML = '';

    guides.forEach((guide) => {
        const elem = renderElement(guide);
        listElement.append(elem);
    })
}

const formElement = document.getElementById('form');
formElement.onsubmit = async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;

    const id = await createGuide(name, age, phone);
    guides.push({
        id,
        name,
        age,
        phone,
    });

    render();
};

getGuidesList()
    .then((response) => {
        guides = response;
        render();
    })
    .catch(() => {
        console.log('Error!');
    })
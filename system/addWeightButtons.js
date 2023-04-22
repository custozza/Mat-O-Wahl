const container = document.querySelector('#votingWeightContainer');
for (let i = 1; i <= 9; i++) {
    const buttonElement = document.createElement('button');
    buttonElement.setAttribute('type', 'button');
    buttonElement.setAttribute('id', `votingImportant${i}`);
    buttonElement.setAttribute('class', 'btn btn-sm btn-outline-dark btn-block');
    buttonElement.textContent = i;
    container.appendChild(buttonElement);
}
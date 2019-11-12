const membersData = data.results[0].members;


function renderTable(arrayM) {


    const tableElement = document.getElementById("table-data");

    tableContent = prepareTableContent(arrayM);

    tableElement.innerHTML = tableContent;
}

function prepareTableContent(membersArray) {

    let elementHtml = `<thead class="thead-light"><tr><th> Name </th><th> Party Affiliation</th><th> State </th><th> Seniority </th><th> Votes with party </th></tr></thead>`;


    elementHtml += `<tbody>`;

    membersArray.forEach(member => {
        elementHtml += `<tr>`;

        elementHtml += `<td><a href="${member.url}">${member.first_name} `;

        if (member.middle_name !== null) {
            elementHtml += `${member.middle_name} `;
        }
        elementHtml += `${member.last_name} </a></td>`;

        elementHtml += `<td>${member.party}</td>`;

        elementHtml += `<td>${ member.state}</td>`;

        elementHtml += `<td>${member.seniority}</td>`;

        elementHtml += `<td id="percent">${member.votes_with_party_pct}% </td>`;
        elementHtml += `</tr>`;
    });

    elementHtml += '</tbody>';

    return elementHtml;
}

function filterTable(miembrosParaFiltrar) {

    let stateSelected = document.getElementById("select-states").value;


    let checkeds = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(check => check.value);

    let arrayFiltrado = [];

    checkeds.forEach(checkedParty => {

        let aux = [];

        aux = miembrosParaFiltrar.filter(miembro => miembro.party === checkedParty && (miembro.state === stateSelected || stateSelected === "All"));

        arrayFiltrado.push.apply(arrayFiltrado, aux);

    })
    return arrayFiltrado;
}

renderTable(filterTable(membersData));

document.getElementById("checkboxes").addEventListener("change", () => {
    renderTable(filterTable(membersData));
});
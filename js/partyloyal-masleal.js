/* Calculo el 10% de los menos comprometidos */

function calcularMayorComprometido(miembros) {
    let masComprometidos = Math.round(miembros.length * 0.1);

    let arrayAuxiliarMayor = [];

    miembros.sort(function(a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
    });

    for (var i = 0; i < masComprometidos; i++) {
        arrayAuxiliarMayor.push(miembros[i]);
    }
    console.log(arrayAuxiliarMayor)
    while (
        miembros[i].votes_with_party_pct === miembros[i + 1].votes_with_party_pct
    ) {
        arrayAuxiliarMayor.push(miembros[i + 1]);
        i++;
    }
    return arrayAuxiliarMayor;
}


function dibujarTablaMayor(members) {

    document.getElementById("most-loyal").innerHTML = members.map(function(miembro) {
        var filahtml = "<tr>";
        filahtml += "<td>" + miembro.last_name + " " + miembro.first_name;
        if (miembro.middle_name != null) { filahtml += " " + miembro.middle_name }
        filahtml += "</td>";
        filahtml += "<td>" + miembro.total_votes + "</td>";
        filahtml += "<td>" + miembro.votes_with_party_pct.toFixed(2) + "</td>";
        filahtml += "</tr>";
        return filahtml;
    }).join("");

}

dibujarTablaMayor(calcularMayorComprometido(miembros));
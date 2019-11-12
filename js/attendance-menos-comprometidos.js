const miembrosArray = data.results[0].members;

/* Calculo el 10% de los menos comprometidos */

function calcularMenosComprometido(miembros) {
    let menosComprometidos = Math.round(miembros.length * 0.1);

    let arrayAuxiliar = [];

    miembros.sort(function(a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });

    for (var i = 0; i < menosComprometidos; i++) {
        arrayAuxiliar.push(miembros[i]);
    }
    while (
        miembros[i].votes_with_party_pct === miembros[i + 1].votes_with_party_pct
    ) {
        arrayAuxiliar.push(miembros[i + 1]);
        i++;
    }
    return arrayAuxiliar;
}

function dibujarTabla(members) {

    document.getElementById("attendance").innerHTML = members.map(function(miembro) {
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

dibujarTabla(calcularMenosComprometido(miembrosArray));
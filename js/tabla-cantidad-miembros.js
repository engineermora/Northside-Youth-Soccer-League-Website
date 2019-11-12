const miembros = data.results[0].members;

const estadisticas = {
    'numDemocratas': 0,
    'numRepublicanos': 0,
    'numIndependientes': 0,
    'numTotales': 0
}
const estadisticasVotos = {
    'pctVotosDemocratas': 0,
    'pctVotosRepublicanos': 0,
    'pctVotosIndependientes': 0,
    'pctVotosTotales': 0
}

function totalMiembrosByParty(arrayMiembros, letraPartido) {
    var totalMiembros = 0;
    for (let i = 0; i < arrayMiembros.length; i++) {
        if (arrayMiembros[i].party === letraPartido) {
            totalMiembros++;
        }
    }
    return totalMiembros;
}

function calcularMiembros(arrayMiembros, letraPartido) {
    let contador = [];
    for (let i = 0; i < arrayMiembros.length; i++) {
        if (arrayMiembros[i].party === letraPartido) {
            contador.push(arrayMiembros[i])
        }
    }
    return contador.length;
}

function calcularPctMiembros(arrayMiembros, letraPartido) {
    var totalMiembros = totalMiembrosByParty(arrayMiembros, letraPartido);
    var pctByParty = 0;
    var pct;
    for (let i = 0; i < arrayMiembros.length; i++) {
        if (arrayMiembros[i].party === letraPartido) {
            pctByParty = pctByParty + arrayMiembros[i].votes_with_party_pct;
        }
    }
    pct = pctByParty / totalMiembros;
    return pct;
}

function calcularPctTotales(arrayMiembros) {
    var pct = 0;
    var pctTotal;
    for (let i = 0; i < arrayMiembros.length; i++) {
        cantifg
    }
    pctTotal = pct / arrayMiembros.length;
    return pctTotal;
}

function mostrarDatos() {
    document.getElementById('independiente').innerHTML = estadisticas.numIndependientes;
    document.getElementById('ind-votes-pct').innerHTML = parseFloat(estadisticasVotos.pctVotosIndependientes).toFixed(2) + "%";
    document.getElementById('democrata').innerHTML = estadisticas.numDemocratas;
    document.getElementById('dem-votes-pct').innerHTML = parseFloat(estadisticasVotos.pctVotosDemocratas).toFixed(2) + "%";
    document.getElementById('republicano').innerHTML = estadisticas.numRepublicanos;
    document.getElementById('rep-votes-pct').innerHTML = parseFloat(estadisticasVotos.pctVotosRepublicanos).toFixed(2) + "%";
}

estadisticas.numIndependientes = calcularMiembros(miembros, 'I');
estadisticasVotos.pctVotosIndependientes = calcularPctMiembros(miembros, 'I') || 0;
estadisticas.numDemocratas = calcularMiembros(miembros, 'D');
estadisticasVotos.pctVotosDemocratas = calcularPctMiembros(miembros, 'D') || 0;
estadisticas.numRepublicanos = calcularMiembros(miembros, 'R');
estadisticasVotos.pctVotosRepublicanos = calcularPctMiembros(miembros, 'R') || 0;

mostrarDatos();
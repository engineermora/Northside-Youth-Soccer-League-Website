const congreso = new Vue({
    el: '#vue-app',
    data: {

        siteUrl: "",

        membersList: [],
        // Tambien voy a guardar en esta variable los datos (array de miembros), pero esta no se va a manipular, por ende siempre tiene el array entero.
        membersAux: [],

        // Tomo la ruta que aparece después de la barra "/" en el navegador.
        path: window.location.pathname,

        // Variables de estadísticas.         
        numberOfDemocrats: 0,
        numberOfRepublicans: 0,
        numberOfIndependents: 0,
        totalMembers: 0,
        averageVotesDemocrats: 0,
        averageVotesRepublicans: 0,
        averageVotesIndependents: 0,
        averageVotesAll: 0,
        mostAttendance: [],
        leastAttendance: [],
        mostLoyal: [],
        leastLoyal: [],
    },
    methods: {
        getUrl: function() {

            if (this.path.includes('senate')) {

                this.siteUrl = 'https://api.propublica.org/congress/v1/113/senate/members.json';

            } else if (this.path.includes('house')) {

                this.siteUrl = 'https://api.propublica.org/congress/v1/113/house/members.json';

            }
        },
        getData: function() {
            this.getUrl();

            fetch(this.siteUrl, {
                    headers: {
                        'X-API-Key': 'D2sQEk1LttT9w8Vydx7vfZZtD3Cag10zupr6TxbL'
                    }
                })
                .then((respuesta) => respuesta.json()) // Transforma los datos en JSON.
                .then((jsonData) => {

                    // Si la ruta contiene "attendance" o "loyalty" (ej: /house-attendance.html) , realizo los cálculos de estadísticas.
                    //  Hago esto en caso de que estemos en la página de todos los miembros con los filtros, que en estos,
                    // no se utilizan estos cálculos.

                    if (this.path.includes('attendance') || this.path.includes('loyalty')) {

                        congreso.numberOfDemocrats = congreso.countMembers(jsonData.results[0].members, 'D');
                        congreso.numberOfRepublicans = congreso.countMembers(jsonData.results[0].members, 'R');
                        congreso.numberOfIndependents = congreso.countMembers(jsonData.results[0].members, 'I');
                        congreso.averageVotesAll = congreso.averageVotesWithPartyAll(jsonData.results[0].members);
                        congreso.totalMembers = (congreso.numberOfDemocrats + congreso.numberOfIndependents + congreso.numberOfRepublicans);
                        congreso.averageVotesDemocrats = congreso.averageVotesWithParty(jsonData.results[0].members, 'D');
                        congreso.averageVotesRepublicans = congreso.averageVotesWithParty(jsonData.results[0].members, 'R');
                        congreso.averageVotesIndependents = congreso.averageVotesWithParty(jsonData.results[0].members, 'I');

                        if (this.path.includes('attendance')) {

                            congreso.mostAttendance = congreso.mostLeast(jsonData.results[0].members, 'most', 'attendance');
                            congreso.leastAttendance = congreso.mostLeast(jsonData.results[0].members, 'least', 'attendance');

                        } else if (this.path.includes('loyalty')) {

                            congreso.mostLoyal = congreso.mostLeast(jsonData.results[0].members, 'most', 'loyal');
                            congreso.leastLoyal = congreso.mostLeast(jsonData.results[0].members, 'least', 'loyal');

                        }
                    } else {

                        // Guardo los datos para armar la tabla
                        congreso.membersList = jsonData.results[0].members;
                        // Guardo los datos  para que los filtros siempre tomen el array completo.
                        congreso.membersAux = jsonData.results[0].members;

                    }


                })
                // Intento mostrar los datos que recibo por consola, en caso de que falle el fetch.
                .catch((error) => console.error("ERROR DE FETCH")) // En caso de haber algún error, mostrarlo por consola.
        },
        filterTable() {

            let stateSelect = document.getElementById("select-states").value;
            let checkeds = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(element => element.value);
            let items = [];

            checkeds.forEach(element => {
                aux = [];
                aux = congreso.membersAux.filter(item => item.party === element && (item.state === stateSelect || stateSelect === "All"));
                items.push.apply(items, aux);
            })

            app.membersList = items;
        },
        countMembers: (arrayM, partyChar) => {
            let counted = arrayM.filter(e => e.party === partyChar);
            return counted.length;
        },
        averageVotesWithParty: (arrayM, partyChar) => {
            let dividerLength = 0;
            let countPercent = 0;
            let average = 0;
            for (let i = 0; i < arrayM.length; i++) {
                if (arrayM[i].party === partyChar) {
                    countPercent += arrayM[i].votes_with_party_pct;
                    dividerLength++
                }
            }
            average = (countPercent / dividerLength).toFixed(2)
            return average;
        },
        averageVotesWithPartyAll: (arrayM) => {
            let dividerLength = 0;
            let countPercent = 0;
            let average = 0;
            for (let i = 0; i < arrayM.length; i++) {
                countPercent += arrayM[i].votes_with_party_pct;
                dividerLength++
            }
            average = (countPercent / dividerLength).toFixed(2)

            return average;
        },
        mostLeast: (arrayM, leastOrMost, attendanceOrLoyal) => {
            // Obtengo la cantidad de elementos que cubren ese 10%.
            const minLenght = Math.round((arrayM.length * 10) / 100) //
            let aux = [];
            if (leastOrMost === "least") {
                if (attendanceOrLoyal === "attendance") {
                    // Ordeno el array comparando los valores de missed_votes.
                    arrayM.sort((a, b) => (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0));
                    // Itero hasta que llegue al 10%.
                    for (var i = 0; aux.length < minLenght; i++) {
                        aux.push(arrayM[i]);
                    }
                    // Cuando llega al último elemento, verifica si el que sigue es igual.
                    while (aux[aux.length - 1].missed_votes_pct === arrayM[i + 1].missed_votes_pct) {
                        aux.push(arrayM[i + 1]);
                        i++;
                    }
                    return aux;
                } else if (attendanceOrLoyal === "loyal") {
                    arrayM.sort((a, b) => (a.votes_with_party_pct > b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct > a.votes_with_party_pct) ? -1 : 0));
                    for (var i = 0; aux.length < minLenght; i++) {
                        aux.push(arrayM[i]);
                    }
                    while (aux[aux.length - 1].votes_with_party_pct === arrayM[i + 1].votes_with_party_pct) {
                        aux.push(arrayM[i + 1]);
                        i++;
                    }
                    return aux;
                }
            } else if (leastOrMost === "most") {
                if (attendanceOrLoyal === "attendance") {
                    arrayM.sort((a, b) => (a.missed_votes_pct < b.missed_votes_pct) ? 1 : ((b.missed_votes_pct < a.missed_votes_pct) ? -1 : 0));
                    for (var i = 0; aux.length < minLenght; i++) {
                        aux.push(arrayM[i]);
                    }
                    while (aux[aux.length - 1].missed_votes_pct === arrayM[i + 1].missed_votes_pct) {
                        aux.push(arrayM[i + 1]);
                        i++;
                    }
                    return aux;
                } else if (attendanceOrLoyal === "loyal") {
                    arrayM.sort((a, b) => (a.votes_with_party_pct < b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct < a.votes_with_party_pct) ? -1 : 0));
                    for (var i = 0; aux.length < minLenght; i++) {
                        aux.push(arrayM[i]);
                    }
                    while (aux[aux.length - 1].votes_with_party_pct === arrayM[i + 1].votes_with_party_pct) {
                        aux.push(arrayM[i + 1]);
                        i++;
                    }
                    return aux;
                }
            }
        },
    },

    created() {
        this.getData();
    }
})
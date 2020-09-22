// DEFINIÇÕES GLOBAIS
const estados = {
    'CO': ['Centro-Oeste', {'Distrito Federal': 'DF', 'Goiás': 'GO', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS'}],
    'NE': ['Nordeste', {'Alagoas': 'AL', 'Bahia': 'BA', 'Ceará': 'CE', 'Maranhão': 'MA', 'Paraíba': 'PB', 'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio Grande do Norte': 'RN', 'Sergipe': 'SE'}],
    'N': ['Norte', {'Acre': 'AC', 'Amapá': 'AP', 'Amazonas': 'AM', 'Pará': 'PA', 'Rondônia': 'RO', 'Roraima': 'RR', 'Tocantins': 'TO'}],
    'SE': ['Sudeste', {'Espírito Santo': 'ES', 'Minas Gerais': 'MG', 'Rio de Janeiro': 'RJ', 'São Paulo': 'SP'}],
    'S': ['Sul', {'Paraná': 'PR', 'Santa Catarina': 'SC', 'Rio Grande do Sul': 'RS'}]
}

var labelsDias, labelsSemanas, geral, sudeste, nordeste, norte, sul, centro_oeste

function get_name_state(sigla) { // Pega o nome do estado pela sua sigla
    var state
    $.each(estados, (i, e) => {
        var est = Object.keys(e[1]).find(key => e[1][key] == sigla)
        if(est != undefined)
            state = est
    })
    return state
}

function get_name_region(sigla) { // Pega o nome da região pela sigla do estado
    var region
    $.each(estados, (i, e) => {
        var est = Object.keys(e[1]).find(key => e[1][key] == sigla)
        if(est != undefined)
            region = e[0]
    })
    return region
}

function povoa_tabela(json) { // povoa a tabela com todo o histórico atual
    labelsDias = json['labelsDias']
    labelsSemanas = json['labelsSemanas']
    geral = json['geral']
    // sudeste = json['Sudeste']
    // nordeste = json['Nordeste']
    // norte = json['Norte']
    // sul = json['Sul']
    // centro_oeste = json['Centro-Oeste']
    linhas = []
    $.each(Object.keys(geral), (i, sigla) => {
        estado = get_name_state(sigla)
        regiao = get_name_region(sigla)
        $.each(geral[sigla]['dias'], (j, reg) => {
            linhas.push({
                'regiao': regiao,
                'estado': estado,
                'municipio': '',
                'semana': '',
                'data': reg['_id']+'/2020',
                'casos': reg['casosAcumulado'],
                'obitos': reg['obitosAcumulado']
            })
        })
    })
    $('#table').bootstrapTable({data: linhas})
}

function mask(number) { // Máscara para colocar pontos nos números grandes
    for (var i = number.length-3; i > 0; i-=3) {
        number = number.slice(0, i) + '.' + number.slice(i)
    }
    return number
}

function togglePagination() {
    var pag = !Boolean($('#table').attr('data-pagination'))
    $('#table').attr('data-pagination', pag)
    $('#table').attr('data-page-list', `[10, ${!pag ? '25, 50, 100,' : ''} ALL]`)
    $('#table').bootstrapTable('refresh')
    $('#table').bootstrapTable('togglePagination')
}

function date2java(date) {
    return date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4)
}

function removeAcento(str) {
    if(str)
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return ''
}

function datesSorter(a, b) {
    a = a.split("/")
    b = b.split("/")

    if (new Date(a[2], a[1] - 1, a[0]) < new Date(b[2], b[1] - 1, b[0])) 
        return 1
    if (new Date(a[2], a[1] - 1, a[0]) > new Date(b[2], b[1] - 1, b[0])) 
        return -1
    return 0
}

function str2date(date, c) {
    date = date.split(c)
    date = new Date(date[0], date[1] - 1, date[2])
    if (c == '/')
        date = new Date(date[2], date[1] - 1, date[0])
    return date
}
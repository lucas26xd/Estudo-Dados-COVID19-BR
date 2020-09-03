function hist_estado() { // Pega todo histórico atual por estado
    $.ajax({
        url:'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalRegiaoUf',
        type:'GET', dataType: 'json',
        success: povoa_tabela
    })
}

function planilha_hoje() { // Pega números gerais e link da planilha HOJE
    $.ajax({
        url:'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeralApi',
        type:'GET', dataType: 'json',
        success: json => {
            $('#HOJE_LINK').attr('href', json['planilha']['arquivo']['url'])
            $('#numero-casos-recuperados').text(mask(json['confirmados']['recuperados']))
            $('#numero-casos-confirmados').text(mask(json['confirmados']['total']))
            $('#numero-obitos-confirmados').text(mask(json['obitos']['total']))
        }
    })
}

function planilha_hist() { // Pega ultima atualização e link da planilha HIST
    $.ajax({
        url:'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeral',
        type:'GET', dataType: 'json', headers: {'X-Parse-Application-Id': 'unAFkcaNDeXajurGB7LChj8SgQYS2ptm'},
        success: json => {
            $('#HIST_LINK').attr('href', json['results'][0]['arquivo']['url'])
            $('#last_update').text(json['results'][0]['dt_atualizacao'])
        }
    })
}

function get_municipios_estado(estado) { // Pega o nome de todos os municipios de acordo com o estado passado
    $.ajax({
        url:`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`,
        type:'GET', dataType: 'json',
        success: (json) => {
            $.each(json, (i, municipio) => {
                $('#municipio').append(new Option(municipio.nome, municipio.nome))
            })
            $('#municipio').selectpicker('refresh')
        }
    })
}

function hoje_municipios() { // Pega ultimos dados de cada municipio
    $.ajax({
        url:'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalMunicipio',
        type:'GET', dataType: 'json',
        success: json => {
            var municipio = json.find(obj => obj.nome == $('#municipio').val())
            var linha = {
                'regiao': $('#regiao option:selected').text(),
                'estado': $('#estado option:selected').text(),
                'municipio': municipio['nome'],
                'semana': labelsSemanas[labelsSemanas.length-1],
                'data': labelsDias[labelsDias.length-1]+'/2020',
                'casos': municipio['casosAcumulado'],
                'obitos': municipio['obitosAcumulado']
            }
            $('#table').bootstrapTable('load', [linha])
        }
    })
}

function get_brasil_io(regiao, estado, municipio, is_last, hist_15d, hist_1m, hist_3m, hist_full) { // Pega dados da API do Brasil IO ?search=&epidemiological_week=&date=&order_for_place=&state=CE&city=Cruz&city_ibge_code=&place_type=city&last_available_date=&is_last=False&is_repeated=
    var url = 'https://brasil.io/api/dataset/covid19/caso_full/data/?format=json'
    if(!hist_full) {
        if(regiao == 'Todas')
            url += `&place_type=state`
        if(estado != 'Todos') 
            url += `&state=${estado}`
        if(municipio != 'Todos') 
            url += `&city=${municipio}&place_type=city`
        if(is_last) 
            url += '&is_last=True'
    } else {
        if (hist_15d) {

        } else if (hist_1m) {
            
        } else if (hist_3m) {
            
        }
    }
    console.log(url)
}
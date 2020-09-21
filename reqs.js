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
            // $('#numero-casos-recuperados').text(mask(json['confirmados']['recuperados']))
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

function get_brasil_io(regiao, estado, municipio, is_last, hist_15d, hist_1m, hist_3m) { // Pega dados da API do Brasil IO ?search=&epidemiological_week=&date=&order_for_place=&state=CE&city=Cruz&city_ibge_code=&place_type=city&last_available_date=&is_last=False&is_repeated=
    var url = 'https://brasil.io/api/dataset/covid19/caso_full/data/?format=json'
    if(estado != 'Todos') 
        url += `&state=${estado}&place_type=city`
    if(municipio != 'Todos') 
        url += `&city=${municipio}&place_type=city`
    else if(estado == 'Todos') 
        url += `&place_type=state`

    if(is_last) {
        url += '&is_last=True'
        req_brasil_io(url, [], 0, regiao)
    } else {
        var qtd = 0
        if (hist_15d)
            qtd = 15
        else if (hist_1m)
            qtd = 30
        else if (hist_3m)
            qtd = 90
        req_brasil_io(url, [], qtd, regiao)
    }
    // console.log(url)
}

function req_brasil_io(url, data=[], qtdDias=0, regiao='Todas', datesU=[]) {
    var table = data
    var datesUnique = datesU
    $.ajax({
        url: url, type: 'GET', dataType: 'json',
        success: json => {
            $.each(json['results'], (i, casos) => {
                if((qtdDias == 0 || datesUnique.length < qtdDias) && // pega todos so registros ou apenas o limite especificado
                   (regiao == 'Todas' || regiao == get_name_region(casos['state']))) { // pega todas as regioes ou apenas a especificada
                    table.push({
                        'regiao': get_name_region(casos['state']),
                        'estado': removeAcento(get_name_state(casos['state'])),
                        'municipio': removeAcento(casos['city']),
                        'semana': casos['epidemiological_week'],
                        'data': date2java(casos['last_available_date']),
                        'casos': casos['new_confirmed'],
                        'casosAcc': casos['last_available_confirmed'],
                        'obitos': casos['new_deaths'],
                        'obitosAcc': casos['last_available_deaths']
                    })
                    if(datesUnique.indexOf(casos['last_available_date']) === -1)
                        datesUnique.push(casos['last_available_date'])
                }
            })
            if (json['next'] != null && (qtdDias == 0 || datesUnique.length < qtdDias)) {
                console.log('Chamou outra pagina')
                req_brasil_io(json['next'], table, qtdDias, regiao, datesUnique)
            } else {
                $('#table').bootstrapTable({data: table}) // caso seja a primeira vez que a tabela seja povoada
                $('#table').bootstrapTable('load', table)
            }
        }, 
        statusCode: {
            429: json => {
                alert('Limite de tentativas excedido, tente novamente em alguns segundos') //+ json['available_in'])
            }
        }
    })
}
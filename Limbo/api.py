import pandas as pd
from flask import Flask
from flask_restful import Resource, Api, request
from json import loads
from os import listdir
from csv import DictReader


bases_names = [f'./Bases/{base_name}' for base_name in listdir('./Bases') if base_name.endswith('csv')]
csv_file = DictReader(open(bases_names[5]), delimiter=';')
cols = ['dataNotificacao', 'dataInicioSintomas', 'sintomas', 'profissionalSaude', 'condicoes', 'estadoTeste', 'tipoTeste', 'resultadoTeste', 'sexo', 'estado', 'municipio', 'idade', 'evolucaoCaso', 'classificacaoFinal']
df = pd.DataFrame.from_dict(csv_file)[cols]
# df.info()

app = Flask('Dados COVID-19 Brasil')
api = Api(app)


def arguments(args):
    condicoes = args['condicoes'] if 'condicoes' in args else ''
    sintomas = args['sintomas'] if 'sintomas' in args else ''
    sexo = args['sexo'] if 'sexo' in args else ''
    municipio = args['municipio'] if 'municipio' in args else ''
    idade = args['idade'] if 'idade' in args else ''
    r = int(args['ranking']) if 'ranking' in args else ''
    return condicoes, sintomas, sexo, municipio, idade, r


class Dados(Resource):
    def get(self):
        condicoes, sintomas, sexo, municipio, idade, r = arguments(request.args)
        data = get_dados(condicoes, sintomas, sexo, municipio, idade)
        if r != '':  # Foi requisitado o ranking da idade
            data = data.sort_values('idade', ascending=False).iloc[:r]
        return loads(data.to_json(orient="records"))


def get_dados(condicoes='', sintomas='', sexo='', municipio='', idade=''):
    condition = True
    if condicoes != '':
        condition &= (df['condicoes'].str.contains(condicoes, case=False))
    if sintomas != '':
        condition &= (df['sintomas'].str.contains(sintomas, case=False))
    if sexo != '':
        condition &= (df['sexo'].str.contains(sexo, case=False))
    if municipio != '':
        condition &= (df['municipio'].str.contains(municipio))
    if idade != '':
        condition &= (df['idade'] == idade)
    try:
        return df.loc[condition]
    except KeyError:
        return df


api.add_resource(Dados, '/dados', '/')

print(df['municipio'].iloc[:10])

if __name__ == '__main__':
    app.run()

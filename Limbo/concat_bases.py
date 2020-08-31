import pandas as pd
from os import listdir
from csv import DictReader

bases_names = [f'./Bases/{base_name}' for base_name in listdir('./Bases') if base_name.endswith('csv')]
cols = ['dataNotificacao', 'dataInicioSintomas', 'sintomas', 'profissionalSaude', 'condicoes', 'estadoTeste', 'tipoTeste', 'resultadoTeste', 'sexo', 'estado', 'municipio', 'idade', 'evolucaoCaso', 'classificacaoFinal']

for i in range(0, len(bases_names), 2):
    csvs = [DictReader(open(bases_names[i]), delimiter=';'), DictReader(open(bases_names[i+1]), delimiter=';')]

    df1 = pd.DataFrame.from_dict(csvs[0])[cols]
    df2 = pd.DataFrame.from_dict(csvs[1])[cols]
    # df = pd.concat([pd.DataFrame.from_dict(csv_file)[cols] for csv_file in csvs])
    df = pd.concat([df1, df2])

    df.to_csv(f'./Bases/Concat/{bases_names[i][bases_names[i].find("-") + 1:bases_names[i].rfind(".")]}_{bases_names[i + 1][bases_names[i + 1].find("-") + 1:bases_names[i + 1].rfind(".")]}.csv', sep=';')
    print(f'Arquivo {bases_names[i][bases_names[i].find("-") + 1:bases_names[i].rfind(".")]}_{bases_names[i + 1][bases_names[i + 1].find("-") + 1:bases_names[i + 1].rfind(".")]}.csv salvo!')

# print(df.info())
from simpleaudio import WaveObject as wo
wo.from_wave_file(f'./blip.mp3').play().wait_done()

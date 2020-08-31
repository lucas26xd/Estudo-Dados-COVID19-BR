import pandas as pd
from os import listdir
from csv import DictReader

bases_names = [f'./Bases/Teste/{base_name}' for base_name in listdir('./Bases/Teste') if base_name.endswith('csv')]

csvs = [DictReader(open(base_name), delimiter=';') for base_name in bases_names]
# csv_file = DictReader(open(bases_names[0]), delimiter=';')
cols = ['dataNotificacao', 'dataInicioSintomas', 'sintomas', 'profissionalSaude', 'condicoes', 'estadoTeste', 'tipoTeste', 'resultadoTeste', 'sexo', 'estado', 'municipio', 'idade', 'evolucaoCaso', 'classificacaoFinal']

# df = pd.DataFrame.from_dict(csv_file)[cols]
df = pd.concat([pd.DataFrame.from_dict(csv_file)[cols] for csv_file in csvs])

# print(df['ÿid'].iloc[:3])
# df = pd.concat([pd.read_excel(base_name) for base_name in bases_names])

print(df.info())
# print([f'./Bases/{base_name}' for base_name in listdir('./Bases') if base_name.endswith('csv')])
df.to_csv('./Bases/ce_df.csv')

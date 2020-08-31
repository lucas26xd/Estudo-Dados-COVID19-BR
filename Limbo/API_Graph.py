import pandas as pd
import plotly
import plotly.express as px
from flask import Flask, render_template
from flask_restful import Api
from json import load, loads, dumps

geoJSON_UF_Brasil = load(open('Brasil.json'))


base = pd.read_excel('HIST_PAINEL_COVIDBR_27ago2020.xlsx')
print(base.info())


def get_graficos():
        df = base.groupby(['estado', 'semanaEpi'], as_index=False).sum()

        fig = px.choropleth_mapbox(df, geojson=geoJSON_UF_Brasil, color='casosNovos', animation_frame='semanaEpi', zoom=1.8,
                                   locations='estado', center={'lat': -14, 'lon': -52}, featureidkey='properties.UF',
                                   title=f'Casos Acumulados de COVID-19 no Brasil a cada semana', mapbox_style='white-bg')

        return dumps(loads(fig.to_json()), cls=plotly.utils.PlotlyJSONEncoder)


app = Flask('Dados COVID-19 Brasil')
api = Api(app)


@app.route('/plot')
def show_plot():
    json_graph = get_graficos()
    return render_template('plot.html', plot=json_graph)


if __name__ == '__main__':
    app.run()

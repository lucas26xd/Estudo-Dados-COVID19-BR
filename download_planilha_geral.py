from urllib.request import urlopen, Request
from json import loads
import requests


def download(url, name):
    r = requests.get(url, stream=True)
    with open(f'./{name}', 'wb') as file:
        file_len = int(r.headers.get('content-length'))
        p = 0
        for data in r.iter_content(chunk_size=1024):
            p += len(data)
            print('\r[', u'\u2588' * int(30 * p / file_len), ' ' * (30 - int(30 * p / file_len)), end='] - ')
            print(f'{p * 100 / file_len:.2f}%', end='')
            file.write(data)
        print()
    print(f'Download do arquivo {name} conluído!')


headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-GB,en;q=0.5',
    'X-Parse-Application-Id': 'unAFkcaNDeXajurGB7LChj8SgQYS2ptm',
    'Origin': 'https://covid.saude.gov.br',
    'Connection': 'keep-alive',
    'Referer': 'https://covid.saude.gov.br/',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'TE': 'Trailers'
}

req = Request('https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeral', headers=headers)

with urlopen(req) as hist:
    HIST = loads(hist.read().decode())

with urlopen('https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeralApi') as hoje:
    HOJE = loads(hoje.read().decode())

url_hoje = HOJE['planilha']['arquivo']['url']
name_hoje = HOJE['planilha']['nome']
print(name_hoje, url_hoje)
download(url_hoje, name_hoje)

url_hist = HIST['results'][0]['arquivo']['url']
name_hist = HIST['results'][0]['texto_rodape']
print(name_hist, url_hist)
download(url_hist, name_hist)

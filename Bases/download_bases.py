import requests
from urllib.request import urlopen
from bs4 import BeautifulSoup


def get_urls_and_last_updates():  # Pega a url e a ultima data de atualização das bases disponíveis no OpenDataSUS
    urls = list()
    last_ups = list()
    try:
        html = BeautifulSoup(urlopen('https://opendatasus.saude.gov.br/dataset/casos-nacionais', timeout=1).read(), 'html.parser')
        p = 0
        anchor_data = html.select('a.resource-url-analytics')
        anchor_last = html.select('a.heading')
        for url_data, last_up in zip(anchor_data, anchor_last):
            if 'pretty' not in url_data['href']:
                urls.append(url_data['href'])
                html = BeautifulSoup(urlopen(f'https://opendatasus.saude.gov.br{last_up["href"]}', timeout=1).read(), 'html.parser')
                last_ups.append(html.select('td')[0].text)
                p += 1
                print('\r[', u'\u2588' * p, ' ' * (len(anchor_data) - p), f'] - {p*100/len(anchor_data):.2f}%', end='')
        print()
    except Exception as e:
        print(e)
    finally:
        return urls, last_ups


def download(url_base):  # Realiza o download da base passada por parâmetro e salva na pasta Bases
    r = requests.get(url_base, stream=True)
    if r.status_code == requests.codes.OK:
        arq = url_base[url_base.rfind("/") + 1:]
        with open(f'./Bases/{arq}', 'wb') as file:
            file_len = int(r.headers.get('content-length'))
            p = 0
            for data in r.iter_content(chunk_size=1024):
                p += len(data)
                print('\r[', u'\u2588' * int(30 * p / file_len), ' ' * (30 - int(30 * p / file_len)), end='] - ')
                print(f'{p * 100 / file_len:.2f}%', end='')
                file.write(data)
            print()
    else:
        r.raise_for_status()


print('Pegando informações para download das bases...')
urls_bases, last_updates = get_urls_and_last_updates()

if len(urls_bases) > 0:
    print('Iniciando Downloads...')
    progress = 0
    for url in urls_bases:
        print(f'Baixando {url[url.rfind("/") + 1:]} - {last_updates[progress]} - ({progress + 1:0>2}/{len(urls_bases)})')
        download(url)
        progress += 1
else:
    print('Problema ao resgatar as URLs das bases!')

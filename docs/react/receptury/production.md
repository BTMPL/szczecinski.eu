---
title: Wersja produkcyjna i publikowanie aplikacji
---

W przypadku gdy nie korzystamy z żadnych rozwiązań server-side, nie potrzebujemy uruchomić własnego API etc. udostępnianie naszej aplikacji napisanej w React jest bardzo proste.

Pierwszym co musimy zrobić to wygenerowanie wersji produkcyjnej naszej aplikacji. Typowa aplikacja w czasie developowania zawiera dużo informacji, które nie są potrzebne w wersji produkcyjnej, kod jest nie zminimalizowany etc. przez co może ona zajmować kilka lub kilkanaście megabajtów. Aby poprawnie zbudować aplikację w wersji produkcyjnej zwykle używamy oddzielnego pliku konfiguracyjnego dla naszego bundlera.CRA zawiera taki plik konfiguracyjny i żeby zbudować wersję publiczną naszej aplikacji wystarczy wywołać komendę:

```bash
yarn run build
```

W odpowiedzi powinniśmy zobaczyć informacje związane z postępem przygotowywania wersji produkcyjnej:

```bash
yarn run v1.3.2
$ react-scripts build
Creating an optimized production build...
Compiled without warnings.

File sizes after gzip:

  36.5 KB  buildstaticjsmain.4cb50106.js
  126 B    buildstaticcssmain.11ef35f4.css

The project was built assuming it is hosted at the server root.
To override this, specify the homepage in your package.json.
For example, add this to build it for GitHub Pages:

  "homepage" : "http://myname.github.io/myapp",

The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build

Done in 45.26s.            
```

W folderze naszego projektu pojawił się także nowy folder - `/build` - który zawiera gotową wersję naszej aplikacji, którą możemy umieścić na dowolnym serwerze dostępnym w sieci. Serwer ten nie musi obsługiwać żadnych dodatkowych technologi tj. node.

Jeżeli nie korzystasz z CRA musisz samemu utworzyć odpowiedni plik konfiguracyjny. Webpack jest w stanie samemu zasugerować kilka odpowiednich zmian jeżeli uruchomisz go z odpwiednią flagą `webpack -p`.

> #### Uwaga
> Na chwilę obecną wersja webpack 4.0 nie używa flagi `-p` zamiast tego należy uruchomić webpack komendą `webpack --mode production`.

## Publikacja z użyciem surge

Jeżeli nie dysponujesz żadnym serwerem, albo chcesz na szybko udostępnić prostą aplikację możesz skorzystać np. z usługi [surge.sh](http://surge.sh/), która pozwala na bezpłatne hostowanie prostych aplikacji. W celu skorzystania z surge zainstaluj globalnie moduł `surge` z npm:

```bash
yarn global add surge
```

A następnie opublikuj dane z katalogu `/build`:

```bash
λ cd build
λ surge

    Surge - surge.sh

              email: twoj@email.com
              token: *****************
      project path: D:\\Sciezka\\Do\\Aplikacji\\build\\
              size: 4 files, 502.3 KB
            domain: losowa-nazwa.surge.sh
            upload: [====================] 100%, eta: 0.0s
  propagate on CDN: [====================] 100%
              plan: Free
              users: twoj@email.com
        IP Address: 12.34.56.78

    Success! Project is published and running at losowa-nazwa       
```

Po kilku sekundach Twoja aplikacja powinna być dostępna pod domeną, którą losowo wygenerowało Surge.

> #### Uwaga
> Pamiętaj by przed wywołaniem surge przejść do katalogu `/build`! W innym wypadku możesz omyłkowo opublikować kod swojej aplikacji, a nie jej uruchamialną wersję!
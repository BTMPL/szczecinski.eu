---
title: create-react-app
---

Jednym z najczęstszych zarzutów, z jakimi początkowo borykał się React była znacząca ilość pracy, jaką developerzy musieli poświęcić na przygotowanie środowiska pracy - dobór pakietów, konfiguracja babel, webpack etc. Odpowiedzią na to był wysyp nieoficjalnych boilerplate udostępnianych jako pakiety npm lub repozytoria git.

**create react app** to oficjalny boilerplate przygotowany przez zespół Facebook do tworzenia aplikacji React. Od typowych boilerplate odróżnia go:

* sposób instalacji - <acronym title="create-react-app">CRA</acronym> instaluje się globalnie w naszym systemie i pozwala na tworzenie nowych projektów za pomocą jednej komendy

* ukrycie konfiguracji - pliki konfiguracyjne przechowywane są w katalogu <acronym title="create-react-app">CRA</acronym>, nie katalogu aplikacji, przez co mamy pewność, że nie wprowadzimy w nich przypadkowych zmian i projekt stworzony u jednego developera zadziała bez problemów u innego developera

* mniej dependencji - w teorii nasz projekt potrzebuje tylko <acronym title="create-react-app">CRA</acronym> jako zależność, dzięki czemu aktualizując naszą globalną instalację <acronym title="create-react-app">CRA</acronym> możemy też zaktualizować nasz projekt

Ukrycie konfiguracji pozwala nam na zapobieganie przypadkowym zmianom w plikach konfiguracyjnych, ale jednocześnie uniemożliwia celowe zmiany. Jeżeli musimy dodać jakąś brakującą funkcjonalność - do dyspozycji pozostaję nam mechanizm ejectowania (**npm run eject**) który "wypakuje" nam wszystkie pliki do katalogu naszego projektu, jednak tracimy możliwość aktualizowania projektu wraz z <acronym title="create-react-app">CRA</acronym>.

## instalacja

Aby rozpocząć, zainstalujmy <acronym title="create-react-app">CRA</acronym> globalnie wywołując komendę:  

`npm install create-react-app --global`

Kiedy proces zakończy się, powinniśmy mieć możliwość uruchomienia nowej komendy - `create-react-app`. Jeżeli po wywołaniu w/w komendy otrzymasz komunikat informujący o braku programu, uruchom nowe okno powłoki.

Możemy teraz utworzyć nasz nowy projekt za pomocą komendy:  

`create-react-app nazwa-katalogu`  

> #### Uwaga
> Należy pamiętać, że nazwa katalogu nie może pokrywać się z nazwą instalowanych w nim pakietów npm, dlatego nie używajmy nazw typu "react" etc.

```bash
λ npm install create-react-app --global
+ create-react-app@1.4.3
```

<small>Instalacja <acronym title="create-react-app">CRA</acronym> jako pakiet globalny</small>

```bash
λ create-react-app react-tweetorial

Creating a new React app in D:\Praca\Projekty\react-tweetorial.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts...            
// ...
Success! Created react-tweetorial at D:\Praca\Projekty\react-tweetorial          
Inside that directory, you can run several commands:                             

  yarn start                                                                     
    Starts the development server.                                               

  yarn build                                                                     
    Bundles the app into static files for production.                            

  yarn test                                                                      
    Starts the test runner.                                                      

  yarn eject                                                                     
    Removes this tool and copies build dependencies, configuration files         
    and scripts into the app directory. If you do this, you can’t go back!       

We suggest that you begin by typing:                                             

  cd react-tweetorial                                                            
  yarn start                                                                     

Happy hacking!                                                                                 
```

<small>Przygotowanie nowego projektu</small>

## uruchomienie

Po utworzeniu nowego projektu możemy od razu uruchomić go przechodząc do katalogu projektu i wywołując komendę `npm start`

W terminalu pojawi się informacja o uruchomionym serwerze a strona projektu otworzy się automatycznie w domyślnej przeglądarce systemowej. Jeżeli tak się nie stało, ręcznie otwórzmy domyślny adres [http://localhost:3000](http://localhost:3000)

```bash
λ cd react-tweetorial
λ npm start
Compiled successfully!

You can now view react-tweetorial in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.1.27:3000/

Note that the development build is not optimized.
To create a production build, use yarn build.              
```

<small>Przykładowy plik konfiguracyjny Webpack, zapewniający transpilację kodu JS oraz LESS.</small>

## struktura projektu

W katalogu projektu utworzone zostało kilka plików i folderów, są to:

* node_modules - wszystkie używane przez projekt moduły
* package.json - plik zawierające podstawowe informacje o naszym projekcie jak jego nazwa, lista pakietów etc.
* yarn.lock (lub package-lock.json) - pliki określające dokładne wersje pobranych pakietów, dzięki czemu ponowna instalacja nie pobierze "przypadkiem" nowszych
* public - katalog zawierający "statyczne" zasoby projektu (jak ikona, manifest i plik index.html)
* src - katalog ze źródłem naszej aplikacji

```bash
λ ls -la
total 729
-rw-r--r-- 1 btm 197610    285 Nov  8 22:26 .gitignore
-rw-r--r-- 1 btm 197610 108987 Nov  8 22:26 README.md
drwxr-xr-x 1 btm 197610      0 Nov  8 22:30 node_modules
-rw-r--r-- 1 btm 197610    353 Nov  8 22:26 package.json
drwxr-xr-x 1 btm 197610      0 Nov  8 22:26 public
drwxr-xr-x 1 btm 197610      0 Nov  8 22:26 src
-rw-r--r-- 1 btm 197610 234792 Nov  8 22:26 yarn.lock
```

<small>Przykładowe podsumowanie znalezionych błędów</small>
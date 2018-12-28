---
title: ReactDOM
---

Aplikacje napisane w React znacząco różnią się od aplikacji pisanych w innych technologiach, szczególnie w przypadku aplikacji napisanych w czystym JS - główna różnica to sposób w jaki integrują się one z DOM. O ile React umożliwia pracę z "zastanym" kodem HTML, o tyle w większości przypadków cały kod HTML generowany będzie przez naszą aplikację, więc odwiedzana przez użytkowników strona będzie zawierać tylko kilka znaczników HTML. Oczywiście nie jest to jedyne rozwiązanie - jeżeli zależy nam na SEO, czy też chcemy zoptymalizować czas, jaki potrzebny jest do wygenerowania naszej aplikacji możemy użyć technologii zwanej "renderowanie na serwerze" (ang. server side rendering). Na początek jednak skupimy się na "domyślnym" rozwiązaniu.

Jeżeli podejrzymy kod strony, na której osadzono przykładową stronę React powinniśmy zobaczyć tylko prostą strukturę HTML oraz odwołania do CSS i JS.

```jsx
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Webpack App</title>
  </head>
  <body>
    <div id="react-app"></div>
    <script type="text/javascript" src="/bundle.js"></script>
  </body>
</html>
```

Przykładowy kod HTML aplikacji React. Cała nasza aplikacja żyje w pliku bundle.js

Przystąpmy do tworzenia pierwszej aplikacji - typowe "hello world". Na początek stworzymy ją w jednym pliku HTML.

Utwórzmy plik **index.html**, w którym zawrzemy kod HTML powyżej, wzbogacony o naszą aplikację:

Linia 9-10 - do projektu dołączone zostały dwie biblioteki JS w formacie UMD (ang. Universal Module Definition) zawierające odpowiednio kod React oraz kod renderera do formatu DOM.

Linia 15 - wywołanie metody render obiektu ReactDOM (dodanego przez plik JS jako `window.ReactDOM`) powodujące wyświetlenie naszej aplikacji

```jsx
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Webpack App</title>
  </head>
  <body>
    <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    
    <div id="react-app"></div>
    
    <script>
      ReactDOM.render('Witaj świecie!', document.getElementById('react-app'));
    </script>  
  </body>
</html>     
```

Metoda `ReactDOM.render` jest jedną z niewielu metod obiektu ReactDOM, które musimy poznać. Domyślnie przyjmuje ona dwa parametry: kod JSX (alternatywnie: string, false lub undefined), który chcemy wyświetlić, oraz HTMLNode, do którego chcemy wyrenderować naszą aplikację. W naszym wypadku zamiast kodu JSX używamy zwykłego łańcucha tekstowego.
---
title: Narzędzia
---

## babel

[Babel](http://babeljs.io/) to tak zwany transpilator (lub kompilator), czyli narzędzie pozwalające na przekształcanie 
kodu źródłowego napisanego w jednym języku na inny. Dzięki odpowiednim "presetom" oraz "pluginom" możemy już dziś pisać aplikacje wykorzystując standard ECMAScript 2017 i transpilować go do wersji ECMAScript 5, którą obsługuje nawet Internet Explorer 8. To również dzięki Babel jesteśmy w stanie używać składni JSX.

Należy pamiętać, iż o ile babel pozwala nam na dodanie funkcjonalności, która nie jest jeszcze oficjalnym standardem ECMAScript, o tyle musimy liczyć się z tym, że używana w tym wypadku przez nas funkcjonalność (lub jej składnia) może ulec zmianie lub zostać ostatecznie odrzucona.

```jsx
// .babelrc
{
  presets: ["env", "react"],
  plugins: ["babel-plugin-transform-class-properties"]
}
```

<small>Przykładowy plik konfiguracyjny Babel dodający wsparcie dla starszych przeglądarek, składni JSX oraz wsparcie dla class fields.</small>

## webpack

[Webpack](https://webpack.js.org/) pełni wiele funkcji, ale jego podstawową jest przetwarzanie wszelkich zasobów naszej aplikacji, takich jak plik JS, grafiki, arkusze CSS w celu przygotowania tzw. "bundli" czyli pakietów, które mogą odczytywać przeglądarki. Moduły npm w dużej większości składają się z dziesiątek plików, setek zależności, różnych wersji etc. - przeglądarki nie są jeszcze gotowe na obsłużenie tak dostarczanych aplikacji. Dzięki odpowiedniej konfiguracji Webpack jest w stanie zebrać cały kod naszej aplikacji i zapisać go do jednego (lub więcej) plików wynikowych, dzięki czemu możemy bez problemu dostarczyć go przeglądarce (a przy okazji, używając Babel zmienić na kod, który będzie ona w stanie rozpoznać).

Zastępuje on rozwiązania takie jak gulp, grunt czy browserify - jest w stanie przetworzyć na bieżąco nasz kod LESS/SASS do CSS, skompresować pliki graficzne i skopiować je do odpowiedniego katalogu tak, by były dostępne dla aplikacji niezależnie od tego gdzie ją uruchamiamy. Webpack monitoruje nasze zmiany w czasie rzeczywistym dzięki czemu po zapisaniu kodu nasza strona natychmiast aktualizuje się bez konieczności odświeżania przeglądarki.

Webpack uruchamiany jest w środowisku developerskim, lub w celu stworzenia produkcyjnej wersji aplikacji, dlatego też musi on mieć dostęp do wszystkich materiałów, które chcemy na stałe zapisać w publicznych plikach aplikacji. Tak wygenerowane pliki następnie umieszczamy na dowolnym serwerze HTTP w celu udostępnienia w Internecie.

```jsx
// webpack.config.js
module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.join(__dirname, "..", "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js?/,
        use: ["babel-loader"]
      },
      {
        test: /\.less/,
        use: ["style-loader", "css-loader", "less-loader"]
      }
    ]
  },
  resolve: {
    modules: ["node_modules"]
  }
}              
```

<small>Przykładowy plik konfiguracyjny Webpack, zapewniający transpilację kodu JS oraz LESS.</small>

## eslint

[ESLint](https://eslint.org/) pozwala na narzucenie standardów dotyczących tworzonego kodu a następnie skanowanie naszej aplikacji w celu wykrycia fragmentów nie spełniających tych założeń. Pozwala on zarówno na wychwycenie błędów (t.j. użycie nie zadeklarowanych zmiennych), dbanie o spójny kod (średniki lub ich brak, pojedyncze lub podwójne cudzysłowie ... spacje czy tabulatory?) ale także na wychwytywanie błędów w użytkowaniu konkretnych bibliotek (np. React!).

```bash
  /projects/react/src/index.js
  34:44  error  'match' is missing in props validation          react/prop-types
  34:50  error  'match.params' is missing in props validation   react/prop-types
  47:7   error  Do not use setState in componentDidUpdate       react/no-did-update-set-state
```

<small>Przykładowe podsumowanie znalezionych błędów</small>

## React Developer Tools

Oficjalny dodatek do narzędzi przeglądarki, wspomagający pracę z Reactem - podobnie jak domyślne narzędzia pozwalają na pracę z HTML, tak React Developer Tools pokazuje (i pozwala nam modyfikować) w przeglądarce strukturę aplikacji Reactowej.

* [Pobierz dla Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
* [Pobierz dla Firefox](https://addons.mozilla.org/pl/firefox/addon/react-devtools/)
* [Pobierz wersję Standalone](https://www.npmjs.com/package/react-devtools) 
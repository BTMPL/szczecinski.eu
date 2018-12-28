---
title: CSS
---

Jak na razie nasza aplikacja skupia się na HTML, interakcji z użytkownikiem etc. - nie zapominajmy jednak o tym, że powinna ona też odpowiednio wyglądać. W React przyjdzie nam pracować z CSS na kilka sposobów - podstawowym jest praca ze stylami inline i plikami CSS (lub LESS, SCSS etc.)

## Style inline

Podstawowe rozwiązanie opiera się na przekazaniu do elementów stylów jako atrybut HTML `style`. Jako jego wartość przekazujemy zawsze obiekt, którego klucze przyjmują notację `camelCase`, dokładnie taką, jak znamy z JavaScriptowego `element.style`.

Dodajmy więc nieco CSS do naszej aplikacji. Zwróć uwagę na stosowanie odpowiedniej składni. W większości przypadków możesz pominąć jednostki przy wartościach numerycznych - w takim przypadku React użyje `px`.

Rozwiązanie to działa, ale nie jest najlepsze - nasze style dodawane są do generowanych elementów HTML - nie ma możliwości ich nadpisania, nie możemy stosować pseudoselektorów (np. `:hover`) i powtarzają się one w kodzie wieloktrotnie.

## Klasy CSS

W React możemy także korzystać z zewnętrznych (lub osadzonych w dokumencie) arkuszy stylów CSS. W tym celu należy dodać do elementu HTML klasę CSS za pomocą atrybuty `class`.

> #### Uwaga
> Jeżeli używasz React w wersji <16 zamiast `class` musisz użyć `className` - w innym wypadku przeglądarka zgłosi błąd!

Istnieją dwa główne sposoby dołączania samych arkuszy CSS do projektu - można zapisać je w pliku i samemu dodać do naszego pliku HTML znacznik `<link>`.

Można także użyć loaderów webpack - css-loader + style-loader które pozwolą nam zaimportować plik CSS do naszej aplikacji. Jeżeli używasz create-react-app masz dostęp do tej funkcjonalności.

Przykładowa zawartość pliku `style.css`:

```css
.tweet {
  font-family: Arial;
  font-size: 12px;
  color: #222;
  padding: 10;
  background: #f7f7f7;
  margin: 0 0 10px 0;
}

.tweet p {
  margin: 5px 0 0 0;
}   
```

## css-modules

Popularnym problemem, z którym często spotykamy się przy projektowaniu HTML i CSS jest kolizja nazw klas - kilku programistów może wybrać tę samą nazwę klasy dla różnych elementów i po dodaniu swoich arkuszy stylów do projektu ich właściwości zaczną ze sobą oddziałowywać - łączyć się lub nadpisywać. W celu uniknięcia tego typu sytuacji stosuje się różne techniki takie jak tworzenie przestrzeni nazw albo metodologie np. BEM.

W świecie JS problem ten rozwiązano nieco inaczej - konieczność dbania o to, by klasy były unikalne przesunięta została z programisty na bundler. Przy użyciu `css-loader` z włączoną opcją `css-modules`, bundler zmieni nasze nazwy klas na pseudo-losowe, zapewniając że szansa nadpisywania się klas kilku niezależnych elementów jest znikoma.

> #### Uwaga
> Opisany tu mechanizm nie jest niestety aktywny w CRA - żeby z niego skorzystać konieczne było by ejectowanie się z CRA i zmiana konfiguracji webpack.

W celu skorzystania z css-modules musimy zmodyfikować nieco proces, w który importujemy nasz plik CSS. Na skutek tej zmiany otrzymamy obiekt, który zawierać będzie zdefiniowane przez nas klasy jako klucze, zaś ich wartość zawierać będzie pseudo-losową nazwę klasy, wygenerowaną dla konkretnego przypadku użycia. Zakładając, że w naszym projekcie istnieje plik `style.css` o zawartości:

```css
.button {
  color: white;
  background: blue;
  padding: 10px;
}
```

Możemy użyć css-loader i css-modules w następując sposób:

```jsx
import React from "react";
import ReactDOM from "react-dom";

import Styles from "./style.css";
console.log(Styles);
/**
 * {
 *   button: 'RMStbBE9w'
 * }
 */

ReactDOM.render(
  <button className={Styles.button}>Kliknij mnie!</button>, 
  document.getElementById('root')
);
```

Podobnie jak w poprzednich przykładach, webpack zaimportuje nasz plik CSS lecz przed umieszczeniem go w dokumencie przetworzy znajdujące się w nim selektory CSS zastępując klasy wg. podanego w konfiguracji wzorca.
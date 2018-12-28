---
title: CSS w JS
---

Innym, równie popularnym sposobem na osadzanie CSS w JS jest takzwane "css-in-js", czyli stosowanie CSS bezpośrednio w definicji komponentów. Kilka wartych uwagi implementacji tego rozwiązania to:

*   [styled-components](https://www.styled-components.com/)
*   [glamorous](https://github.com/paypal/glamorous)
*   [emotion](https://github.com/emotion-js/emotion)

Mechanizm CSS-in-JS pozwala na łatwiejsze dystrybuowanie warstwy CSS z naszymi komponentami, pozwala na łatwe nadpisywanie i rozszerzanie oraz na traktowanie CSS tak samo jak zwykłe komponenty React.

Rozwiązania te są do siebie bardzo podobne - różnią się jednak niektórymi decyzjami architektonicznymi, więc jeżeli zdecydujesz się na to rozwiązanie sprawdź wpierw, które będzie najlepsze dla Ciebie! Poniższe przykłady dotyczą biblioteki styled-components.

Rozwiązania tego typu skupiają się na definiowaniu elementów z danymi stylami, nie zaś na dodawaniu CSS do istniejących już komponentów. Pierwszym krokiem jest zaimportowanie biblioteki, następnie możemy już konstruować nasze komponenty - najczęściej używając składni taged template strings.

Rozwiązanie takie działa dwu etapowo:

*   na podstawie przekazanego CSS tworzy nową klasę z "pseudo losową" nazwą taki selektor dodaje do elementu
*   tworzy nowy element na podstawie przekazanego (w tym wypadku element HTML `<button>`) i przekazuje mu wcześniej wygenerowaną klasę jako prop `className`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Button = styled('button')`
  background: blue;
  color: white;
  padding: 10px;
  border: 0;
  cursor: pointer;
`;

ReactDOM.render(
  <Button>Kliknij mnie!</Button>, 
  document.getElementById('root')
);
```

Rozwiązanie takie umożliwia zatem kilka innych ciekawych zastosować takich jak rozszerzanie elementów na zasadzie dziedziczenia oraz parametryzowanie.

Dodatkowo, przy wykorzystaniu mechanizmu `<ThemeProvider>` możemy przygotować zestaw zmiennych zawierających kolory, rozmiary, marginesy etc. i następnie dynamicznie podmieniać je w czasie pracy aplikacji.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";              
const Button = styled('button')`
  background: blue;
  color: white;
  padding: 10px;
  border: 0;
  cursor: pointer;
`;

// rozszerzmy definicję komponentu Button
const RedButton = styled(Button)`
  background: red;
`

const ColorButton = styled(Button)`
  background: ${props => props.background || 'yellow'}
`

ReactDOM.render(
  <div>
    <Button>Kliknij mnie!</Button>
    <RedButton>Kliknij mnie!</RedButton>
    <ColorButton>Kliknij mnie!</ColorButton>
    <ColorButton background="pink">Kliknij mnie!</ColorButton>
  </div>, 
  document.getElementById('root')
);
```

styled-components pozwala także na stosowanie pseudo-selektorów (np. `:hover`), samo tworzenie klas CSS i ręczne dopisywanie ich do elementów (przez eksport nazwany `css`) czy wstrzykiwanie globalnego CSS, nie przypisanego do komponentu (np. dla definicji `@font-face`czy `@keyframes` przy użyciu `injectGlobal`).
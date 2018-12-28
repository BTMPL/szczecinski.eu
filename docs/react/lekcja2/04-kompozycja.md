---
title: Kompozycja
---

Jedną z mantr React jest "kompozycja ponad dziedziczenie". Oznacza to, że nasze komponenty nie powinny rozszerzać funkcjonalności już istniejących komponentów, a tworzyć nowe w oparciu o już istniejące. W praktyce sprowadza się to do wyćwiczenia u siebie umiejętności dostrzegania elementów UI, które będziemy mogli wykorzystać w wielu miejscach naszej aplikacji.

Nie musimy od razu wiedzieć w jaki sposób będą one wykorzystywane - tutaj przyjdą nam z pomocą bardziej zaawansowane tematy jak komponenty wyższego rzędu (ang. high order components) czy wzorzec "render as callback" / "function as child".

Wydzielmy zatem z naszego komponentu Tweet obiekty, które na pewno przydadzą nam się gdzie indziej: komponent wskazujący czas oraz komponent wskazujący autora Tweetu.

```jsx
import React from "react";
import ReactDOM from "react-dom";

const TweetTime = () => <time>11 Listopada</time>;
const TweetUser = () => <span><b>Bartosz Szczeciński</b> @btmpl</span>;

class Tweet extends React.Component {

  render() {
    const date = (new Date()).toString();
    return (
      <div>
        <TweetUser /> -
        <TweetTime />
        <p>
          Witaj świecie!
        </p>
      </div>
    )
  }
}

ReactDOM.render(<Tweet />, document.getElementById('root'));    
```

W ten sposób określamy także i ograniczamy API naszego komponentu - teraz za każdym razem, kiedy jako konsumenci biblioteki chcemy wyrenderować Tweet używamy jednego prostego komponentu, który wewnętrznie używa mniejszych komponentów, które jego twórca może wyeksportować z biblioteki i umożliwić nam na użycie w innych miejscach aplikacji.
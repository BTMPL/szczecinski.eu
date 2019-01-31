---
title: React.lazy
---

Domyślnie wszystkie nasze komponenty będą znajdowały się w pliku `.js` wygenerowanym przez nasz bundler czasie tworzenia aplikacji. Rozwiązanie takie przyczynia się do wzrostu wielkości pliku i pogorszenia "user experience" naszych odbiorców - muszą pobierać dane, których nie potrzebują jeszcze teraz lub w ogóle.

Rozwiązaniem problemu jest tzw. "lazy loading", w którym nowe komponent (i inne dane) przesyłane są do przeglądarki dopiero w momencie, w którym są potrzebne. React udostępnia proste API pozwalająca na implementację takiego rozwiązania i oparte o rozszerzenie mechanizmu `import` powodujące, że zwraca on Promise.

API `React.lazy` przyjmuje jeden parametr - funkcję, która wywołana zwróci import komponentu:

```jsx
const BigComponent = React.lazy(() => import("./BigComponent.js"));

const App = () => {
  const [showData, toggleShow] = React.useState();

  // O React.Suspense dowiesz się za chwilkę :)
  return (
    <React.Suspense fallback={<div>Wczytuje dane ...</div>}>
      {!showData && <button onClick={() => toggleShow()}>Pokaż dane</button>}
      {showData && <BigComponent />}
    </React.Suspense>
  );
};
```

Tak przygotowana aplikacja, w swoim początkowym pliku - `bundle.js` będzie zawierać cały kod aplikacji, React etc. ale nie będzie posiadała niczego, co znajduje się w pliku `BigComponent.js`. Zawartość tego pliku zostanie zapisana w oddzielnym "artefakcie" (np. `1.chunk.js`). W momencie, w którym użytkownik otworzy stronę, pobierze tylko główny plik aplikacji, zaś drugi zostanie pobrany i wykonany dopiero w momencie, w którym kliknie "Pokaż dane".

## React.Supsense

Aby mechanizm opisany w sekcji `React.lazy` działał poprawnie, React musi wiedzieć w którym miejscu "zawiesić" renderowanie komponentu - w innym wypadku nie mógłby wyrenderować UI w w ogóle do czasu pobrania i wykonania pliku. Takie "zamrożenie" ekranu nie jest tym, czego oczekuje użytkownik.

Suspense oczekuje także parametru `fallback`, którym powinien być React.Element jaki prezentowany będzie w miejscu jego dzieci do czasu aż dane nie zostaną pobrane.

Mechanizm Suspense, jaki dostępny jest w React na ten moment (<= 16.8.0) pozwala tylko na używanie `React.lazy` ale w przyszłości pozwoli on również na inne mechanizmy, jak asynchroniczne pobieranie danych.

```jsx
const BigComponent = React.lazy(() => {
  // Zasymulujmy oczekiwanie 5 sekund
  return new Promise(res => {
    setTimeout(() => {
      res({
        default: () => <div>done</div>
      });
    }, 5000);
  });
});

function App() {
  const [name, setName] = React.useState("");
  return (
    <div>
      <p>
        Możesz wpisywać tutaj dowolny tekst, UI nie jest blokowane na czas
        "pobierania" komponentu:
      </p>
      <input value={name} onChange={e => setName(e.target.value)} />

      <p>Pobieram zewnętrzny komponent:</p>
      <React.Suspense fallback={<div>Wczytywanie ...</div>}>
        <BigComponent />
      </React.Suspense>
    </div>
  );
}
```

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/mz79mkxpky" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

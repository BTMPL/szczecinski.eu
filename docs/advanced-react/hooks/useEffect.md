---
title: useEffect
---

Drugą ważną przewagą komponentów klasowych były metody cyklu życia. Hookie wdrażają je w postaci mechanizmu `useEffect`, przy pomocy którego wdrażamy logikę metod `componentDidMount`, `componentDidUpdate` i `componentWillUnmount`.

## Wywołanie w momencie re-renderowania się komponentu

> Zastępuje `componentDidUpdate`

Domyślnie, `useEffect` działa dokładnie tak samo jak `componentDidUpdate` oraz `componentDidMount` i wywoływany jest w tym samym momencie (po wyrenderowaniu się komponentu). Hook musimy wywołać z przynajmniej jednym parametrem - funkcją - która ma być przez niego wywoływana.

```jsx
const TrackScroll = ({ title }) => {
  const [scrollTop, setScrollPosition] = useState(window.scrollY);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      setScrollPosition(window.scrollY);
    });
  });

  return <div>Scroll position: {scrollTop}</div>;
};

// użycie:

<TrackScroll />;
```

W ten sposób utworzyliśmy prosty komponent, który przy użyciu `useState` i `useEffect` śledzi pozycję strony. Przy każdym renderze komponentu do obiektu `document` dodawany jest listener, który aktualizuje stan.

Szybko dopatrzymy się problemu z takim podejściem - komponent taki będzie re-rednerował się i dodawał kolejny listener za każdym razem. Musimy albo upewnić się, że efekt ten jest wywoływany tylko przy montowaniu się komponentu, albo pamiętać o usunięciu zdarzenia. `useEffect` pozwala na oba mechanizmy. Pamiętajmy, że komponenty oparte o funkcję "odmontowują się" za każdym razem, kiedy muszą się re-renderować.

## Wywołanie dodatkowej operacji w momencie odmontowania komponentu

> Zastępuje `componentWillUnmount`

Aby zasymulować działanie `componentWillUnmount` - i usunąć wcześniej dodany efekt musimy wprowadzić dwie zmiany:

```jsx
const TrackScroll = () => {
  const [scrollTop, setScrollPosition] = useState(window.scrollY);
  useEffect(() => {
    const updateScroll = () => {
      setScrollPosition(window.scrollY);
    };
    document.addEventListener("scroll", updateScroll);

    return () => {
      document.removeEventListener("scroll", updateScroll);
    };
  });

  return <div>Scroll position: {scrollTop}</div>;
};
```

Po pierwsze zapisujemy naszą funkcję uaktualniającą stan jako nazwa funkcja tak, by przechwycić jej referencję przez domknięcie. Po drugie, zwracamy z wewnątrz hooka funkcję, która zostanie wywołana w momencie odmontowania się komponentu.

Teraz logika naszego komponentu prezentuje się następująco:

1. Montując komponent, utwórz stan oparty o aktualną pozycję scrolla
2. Wyświetl komunikat o pozycji ekranu
3. Dodaj nasłuchiwanie na przesunięcie strony
4. W momencie przesunięcia strony, zaktualizuj stan komponentu z nową pozycją scrolla i usuń nasłuchiwanie dodane w pkt. 3

W tym momencie komponent się re-renderuje i powtarza całość, z pominięciem kroku 1 (ponieważ inicjowanie stanu odbywa się tylko za pierwszym razem).

## Kontrolowanie momentu wywołania efektu

Rozwiązanie jakie osiągnęliśmy jest lepsze, ale wciąż nie idealne - za każdym razem kiedy przewijamy stronę na nowo dodają się i usuwają nasłuchy na zdarzenia. Dzieję się tak zarówno w momencie, kiedy przesuwamy ekran, jak i w momencie kiedy re-renderuje się rodzic naszego komponentu.

Zamiast tego woleli byśmy, by miało to miejsce tylko za pierwszym razem kiedy renderujemy dany komponent i kiedy przestajemy go renderować. `useEffect` pozwala na definiowanie tego mechanizmu za pomocą drugiego argumentu - tablicy wartości, których zmianę chcemy obserwować.

### Ponowne wywołanie tylko w momencie zmiany wartości

Mechanizm ten działa podobnie jak `PureComponent` czy `shouldComponentUpdate` oparte o proste sprawdzenie zmiany wartości:

```jsx
const TrackScroll = () => {
  const [scrollTop, setScrollPosition] = useState(window.scrollY);
  useEffect(
    () => {
      const updateScroll = () => {
        setScrollPosition(window.scrollY);
      };
      document.addEventListener("scroll", updateScroll);

      return () => {
        document.removeEventListener("scroll", updateScroll);
      };
    },
    [scrollTop]
  );

  return <div>Scroll position: {scrollTop}</div>;
};
```

Po takiej zmianie, efekt uruchomi się tylko w momencie, kiedy `scrollTop` ulegnie zmianie. Jeżeli komponent przrenderuje się, ponieważ przerenderował się jego rodzic, efekt nie zostanie wywołany.

> #### Uwaga
>
> Mechanizm ten sprawdza WARTOŚCI elementów tablicy, a nie referencje samej tablicy.

### Wywołanie tylko w momencie zamontowania komponentu

> Zastępuje `componentDidMount`

Skoro mechanizm `useEffect` do sprawdzenia, czy musi wywołać się ponownie używa WARTOŚCI tablicy, przekazanej jako drugi argument, a nie jej referencji, możemy w łatwy sposób wskazać, by uruchamiał się on tylko raz - w tym celu przekazujemy tablicę, której wartości nigdy się nie zmienią, np. pustą tablicę.

```jsx
const TrackScroll = () => {
  const [scrollTop, setScrollPosition] = useState(window.scrollY);
  useEffect(() => {
    const updateScroll = () => {
      setScrollPosition(window.scrollY);
    };
    document.addEventListener("scroll", updateScroll);

    return () => {
      document.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return <div>Scroll position: {scrollTop}</div>;
};
```

### Kompletny przykład

<iframe src="https://codesandbox.io/embed/xlryxz5ojz" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

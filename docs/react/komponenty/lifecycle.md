---
title: Cykl życia komponentu
---

Kolejnym ważnym tematem odróżniającym komponenty stanowe i bezstanowe jest tzw. cykl życia (ang. life cycle) komponentu. Komponenty bezstanowe tworzone są i niszczone za każdym razem, kiedy ich rodzic jest ponownie renderowany. Gdyby to samo działo się z komponentami stanowymi ich stan był by resetowany. React niszczy i tworzy ponownie komponenty stanowe tylko gdy przestaniemy je renderować w rodzicu po czym wyrenderujemy ponownie (lub zmienimy im props `key`).

Z uwagi na to, że komponenty takie nie są niszczone przydatny jest jakiś sposób pozwalający im na współpracę z otoczeniem np. w celu dostosowania się do zachodzących w aplikacji zmian. W tym celu dostajemy do dyspozycji kilka metod cyklu życia:

## constructor(props)

Metoda ta wywoływana jest w momencie kiedy komponent pierwszy raz zostaje dodany do JSX i jako parametr otrzymuje mapę przekazanych do niego propsów. Jeżeli zadeklarujemy własny konstruktor, pierwszym co musimy zrobić jest wywołanie metody `super` i przekazanie do niej otrzymanych propsów.

Jeżeli początkowy stan komponentu powinien być oparty o wartości przekazane w props możemy zadeklarować to w konstruktorze:

```jsx
constructor(props) {
  super(props);

  this.state = {
    text: props.text
  };
}
```

Jest to także jedyne miejsce gdzie powinniśmy pisać wprost do `this.state` a nie używać `this.setState()`.

**tak**

*   ustaw początkowy stan
*   zainicjuj zmienne klasy

**nie**

*   nie wywołuj akcji asynchronicznych

* * *

## static getDerivedStateFromProps(nextProps, state)

Metoda wywoływana bezpośrednio przed każdym wywołaniem `render`. Umożliwia ona synchronizację stanu (jego wyliczenie) w oparciu o props, jakie otrzymuje komponent. Funkcja ta powinna zwrócić obiekt danych, które należy dodać lub zmienić w stanie komponentu, podobnie jak w przypadku wywołania funkcji `this.setState`.

Zwróć uwage, że funkcja ta jest funkcją statyczną i musi być poprzedzona specyfikatorem `static`. Ozacza to, że w funkcji nie ma dostępu do obiektu `this`!

> #### Uwaga
> Funkcja ta wywoływana jest za każdym razem kiedy komponent ulega przerenderowaniu - dotyczy to także przerenderowania na skutek wywołania`this.setState` - miej na uwadze, by nie nadpisać stanu propsami!

**tak**

*   synchronizacja stanu komponentu z otrzymanymi propsami

**nie**

*   nie wywołuj akcji asynchronicznych

* * *

## shouldComponentUpdate(nextProps, nextState)

Komponenty stanowe renderują się ponownie z kilku powodów - głównie ponieważ zmienił się ich stan lub ponownie wyrenderował się ich rodzic. Czasami jednak nie potrzebujemy by na skutek tych operacji ponownie wyrenderował się także nasz komponent (może renderujemy jakiś obiekt DOM, który mógł być zmieniony zewnętrznie jak edytor WYSIWYG, albo obliczenia potrzebne do renderowania są dosyć intensywne). W tym wypadku możemy zaimplementować metodę `shouldComponentUpdate`, która otrzymuje dostęp do przyszłego stanu i przyszłych prospów oraz powinna zwrócić wartość `true` jeżeli komponent ma zostać ponownie wyrenderowany, lub `false` w przeciwnym wypadku.

* * *

## componentDidUpdate(prevProps, prevState, snapshot)

Funkcja ta wywoływana jest tuż po tym jak zakończył się proces renderowania (wywołana została metoda `render` naszego komponentu oraz wszystkich jego dzieci), a jako parametry otrzymuje poprzednie propsy i poprzedni stan. Jest to odpowiednie miejsce do wywoływania zdarzeń asynchronicznych, zaś jeżeli potrzebujemy zaktualizować tutaj stan, powinniśmy być bardzo ostrożni, aby nie wpaść w pętlę zdarzeń `render -> componentDidUpdate -> update -> this.setState -> componentDidUpdate`

Trzeci parametr jest wartością zwróconą przez `getSnapshotBeforeUpdate`.

```jsx
componentDidUpdate(prevProps) {
  if(prevProps.text !== this.props.text) {
    /**
     * props text uległ zmianie i jego nowa wartośc znajduje się 
     * w this.props.text - powinniśmy na to jakoś zareagować
     * np. wywołując akcję asynchroniczną
     */
  }
}
```

**tak**

*   wywołaj akcje synchroniczne
*   zareaguj na zmiany w DOM poprzez analizę referencji
*   dodaj nasłuchiwanie na zdarzenia, timery

**nie**

*   nie aktualizuj bezpośrednio stanu komponentu

* * *

## componentDidMount()

Metoda zostanie wywołana tylko raz w cyklu życia komponentu zaraz po pierwszym wywołaniu `render`. Nadaje się ona idealnie dla wykonywania operacji asynchronicznych. Powinniśmy unikać wywoływania tutaj operacji zmieniających stan, ponieważ spowoduje to kolejne renderowanie elementu.

**tak**

*   wywołaj akcje synchroniczne
*   zareaguj na zmiany w DOM poprzez analizę referencji
*   dodaj nasłuchiwanie na zdarzenia, timery

**nie**

*   nie aktualizuj bezpośrednio stanu komponentu

* * *

## componentWillUnmount()

Tuż przed usunięciem komponentu wywoływana jest metoda `componentWillUnmount`, działająca nieco jak destruktor znany z programowania obiektowego. Jeżeli nasz komponent zmodyfikował DOM, uruchomił timery (`setTimeout()`) lub dodał nasłuchiwanie na zdarzenia powinniśmy tutaj po sobie "posprzątać". W innym wypadku ryzykujemy wycieki pamięci i zmniejszenie stabilności aplikacji.

**tak**

*   usuń nasłuchiwanie na zdarzenia, timery
*   anuluj wszelkie trwające akcje asynchroniczne

**nie**

*   nie pracuj ze stanem komponentu

* * *

## componentDidCatch(errorString, errorInfo)

Specjalna metoda nie związana bezpośrednio z samym cyklem życia komponentu, lecz wywoływana w odpowiedzi na nieobsłużony błąd występujący w metodzie `render` komponentu lub jego dzieci (o ile nie złapane w nich). Jako parametry otrzymuje komunikat błędu oraz stack trace. Możemy użyć jej w celu wyświetlenia komunikatu błędu, którego nie obsłużył żaden z naszych komponentów.

```jsx
componentDidCatch(errorString, errorInfo) {
  this.setState({
    error: errorString
  });
  /**
   * Zapiszmy stack trace błędu dla developerów
   */
  ErrorLoggingTool.log(errorInfo);
}

render() {
  if(this.state.error) {
    /**
     * Wyświetlmy komunikat błędu dla użytkownika
     */
    return <ShowErrorMessage error={this.state.error} />
  }
  return (
    <InnyKomponentKtoryWywolaBlad />
  );
}     
```

* * *

## getSnapshotBeforeUpdate(prevProps, prevState)

Funkcja ta wywoływana jest tuż przed tym, jak aktualizacja komponentu zostanie przekazana przeglądarce do wyrenderowania. Możesz użyć jej w celu odczytania DOMu (np. pozycji scrollu strony) zanim ulegnie on zmianie. Zwrócona wartość zostanie przekazana do `componentDidUpdate`jako parametr.

> #### Uwaga
> Wraz z React 16.3 wprowadzone zostały nowe metody cyklu życia zastępujące kilka, które zostają wycofane. Są one co prawda wciąż dostępne ale nie zaleca się ich używania ponieważ niebawem ich nazwy zostaną zmienione a z czasem usunięte.

## UNSAFE\_componentWillReceiveProps

Funkcja ta wywoływana jest w momencie, kiedy komponent ulega przerenderowaniu na skutek przerenderowania się rodzica.

```jsx
componentWillReceiveProps(nextProps) {
  if(nextProps.text !== this.props.text) {
    /**
     * props text uległ zmianie i jego nowa wartośc znajduje się 
     * w nextProps.text - powinniśmy na to jakoś zareagować
     */
  }
}
```

**tak**

*   zareaguj na zmiany props (np. w celu synchronizacji stanu i propsów)

**nie**

*   nie wywołuj akcji asynchronicznych

* * *

## UNSAFE\_componentWillMount

Wywoływana w momencie, w którym komponent zostaje dodany do VDOM, przed pierwszym renderem.

* * *

## UNSAFE\_componentWillUpdate

Wywoływane przed aktualizacją komponentu.

## Cykle życia

Po zapoznaniu się z powyższymi opisami wyróżnić możemy dwa kluczowe cykle:

### Cykl montowania komponentu:  

`constructor -> static getDerivedStateFromProps -> render -> componentDidMount`

### Cykl aktualizowania komponentu:  

`static getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate`

Jak widać cykle te nie pokrywają się (za wyjątkiem metody render, która nie powinna robić nic innego jak zwracać JSX!), tak więc jeżeli potrzebujemy by nasz komponent wykonał jakąś operację np. po zamontowaniu oraz po aktualizacji, musimy wywołać ją zarówno w `componentDidMount`jak i w `componentDidUpdate`.

## Dlaczego nie wywoływać akcji asynchronicznych w `UNSAFE_componentWill*`?

Metody `UNSAFE_componentWill*` zdają się być stworzone dla zadań asynchronicznych takich jak pobieranie danych z serwera - przecież chcemy pobrać dane "zanim komponent"! Niestety w tym wypadku intuicja podpowiada nam nieco źle, a wynika to z powodu zmian wprowadzonych w React Fiber, którego głównym celem była poprawa "płynności animacji".

W React Fiber wprowadzono nowy mechanizm pozwalający na (wewnętrzne) priorytetyzowanie renderowania komponentów. Każdy z przedstawionych wyżej cyklów życia może zostać wstrzymany lub anulowany przed wywołaniem `render`, a kiedy zapadnie decyzja o jego wznowieniu cykl ten będzie wywoływany od nowa.

Oznacza to, że wszystkie operacje zaplanowane w `componentWillUpdate` mogą potencjalnie zostać wykonane nie raz, ale wielokrotnie w "jednym" cyklu. Funkcje `componentDid*` wywoływane są jednokrotnie - nie ma możliwości wstrzymania cyklu po wywołaniu `render`.

> #### Uwaga
> Niejako wyjątkiem jest tutaj działanie `UNSAFE_componentWillMount` i `componentDidMount` w przypadku, kiedy stosujemy renderowanie na serwerze. W takiej sytuacji `UNSAFE_componentWillMount` wykonywany jest jedynie po stronie serwera, zaś `componentDidMount` w przeglądarce. Jeżeli chcemy wykonać operację jedynie na serwerze, powinniśmy zainicjować ją w pierwszej z tych dwóch metod.
---
title: HoC - Komponenty wyższego rzędu
---

Komponenty Wyższego Rzędu to wzorzec używany głównie w przypadku, kiedy chcemy przygotować mechanizm logiki (w tym stanu), który może być wykorzystywany z dowolnym komponentem poprzez "wzbogacanie" go. Termin ten wywodzi się z programowania funkcyjnego, w którym występuje określenie "funkcja wyższego poziomu".

Funkcje takie to funkcje, które zwracają inne funkcje - albo poprzez utworzenie zdefiniowanej funkcji albo poprzez zmodyfikowanie innej, przekazanej jako argument. Przykładem może być funkcja, która dodaje logowanie danych o wywołaniu innych funkcji - możemy np. zastosować ją jako "makro" i obsługiwać inaczej w zależności od tego, czy działamy w trybie developera czy produkcyjnym:

```js
// definicja funkcji biznesowej
const kwadrat = a => a * a;

// definicja logera w postaci HoC
const withLog = func => {
  if (process.env.NOVE_ENV === "development") {
    return (...args) => {
      console.log("Funkcja wywołana z argumentami: ", args);
      const result = func(args);
      console.log("Wynik: ", result);
      return result;
    };
  } else {
    return func;
  }
};

const kwadratWithLog = withLog(kwadrat);
console.log(kwadrat(9));
```

Poprzez wywołanie `withLog(kwadrat)` tworzymy nową funkcje. Zwrócona funkcja pobiera dowolną ilość argumentów (`...args`) a wywołana wywołuje oryginalną funkcje. Dodatkowo, w zależności od tego w jakim środowisku działamy zobaczymy także informacje o tym, z jakimi argumentami wywołana została oryginalna funkcja oraz co zwróciła.

Te samą logikę można przełożyć także na komponenty Reactowe.

## Przykład

Gdybyśmy w React chcieli odtworzyć podobny przykład - np. otrzymać informację za każdym razem, kiedy nasz komponent otrzymuje nowe propsy i ulega przerenderowaniu, możemy stworzyć Komponent Wyższego Rzędu:

```jsx
const withLogger = Component => {
  return class WithLogger extends React.Component {
    componentDidUpdate(prevProps) {
      console.log(
        `Komponent ${Component.displayName ||
          Component.name} został przerenderowany`
      );
      console.log("Stare props", prevProps);
      console.log("Nowe props", this.props);
    }
    render() {
      return <Component {...this.props} />;
    }
  };
};

const Test = props => <div>{props.random}</div>;
```

> W dużej ilości przypadków, HoC można zidentyfikować po ich nazwie - `withCoś` to dosyć popularny sposób nazewnictwa.

Możemy teraz utworzyć nasz "wzbogacony" komponent:

```jsx
const TestWithLogger = withLogger(Test);
```

Za każdym razem, kiedy użyjemy komponentu `<TestWithLogger random={Math.random()} />` i zostanie on przerenderowany w konsoli zobaczymy informacje wraz ze starą i nową wartością jego propsów.

### Struktura w pliku

Problematycznym może teraz wydawać się to, że nie możemy już używać `<Test />` lecz `<TestWithLogger />`. Dosyć popularnym sposobem rozwiązania tego problemu jest by każdy moduł (komponent), który udostępniamy w naszej aplikacji jako HoC posiadał dwa eksporty: sam komponent jako nazwany eksport i HoC jako domyślny:

```jsx
export const Test = props => <div>{props.random}</div>;

export default withLogger(Test);
```

W tym momencie możemy zaimportować sobie HoC lub oryginalny komponent w zależności od naszych potrzeb:

```jsx
import Test from "./Test"; // zaimportuje HoC
import { Test } from "./Test"; // zaimportuje sam komponent
```

Z taką strukturą spotkasz się w dużej ilości bibliotek React stosujących ten wzorzec, np. react-redux

## Przykład 2 - pobieranie danych

Innym często spotykanym przykładem wykorzystania HoC jest dodanie logiki pobierania danych. Zwykle chcemy także, żeby dane jakie pobierzemy zależały od jakiegoś parametru. Dla przykładu utworzymy komponent pobierający listę repozytoriów użytkownika z GitHub.

Utwórzmy wpierw komponent, który będzie konsumował dane jako props i wyświetlał listę:

```jsx
const RepoList = props => {
  return (
    <div>
      {props.repositories.length === 0 ? (
        <p>Brak repozytoriów</p>
      ) : (
        <ul>
          {props.repositories.map(repository => (
            <li key={repository.full_name}>{repository.full_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

Komponent ten oczekuje tablicy `repositories` zawierającej obiekty, które zawierają przynajmniej pole `full_name` - dane w formacie jakie zwraca endpoint https://api.github.com/users/btmpl/repos

Przygotujmy teraz nasz komponent HoC:

### withRepositories

Naszym zadaniem będzie stworzenie komponentu, który oczekuje przekazania nazwy użytkownika jako prop, pobiera dane i renderuje przekazany komponent:

```jsx
const withRepositories = Component => {
  return class WithRepositories extends React.Component {
    state = {
      repositories: []
    };

    render() {
      return (
        <Component repositories={this.state.repositories} {...this.props} />
      );
    }

    componentDidMount() {
      fetch(`https://api.github.com/users/${this.props.username}/repos`)
        .then(response => response.json())
        .then(json =>
          this.setState({
            repositories: json
          })
        );
    }
  };
};
```

Jedyne co teraz nam pozostaje, to utworzyć wersję komponentu `RepoList` owiniętą w `withRepositories` i wyrenderować nowy komponent, przekazując do niego nazwę użytkownika, którego dane chcemy pokazać:

```jsx
const GithubRepoList = withRepositories(RepoList);

const App = () => {
  return <GithubRepoList username={"btmpl"} />;
};
```

W ten sposób stworzyliśmy zarówno komponent UI, jak i re-używalny komponent logiki. Każdy z nich może być użyty oddzielnie: `RepoList` może otrzymać dane z rodzica lub z HoC, a `withRepositories` może przekazać je do dowolnego innego komponentu, np. listy rozwijanej. Możemy także wyświetlić repozytoria kilku użytkowników:

```jsx
const App = () => {
  return (
    <React.Fragment>
      <GithubRepoList username={"btmpl"} />
      <GithubRepoList username={"markerikson"} />
    </React.Fragment>
  );
};
```

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/7z7716vzwq" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Przypadkowe regenerowanie komponentu

Należy mieć na uwadze, by wszelkie tworzenie komponentów w ten sposób odbywało się poza cyklem renderowania komponentu. Jeżeli spróbujemy wykonać to w metodzie render:

```jsx
render() {
  const HoCComponent = withData(Component);
  return <HoCComponent />
}
```

może na pierwszy rzut oka nie powodować błędów, ale w takim wypadku przy każdym wywołaniu `render()` tworzony będzie nowy komponent (`HoCComponent`) który nie będzie mógł być porównany ze starym komponentem w procesie re-renderowania. Poskutkuje to usunięciem starego komponentu i utworzeniem nowego w przeciwieństwie do aktualizacji już istniejącego komponentu. Nie tylko pogarsza to wydajność ale i może powodować utratę danych.

Jeżeli rzeczywiście musimy tworzyć HoC dynamicznie, użyjmy do tego memoizacji:

```jsx
  // Jeżeli this.props.userId jest inne niż w poprzednim wywołaniu,
  // wygeneruj nowy komponent - w innym wypadku, użyj poprzedniego.
  oldUserId = null;
  HoCComponent = null;

  getComponent = (userId) => {
    if (userId !== this.oldUserId) {
      this.oldUserId = userId;
      this.HoCComponent = withData(userId)(Component);
    }

    return HoCComponent;
  }

  render() {
    const HoCComponent = this.getComponent(this.props.userId);

    return <HoCComponent />;
  }
```

## Kiedy użyć tego wzorca

Wzorzec idealny do zastosowania w przypadkach, kiedy chcemy udostępnić logikę ale pozwolić konsumentowi na pełne modyfikowanie UI elementów lub też umożliwić łatwe modyfikowanie wybranych elementów.

Wzorzec ten jest nieco bardziej ograniczony niż wzorzec render prop jako iż wymaga on pełnej definicji UI w komponencie, który owijamy naszym HoC, co może prowadzić do sytuacji, w których tworzymy wiele delikatnie różnych komponentów lub też złożony komponent, zawierający dużo uzależnień od przekazanych propsów.

## W praktyce

### react-redux

Najpopularniejszym przykładem HoC jest chyba komponent (zwracany przez) `connect` z biblioteki [react-redux](https://react-redux.js.org/), pozwalający na połączenie naszego komponentu i Reduxa.

```jsx
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NaszKomponent);
```

W ten sposób, nasz komponent jest automatycznie podpinany do Reduxa i re-renderowany kiedy zajdzie jakaś zmiana (w interesujących nas danych).

### react-router

We wspomnianym w poprzednim rozdziale [react-router](https://github.com/ReactTraining/react-router/) znajdziemy też ten wzorzec:

```jsx
export default withRouter(Component);
```

Jedyne co robi ten HoC, to owija nasz komponent w komponent `Route`, czyli dokładnie to samo co:

```jsx
<Route component={Component} />
```

ale pozwala nam na robienie tego automatycznie, a nie w momencie użycia.

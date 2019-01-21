---
title: Render Props
---

Render Props stanowi poniekąd rozszerzoną i ulepszoną wersję wzorca komponentu złożonego oraz HoC. Podobnie jak one, skupia się na udostępnieniu logiki komponentu developerowi, ale zwykle nie definiuje on żadnych elementów graficznych, w pełni polegając na implementacji.

W celu zaprezentowania wzorca postaramy się zmodyfikować mechanizm zakładek, który wdrożyliśmy w sekcji [Komponenty złożone](compound-components).

Przypomnijmy sobie jego ograniczenia:

- ograniczone możliwości modyfikacji UI
- brak lub ograniczone możliwości modyfikacji logiki (np. oznaczanie zakładki jako zablokowana)

W nowym wzorcu definiujemy prop `render`, do którego przekazujemy funkcję z logiką:

```jsx
const Component = props => {
  return props.render();
};

const testowaFunkcja = () => {
  return "Hello world!";
};

<Component render={testowaFunkcja} />;
```

Funkcja ta zostaje wywołana przez komponent i zwrócona jako jego element.

## FaC - function as child

Nazwa "render prop" odnosi się do faktu, że mechanizm renderowania przekazujemy jako prop o nazwie `render`:

```jsx
<Component render={() => {
  return "Hello world!"
}}>
```

Istnieje także specyficzna wersja tego wzorca, w której funkcję przekazujemy jako prop `children` - wariacja ta nosi nazwę "function as child".

Do tej pory wszystkie nasze przykłady zakładały, że dzieci przekazywane do komponentu stanowią z pkt. widzenia Reacta elementy (instancje komponentów, łańcuchy tekstu, liczby etc.). Nie oznacza to jednak, że są to jedyne opcje, co do tego, co możemy przekazać do komponentu.

Jeżeli `Component` założyłby, że `props.children` będzie funkcją, może ją po prostu wywołać, i zwrócić jej wynik:

```jsx
const Component = props => {
  return props.children();
};
```

W kolejnych przykładach używać będziemy właśnie tej wariacji - nie jest to reguła, ale osobista preferencja :)

## Przykład - komponent `Tabs`

Uzbrojeni w nową wiedzę, możemy zaprojektować przykład użycia naszego komponentu, w oparciu o nasz poprzedni kod. Jak już wspomnieliśmy, wzorzec ten zwyczajowo dostarcza tylko logikę, więc stworzenie UI leży po naszej stronie:

```jsx
<Tabs>
  {() => {
    return (
      <div>
        <ul>
          <li>Zakładka 1</li>
          <li>Zakładka 2</li>
        </ul>
        <div>
          <p>Treść zakładki 1</p>
          <p>Treść zakładki 2</p>
        </div>
      </div>
    );
  }}
</Tabs>
```

Komponent `Tabs` zaś początkowo może przybrać formę:

```jsx
class Tabs extends React.Component {
  render() {
    return this.props.children();
  }
}
```

W tym momencie jednak żaden komponent (ani `Tabs` ani nasz komponent) nie wie, która zakładka powinna być widoczna. `Tabs` nie jest w stanie zadecydować, który element ma być widoczny, ponieważ otrzymuje on tylko jeden (i nie jest w stanie go zmodyfikować), a nasza aplikacja nie powinna decydować jak zadbać o to, w jaki sposób śledzić zmiany widoczności - nie po to "abstrachujemy" logikę.

Komponent `Tabs` wywołuje `props.children` jako funkcję - może on zatem przekazać do niej jakieś argumenty. Nasz komponent potrzebuje co najmniej 2 informacje: która zakładka jest aktualnie widoczna oraz jak zmienić widoczną zakładkę:

```jsx
class Tabs extends React.Component {
  state = {
    active: this.props.defaultActive || 0
  };

  setActive = to =>
    this.setState({
      active: to
    });

  render() {
    return this.props.children({
      active: this.state.active,
      setActive: this.setActive
    });
  }
}
```

W tym momencie, funkcja, którą osadzimy w `<Tabs>` otrzyma obiekt zawierający interesujące nas informacje, możemy zatem zmodyfikować nasz przypadek użycia:

```jsx
<Tabs defaultActive={0}>
  {tabProps => {
    return (
      <div>
        <ul>
          <li onClick={() => tabProps.setActive(0)}>Zakładka 1</li>
          <li onClick={() => tabProps.setActive(1)}>Zakładka 2</li>
        </ul>
        <div>
          {tabProps.active === 0 && (
            <div>
              <p>Treść zakładki 1</p>
            </div>
          )}
          {tabProps.active === 1 && (
            <div>
              <p>Treść zakładki 2</p>
            </div>
          )}
        </div>
      </div>
    );
  }}
</Tabs>
```

W ten sposób odtworzyliśmy funkcjonalność komponentu z sekcji "Komponenty złożone" - kod może wydawać się bardziej skomplikowany: musimy upewnić się, że pokazujemy odpowiednią zakładkę, wywołujemy odpowiednią funkcję.

### Rozszerzenie funkcjonalności

Jednak - odwrotnie jak to się ma w przypadku Spidermana - "z tą odpowiedzialnością przychodzi wielka moc". Teraz to my w 100% decydujemy o tym, jak wygląda - a w niektórych tematach jak funkcjonuje - komponent. Jeżeli potrzebujemy by jakaś zakładka była nieaktywna, możemy zadeklarować to w UI:

```jsx
<Tabs defaultActive={0}>
  {tabProps => {
    return (
      <div>
        <ul>
          <li onClick={() => tabProps.setActive(0)}>Zakładka 1</li>
          <li style={{ opacity: 0.5 }}>Nieaktywna zakładka</li>
        </ul>
        <div>
          {tabProps.active === 0 && (
            <div>
              <p>Treść zakładki 1</p>
            </div>
          )}
          {tabProps.active === 1 && (
            <div>
              <p>Treść zakładki 2</p>
            </div>
          )}
          <div>Stopka widoczna na dole każdej zakładki</div>
        </div>
      </div>
    );
  }}
</Tabs>
```

## Problemy

Jeżeli przyjrzeć się powyższemu zastosowania wzorca render prop można dostrzec pewien problem: w celu manipulowania zakładek (np. zmiany aktywnej) zmiana musi pochodzić z wewnątrz funkcji osadzonej w komponencie `<Tabs>` bo tylko tam dostępna jest funkcja `tabProps.setActive`. Co prawda można spróbować przypisać `this.setActive = tabProps.setActive` ale nie jest to "deklaratywne" zastosowanie, które implementujemy w React.

Jeżeli nasza aplikacja przyjmie formę:

```jsx
class App extends React.Component {
  state = {
    activeTab: 0
  };

  render() {
    return (
      <div>
        <Tabs defaultActive={this.state.activeTab}>(...)</Tabs>
        <button onClick={() => this.setState({ activeTab: 0 })}>
          Do zakładki 1
        </button>
        <button onClick={() => this.setState({ activeTab: 1 })}>
          Do zakładki 2
        </button>
      </div>
    );
  }
}
```

klikając na guziki nie zobaczymy zmiany, ponieważ komponent `Tabs` obserwuje `activeTab` tylko w momencie montowania. Istnieje kilka sposobów na zaradzenie tej sytuacji.

### Resetowanie komponentu przy użyciu klucza

React używa specjalnego prop `key` to śledzenia, który komponent powinien usunąć, dodać lub zaktualizować w przypadku renderowania listy komponentów. Prop ten działa tak samo w przypadku komponentów, które nie są renderowane w pętlach - w tym wypadku nie mamy potrzeby deklarowania go, co nie znaczy, że nie możemy.

Jeżeli pracujemy z komponentem, który nie posiada możliwości zmiany props po tym, jak został on wyrenderowany, możemy wymusić jego "zresetowanie" z nowymi danymi odmontowując i montując go ponownie:

```jsx
<Tabs defaultActive={this.state.activeTab} key={this.state.activeTab}>
  (...)
</Tabs>
```

W tym momencie, tak długo jak nawigacja między zakładkami pochodzi "z wewnątrz" komponentu, będzie on aktualizowany, ale w momencie, którym to rodzic zadeklaruje chęć zmiany zakładki, cały komponent `Tabs` (i jego dzieci) zostanie usunięty i stworzona zostanie jego nowa instancja.

> #### Uwaga
>
> Rozwiązanie takie jest w pełni poprawne z pkt. widzenia ideologii React, jednak może mieć negatywne skutki np. w przypadku, kiedy renderowanie elementów zakładek jest bardzo wymagające lub chcemy zachować dane na niewidocznych (ale wciąż renderowanych) elementów zakładek.

### Komponenty kontrolowane

Drugim rozwiązaniem, podobnie jak w przypadku formularzy, jest wdrożenie komponentu kontrolowanego:

```jsx
class Tabs extends React.Component {
  render() {
    return this.props.children({
      active: this.props.activeTab
    });
  }
}

// w App
<Tabs activeTab={this.state.activeTab}>(...)</Tabs>;
```

To rozwiązanie niestety znów przerzuca na konsumenta konieczność śledzenia, która zakładka jest aktywna i sprawia, że komponent `Tabs` jest niepotrzebny.

W odróżnieniu od formularzy, w naszych komponentach możemy jednak przełączać się pomiędzy wersją kontrolowaną i niekontrolowaną w czasie życia komponentu. Zmodyfikujemy zatem znów nasz komponent:

```jsx
class Tabs extends React.Component {
  state = {
    active: this.props.defaultActive || 0
  };

  getActive = () => {
    return this.props.activeTab === undefined
      ? this.state.active
      : this.props.activeTab;
  };

  setActive = to =>
    this.setState({
      active: to
    });

  render() {
    return this.props.children({
      active: this.getActive(),
      setActive: this.setActive
    });
  }
}

class App extends React.Component {
  state = {
    activeTab: 0
  };

  render() {
    return (
      <div>
        <Tabs defaultActive={0} activeTab={this.state.activeTab}>
          (...)
        </Tabs>
        <button onClick={() => this.setState({ activeTab: 0 })}>
          Do zakładki 1
        </button>
        <button onClick={() => this.setState({ activeTab: 1 })}>
          Do zakładki 2
        </button>
      </div>
    );
  }
}
```

W ten sposób jesteśmy w stanie przełączać zakładki klikając w ich tytuły, a także klikając w guziki. Pozostaje jeszcze jeden problem: w momencie, w którym `App` zdecyduje o zmianie zakładki (przez zmianę `state.activeTab`) sam komponent nie jest już w stanie zmieniać się "z wewnątrz" ponieważ zawsze będzie dostawał `props.activeTab` o wartości innej niż `undefined`.

Możemy co prawda wprowadzić jakieś wewnętrzne logiki oparte o porównywanie danych z `this.setActive` i propsów, nadpisując czasem jedne drugimi, natomiast poprawnym rozwiązaniem jest narzucenie na rodzica (`App`) podjęcia decyzji: komponent jest kontrolowany (wysyłamy `activeTab`) albo nie. Rodzic może także "zdać" kontrolę nad elementem:

```jsx
class Tabs extends React.Component {
  state = {
    active: this.props.defeultTab || 0
  };

  static getDerivedStateFromProps(props) {
    if (props.activeTab !== undefined)
      return {
        active: props.activeTab
      };
    else return {};
  }
}

// App
<button onClick={() => this.setState({ activeTab: undefined })}>
  Uwolnij zakładki
</button>;
```

### Kompletny przykład

<iframe src="https://codesandbox.io/embed/ryn6rz76vq" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Inne formy render prop

Render prop przyjmuje też innej formy, np. umożliwia konfigurowanie części komponentu poprzez zastosowanie logiki podobnej do wzorca slot. Czasami spotkamy się z komponentem, który przyjmuje funkcję nie jako `props.children` ale jako nazwany prop, np. komponent typu "checkbox":

```jsx
<Checkbox checked={true} label={"Zaznacz by kontynuować"} />
```

może domyślnie renderować element HTML, ale sam komponent może pozwalać na modyfikację swojego UI poprzez przekazanie poszczególnych elementów składowych:

```jsx
<Checkbox
  checked={true}
  renderIcon={({ isChecked }) => {
    if (isChecked) return <Icon name="checkmark-on" />;
    else return <Icon name="checkmark-off" />;
  }}
  renderLabel={({ isChecked }) => {
    if (isChecked)
      return (
        <span style={{ color: "green" }}>Potwierdzono wyrażenie zgody</span>
      );
    else return <span>Zaznacz by kontynuować</span>;
  }}
/>
```

## Kiedy użyć tego wzorca

Wzorzec idealny do zastosowania w przypadkach, kiedy chcemy udostępnić logikę ale pozwolić konsumentowi na pełne modyfikowanie UI elementów lub też umożliwić łatwe modyfikowanie wybranych elementów.

Można też zastosować go w celu wyeliminowania wzorca HoC.

## W praktyce

### Formik

[Formik](https://github.com/jaredpalmer/formik), to jedna z popularniejszych bibliotek to zarządzania formularzami; implementuje ona także omawiany wzorzec:

```jsx
const Rejestracja = () => (
  <div>
    <h1>Rejestracja</h1>
    <Formik
      initialValues={{
        email: ""
      }}
      onSubmit={values => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        }, 500);
      }}
      render={({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="Podaj adres e-mail"
            type="text"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.email && touched.email ? "text-input error" : "text-input"
            }
          />
        </form>
      )}
    />
  </div>
);
```

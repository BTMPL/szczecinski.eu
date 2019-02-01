---
title: Komponenty złożone
---

Określenie "komponenty złożone" nie odnosi się do tego, że są one skomplikowane, lecz do tego, że złożone są one z innych komponentów, które współpracują ze sobą na rzecz jednego celu. Dodatkową cechą komponentów tego typu jest to, że są one od siebie w jakiś sposób zależne: współdzielą dane lub logikę, tak, by uzupełniać się wzajemnie i upraszczać implementację.

Z tym wzorcem spotkał się każdy, kto pisał już HTML, przykładowym komponentem złożonym jest np. `<select>`:

```html
<select>
  <option value="">-- wybierz opcję --</option>
  <option value="tak">tak</option>
  <option value="nie">nie</option>
</select>
```

W powyższym kodzie widzimy dwa komponenty: `<select>` i `<option>`, które pełną swoją rolę a wykorzystanie jednego bez drugiego nie przyniosło by oczekiwanego rezultatu. Innym przykładem, stworzonym "ręcznie" może być np. mechanizm wyświetlania danych w zakładkach:

```html
<div class="tabs">
  <ul>
    <li class="active"><a href="?tab=1">Zakładka 1</a></li>
    <li><a href="?tab=2">Zakładka 2</a></li>
  </ul>
  <div>
    Treść zakładki 1
    <!-- treść zakładki 2 jest generowana po stronie serwera przy zmianie zakładki -->
  </div>
</div>
```

Jeżeli chcielibyśmy utworzyć mechanizm zakładek w naszej aplikacji React, zapewne pierwszym pomysłem było by napisanie komponentu ze stanem:

```jsx
class App extends React.Component {
  state = { active: 0 };

  render() {
    return (
      <div className="tabs">
        <ul>
          <li onClick={() => this.setState({ active: 0 })}>Zakładka 1</li>
          <li onClick={() => this.setState({ active: 1 })}>Zakładka 2</li>
        </ul>
        <div>
          {this.state.active === 0 ? (
            <p>Treść zakładki 1</p>
          ) : (
            <p>Treść zakładki 2</p>
          )}
        </div>
      </div>
    );
  }
}
```

kod taki jednak szybko stanie się trudny do utrzymania i rozszerzania: kolejne zakładki będą komplikować logikę a i re-używalność kodu jest praktycznie zerowa. Zamiast tego możemy stworzyć kilka komponentów opisujących nasze UI i posłużyć się wzorcem komponentów złożonych.

## React.Children

Zanim przejdziemy dalej, musimy zapoznać się z API, które będzie postawą tego i innych wzorców: [React.Children](https://reactjs.org/docs/react-api.html#reactchildren). Jak wiemy, do komponentu jego dzieci przekazywane są jako `props.children`. W zależności od tego, ile elementów przekażemy jako bezpośrednie dziecko, obiekt ten może być albo pojedynczym elementem, albo tablicą elementów. Abyśmy nie musieli sprawdzać tego za każdym razem możemy skorzystać z `React.Children` i oferowanych przez owe API metod.

Dodatkowo, każde dziecko przekazane do elementu jest elementem (efektem wywołania `React.createElement`) i możemy je odczytywać (odczytywać jego props) oraz modyfikować (za pomocą `React.cloneElement`). Uzbrojeni w te wiedzę, zaprojektujmy przykład użycia naszego nowego komponentu wyświetlającego dane w zakładkach:

## Przykład

Naszym zadaniem jest stworzenie komponentu, który będzie łatwy w użyciu (proste API, nie wymaga by rodzic znał zasadę działania komponentu) i re-używalny. Zwykle projektowanie komponentów tego typu rozpoczynamy od stworzenia struktury przypadku użycia, przykład, który chcemy osiągnąć to:

```jsx
<Tabs defaultActive={0}>
  <Tab title="Zakładka 1">
    <p>Treść zakładki 1</p>
  </Tab>
  <Tab title="Zakładka 2">
    <p>Treść zakładki 2</p>
  </Tab>
</Tabs>
```

Wyróżniamy tutaj dwa komponenty:

- `Tabs`, stanowiący otoczkę całego komponentu i posiadający informacje o tym, która zakładka jest aktywna
- `Tab`, stanowiący treść zakładki oraz jej tytuł

> #### Uwaga
>
> Standard nazywania propów `defaultCoś` jest używany by wskazać, że jest to wartość domyślna, używana do momentu, aż komponent sam nie postanowi kontrolować atrybutu, który opisuje dane prop. Podobnie ma to miejsce w przypadku niekontrolowanych pól formularza - `<input defaultValue={'Wartość domyślna'} />`

Komponent `Tab` nie jest niczym nadzwyczajnym, może on być prosty jak:

```jsx
const Tab = ({ children }) => <div className="tab">{children}</div>;
```

### Komponent `Tabs`

Cała "magia" odbywa się w komponencie `Tabs`:

```jsx
class Tabs extends React.Component {
  state = {
    activeTab: this.props.defaultActive || 0
  };

  renderMenu() {
    return React.Children.map(this.props.children, (item, key) => {
      return (
        <li
          key={key}
          style={{
            fontWeight: key === this.state.activeTab ? "bold" : undefined
          }}
          onClick={() => this.setState({ activeTab: key })}
        >
          {item.props.title}
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <ul>{this.renderMenu()}</ul>
        <div>
          {React.Children.toArray(this.props.children)[this.state.activeTab]}
        </div>
      </div>
    );
  }
}
```

Podzielmy komponent na dwie części:

### `renderMenu`

Funkcja ta używa `React.Children` do pracy z każdym z elementów, jakie komponent otrzymał jako dziecko. Dla każdego elementu (`React.Children.map` działa dokładnie jak `Array.prototype.map` - generuję tablicę o jednakowej długości jak tablica wejściowa) generuje nowy element `<li>`.

Przy każdym elemencie następuje odczyt jego prop `title` (jako `item.props.title`), który zostaje przekazany do `<li>`. Do każdego `<li>` dodawane jest też zdarzenie wywoływane po kliknięciu, które zmienia stan komponentu `Tabs` ustawiając `state.activeTab` na wartość indeksu.

Dodatkowo, jeżeli indeks mapy pokrywa się ze stanem komponentu, jest on wizualnie oznaczany jako wyboldowany.

W ten sposób wygenerowane zostanie menu z tytułami zakładek. Nie musimy przekazywać tych danych do `Tabs` - komponent ten zakłada, że każdy z elementów-dzieci posiada te informację, więc odczytuje je z elementów.

> Mogło by wydawać się, że w ten sposób łamiemy zasadę przekazywania danych w górę (pamiętamy, że w tym celu używa się callbacków), jednak jest to "nadużycie" faktu, że elementy dzieci są także propsami elementu rodzica.

### `render`

Funkcja renderująca jest nieco prostsza. Jej głównym zadaniem jest wyświetlenie tylko i wyłącznie tej zakładki, którą potrzebujemy pokazać użytkownikowi:

Wywołanie `React.Children.toArray(this.props.children)` zwróci nam tablicę elementów dzieci (jeżeli "w ciemno" spróbowalibyśmy odwołać się do `this.props.children[0]` mogło by okazać się, że `Tabs` ma tylko jedno dziecko, a wtedy `this.props.children` nie będzie tablicą!), z której wyświetlimy tylko ten, który aktualnie uznajemy za aktywny.

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/z6695oqm3m" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Upewnianie się, że pracujemy z poprawnymi elementami

Nasz komponent zakłada, że wszystkie dzieci `Tabs` to `Tab`, jeżeli utworzymy strukturę:

```jsx
<Tabs>
  <Tab title="Zakładka 1">
    <p>Treść zakładki 1</p>
  </Tab>
  <Tab title="Zakładka 2">
    <p>Treść zakładki 2</p>
  </Tab>
  <div>Stopka każdej z zakładek</div>
</Tabs>
```

nasz komponent może po prostu nie wyświetlić ostatniego elementu, a w skrajnych przypadkach spowodować wygenerowanie błędu. W tym celu powinniśmy sprawdzić, czy element, na którym pracujemy jest oczekiwanego typu. W tym celu podczas manipulacji elementem, sprawdzamy czy jest tym, którego się spodziewamy:

```jsx
  const Tab = ({ children }) => <div className="tab">{children}</div>;
  Tab.displayName = 'Tab';

  // ...
    return React.Children.map(this.props.children, (item, key) => {
      if (item.displayName !== 'Tab') {
        throw new Error('Przekazany komponent nie jest komponentem <Tab>!');
      }
      return (
        <li...
```

> #### Uwag
>
> Musisz zdefiniować nazwę komponentu używając `Component.displayName` - w innym przypadku w momencie minifikacji kodu zostanie ona zastąpiona zminifikowaną nazwą i nasze sprawdzanie zawsze zwróci fałsz!

Możemy co prawda użyć zapisu:

```jsx
    return React.Children.map(this.props.children, (item, key) => {
      if (item.type !== Tab) {
        throw new Error('Przekazany komponent nie jest komponentem <Tab>!');
      }
      return (
        <li...
```

Ale ma on dwa minusy:

- po pierwsze `Tabs` musi importować `Tab`, bo nie zawsze będzie możliwe / pożądane,
- `Tabs` przestanie akceptować pochodne komponentu `Tab`, np:

```jsx
const MyTab = styled(Tab)`
  color: red;
`;
```

Sytuację te poprawimy stosując pierwszy zapis i dodając:

```js
MyTab.displayName = "Tab";
```

## Kiedy użyć tego wzorca

Wzorzec ten nadaje się głównie w przypadkach, kiedy tworzymy komponenty "mało elastyczne", skupiając się głównie na logice a nie wyglądzie komponentu czy możliwości jego modyfikacji (rozszerzenia) przez użytkownika.

Stworzony przez nas komponent - o ile wygodny w przypadku, gdy używamy go wraz z jego ograniczeniami - staje się skomplikowany lub wręcz nieprzydatny jeżeli chcemy wdrożyć coś, co wykracza poza jego funkcjonalność (np. zablokowane zakładki, wjeżdżanie zakładek z lewej/prawej strony i jednoczesne ukrywanie nowych) - o ile autor komponentu nie przewidział wszystkich naszych zachcianek, jesteśmy ograniczeni jego wizją.

## W praktyce

### react-router

Jednym z popularnych przykładów zastosowań wzorca komponentów złożonych jest [React Router](https://github.com/ReactTraining/react-router/), a dokładniej mechanizm Switch:

```jsx
<Router>
  <Switch>
    <Route path="/admin" component="{Admin}" />
    <Route path="/" component="{Home}" />
  </Switch>
</Router>
```

na chwilę obecną, komponent `Switch` zawiera w swoim renderze logikę, która z przekazanych dzieci wybiera ten, którego atrybut `path` pasuje do aktualnego adresu i renderuje tylko ten jeden komponent:

```js
React.Children.forEach(this.props.children, child => {
  if (match == null && React.isValidElement(child)) {
    element = child;
    const path = child.props.path || child.props.from;
    match = path
      ? matchPath(location.pathname, { ...child.props, path })
      : context.match;
  }
});

return match
  ? React.cloneElement(element, { location, computedMatch: match })
  : null;
```

### Semantic UI

Wzorzec ten jest obecny w prawie każdym komponencie biblioteki [Semantic UI](https://react.semantic-ui.com/modules/dropdown/#types-dropdown).

```jsx
const DropdownExampleDropdown = () => (
  <Dropdown text="File">
    <Dropdown.Menu>
      <Dropdown.Item text="New" />
      <Dropdown.Item text="Open..." description="ctrl + o" />
      <Dropdown.Divider />
      <Dropdown.Item text="Download As..." />
    </Dropdown.Menu>
  </Dropdown>
);
```

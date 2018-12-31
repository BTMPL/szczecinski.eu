---
title: Formularze niekontrolowane, referencje
---

Duża część interakcji, w jaką nasi użytkownicy wchodzą z naszą aplikacją opiera się o pracę z formularzami. W React wyróżniamy dwa typy formularzy. Pierwszy z nich to tzw. formularz niekontrolowany (ang. uncontrolled forms). Praca z nimi wygląda dokładnie tak, jak praca z formularzami w czystym HTML i JS.

Dodajmy zatem do naszego projektu komponent `TweetForm`, który składa się z jednego pola tekstowego (treści tweetu) i guzika odpowiedzialnego za przesłanie formularza.

Podczas wdrażania rozwiązania pojawia się kilka obserwacji i problemów:

*   pole nie może mieć zdefiniowanego przez nas atrybutu `value` - kiedy go dodamy, nie mamy możliwości zmiany wartości pola, jeżeli potrzebujemy nadać polu wartość domyślną, używamy `defaultValue`
*   nie mamy możliwości odczytania wartości pola z poziomu JS

Osoby pracujące wcześniej z frameworkami pozwalającymi na dwu kierunkowy przepływ danych modły by pokusić się o rozwiązanie typu `value={this.value}`, jednak React nie wspiera takiego rozwiązania.

```jsx
class TweetForm extends React.Component {
  
  render() {
    return (
      <div>
        <input type="text" />
        <br />
        <button>Tweetuj!</button>
      </div>                    
    )
  }
}

ReactDOM.render(<div>
  <TweetForm />
  <TweetList tweets={TweetData} />                
</div>, document.getElementById('root'));  
```

## Referencje do DOM

Co prawda w React możemy korzystać z API DOM i użyć np. `document.querySelector` by dostać referencję na konkretny element DOM, ale rozwiązanie takie gryzie się nieco z ideą separacji React (VDOM) i DOM. Czasem jednak jest to konieczne - w takich wypadkach React oferuje nam kilka wyjść bezpieczeństwa, najpopularniejszym z których są referencje.

Każdy komponent (czy to komponent Reactowy, czy też HTML) przyjmuje funkcję w property `ref`. Po każdym renderowaniu się komponentu, funkcja ta będzie wywoływana z parametrem, który stanowi odniesienie do węzła DOM (lub jego odpowiednika na danej platformie, np. React Native).

> #### Uwaga
> Funkcja ta wywoływana jest w `render` oznacza to, że referencje nie są dostępne w `constructor` i innych funkcjach wywoływanych przed pierwszym renderowaniem komponentu (np. pierwszym wywołaniu `getDerivedStateFromProps`.)

Mając odwołanie do elementu DOM pola formularza możemy odczytać jego wartość w polu `value`.

```jsx
class TweetForm extends React.Component {

  setRef = (node) => this.inputField = node

  handleSubmit = () => alert(this.inputField.value);
  
  render() {
    return (
      <div>
        <input type="text" ref={this.setRef}/>
        <br />
        <button onClick={this.handleSubmit}>Tweetuj!</button>
      </div>                    
    )
  }
}

ReactDOM.render(<div>
  <TweetForm />
  <TweetList tweets={TweetData} />                
</div>, document.getElementById('root'));   
```

<iframe src="https://codesandbox.io/embed/kov9lw6q3o" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Poza zastosowaniem w formularzach, referencje przydatne są wszędzie tam, gdzie potrzebujemy odczytać / zmienić wartości bezpośrednio w DOM, przykładowo w celu pobrania wymiarów czy pozycji elementu.

## referencje na komponent

Referencje mogą wskazywać także na komponent - np. `<TweetForm ref={el => this.form = el} />` dzięki czemu uzyskamy dostęp do instancji danego komponentu (a nie jego HTML!) i możemy odczytać jego prywatne dane. Rozwiązanie takie nie jest jednak typowym i nie powinno być stosowane w celu zapewnienia komunikacji między komponentami.

## findDOMNode

Drugim z rozwiązań jest użycie funkcji `ReactDOM.findDOMNode`, która jako parametr akceptuje komponent (np. `this`) i zwraca nam główny węzeł DOM zwrócony przez `render()`. Jeżeli komponent renderuje tablicę elementów, zwrócona zostanie referencja do pierwszego elementu tablicy.
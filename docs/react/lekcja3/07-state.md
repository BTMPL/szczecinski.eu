---
title: Stan komponentu
---

W jednym z poprzednich rozdziałów poznaliśmy komponenty stanowe, które poza tym, że są zapisane jako klasa, posiadają właśnie ów stan. Stan komponentu to obiekt, zawierający informacje opisujące dane, jakie w danym momencie powinien reprezentować obiekt, a kiedy dane te ulegną zmianie, React automatycznie ponownie wyrenderuje komponent.

Stwórzmy zatem prosty komponent, pozwalający na tworzenie nowych Tweetów - `TweetForm`.

Nasz nowy komponent opisany będzie przez klasę, do której dodamy nowe pole - `state`.

Jak już wiemy, stan komponentu to zwykły obiekt JS, zdefiniujmy więc w nim pole `text` w którym będziemy przetrzymywać tekst naszego Tweetu. Wyrenderujmy też nasz stan jako domyślną zawartość pola tekstowego, w którym tworzyć będziemy nasze Tweety.

Kiedy uruchomimy aplikację, strona wyrenderuje się z nowym - pustym formularzem. Zmień w kodzie stan:

```
state = { text: 'test' }
```

aby sprawdzić, czy wszystko działa OK - strona powinna odświeżyć się i pokazać nową zawartość.

```jsx
class TweetForm extends React.Component {

  state = {
    text: ''
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.text} />
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

Kolejnym etapem jest pobranie zawartości po jej zmianie. Jak zapewne pamiętacie, React sugeruje jednokierunkowy przepływa danych, więc kiedy wpiszemy treść do pola tekstowego wartość zmiennej `this.state.text` nie ulegnie zmianie. By pobrać wartość skorzystamy ze poznanych we wcześniejszym rozdziale zdarzeń.

```jsx
  handleChange = (event) => {
    console.log(event.target.value);
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} value={this.state.text} />
        <br />
        <button>Tweetuj!</button>
      </div>                    
    )
  }
```

## Aktualizacja stanu komponentu

Teraz, kiedy wpisujemy tekst w nasze pole możemy obserwować jego wartość w konsoli! Połowiczny sukces! My znamy już wartość, nasz komponent jeszcze nie! Musimy zatem zaktualizować stan komponentu.

Tutaj pojawia się kolejna ważna rzecz w React - o ile nie jesteśmy w pełni świadomi konsekwencji nie powinniśmy nigdy mutować danych - zarówno zmiennych aplikacji jak i stanu komponentu. Nigdy nie próbujmy bezpośrednio zmienić wartości stanu, np. poprzez pisanie do zmiennej: `this.state.text = e.target.value;`. Jeżeli tak zrobimy, stracimy jedną z podstawowych cech komponentu stanowego - automatyczne re-renderowanie.

Zamiast tego posłużymy się metodą, którą przygotowali dla nas twórcy React - `this.setState()` - która domyślnie jako parametr przyjmuje obiekt danych, które uległy zmianie. Dane te następnie łączone są z aktualnym stanem, a komponent ponownie renderowany.

Zmieńmy zatem nieco nasz komponent (i tymczasowo dodajmy podgląd, aby widzieć zachodzącą w stanie zmianę).

Do naszego handlera `handleChange` dodajemy wywołanie `this.setState`, które jako parametr otrzymuje obiekt ze zmienionymi wartościami. Jeżeli nasz komponent poza tekstem przechowywał by też inne dane w swoim stanie, a my chcieli byśmy zmienić jedynie tekst, nie musimy przekazywać ponownie całego stanu (nie zmienionych elementów) a jedynie obiekt zawierający pole `text`.

Po wpisaniu treści pojawi się dodatkowy paragraf zawierający podgląd wpisywanego Tweetu. Po sprawdzeniu, że rzeczywiście się tak dzieje możemy go usunąć.

```jsx
  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <input type="text" onChange={this.handleChange} value={text} />
        <br />
        <button>Tweetuj!</button>
        {text && <p>Podgląd: {text}</p>}
      </div>                    
    )
  }
```

Funkcja `setState` posiada też drugą formę, w której jako pierwszy parametr możemy przekazać funkcję, która w momencie aktualizacji stanu zostanie wywołana z jego aktualną wartością. Przydaje się to głównie w przypadku modyfikowania stanu w oparciu o jego aktualną wartość (np. zwiększenie o 1, lub dodanie do tablicy).

W przypadku, kiedy użyli byśmy poprzedniej notacji, dane mogły by być nieprawidłowe w wyniku optymalizacji (batching akcji) React:

```jsx
this.setState({ value: this.state.value + 1});
this.setState({ value: this.state.value + 1});
this.setState({ value: this.state.value + 1});              
// spowoduje zwiększenie wartości this.state.value o 1

this.setState((state) => ({ value: state.value + 1}));
this.setState((state) => ({ value: state.value + 1}));
this.setState((state) => ({ value: state.value + 1}));
// spowoduje zwiększenie wartości this.state.value o 3  
```

## Asynchroniczna natura stanu

Należy pamiętać, że funkcja `setState` jest asynchroniczna, dlatego odwołanie się do `this.state` zaraz po jej wywołaniu zwróci nam starą wartość stanu.

Aby uzyskać dostęp do zmodyfikowanego stanu, mozemy użyć drugiego argumentu funkcji - callbacku, który wywołany zostanie po tym jak stan zostanie faktycznie zaktualizowany.

```jsx
// zakładając this.state.value = 0;

this.setState({
  value: 1
}, () => {
  console.log(this.state.value); // wartość "1"
});
console.log(this.state.value); // wartość "0"
```
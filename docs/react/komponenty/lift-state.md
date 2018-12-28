---
title: Przekazywanie danych do rodzica i rodzeństwa
---

Wiemy już jak przekazywać dane od rodzica do dziecka - używamy w tym celu props. Mechanizm ten przyda nam się także do przekazywania danych w drugą stronę - od dziecka do rodzica. Zanim poznamy sposób, spójrzmy na problem, jaki pozwoli nam to rozwiązać w naszej aplikacji.

Aktualnie aplikacja składa się z 2 głównych komponentów - `TweetForm` oraz `TweetList`. Komponenty te nie są ze sobą w relacji rodzic-dziecko, więc w jaki sposób mogą się ze sobą komunikować? Standardowym sposobem jest **podniesienie stanu wyżej (ang. lift the state up).**

Naszym rozwiązaniem jest stworzenie jednego wspólnego rodzica, który przetrzymywał będzie stan dla swoich dzieci oraz pomagał im w komunikacji.

Utwórzmy komponent `TweetApp`, który stanowił będzie trzon naszej aplikacji - będzie on przetrzymywał informację o Tweetach oraz renderował wszystkie podległe elementy.

Komponent ten otrzyma jako props listę utworzonych na sztywno Tweetów i w konstruktorze przepisze ją sobie do swojego wewnętrznego stanu. Rozwiązanie takie pozwoli nam w kolejnym kroku zmodyfikować stan (np. dodając nowy tweet) i odświeżyć listę.

```jsx
class TweetApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tweets: this.props.tweets
    }
  }

  render() {
    return (
      <div>
        <TweetForm />
        <TweetList tweets={this.state.tweets} />                
      </div>
    )
  }
}
ReactDOM.render(<TweetApp tweets={TweetData} />, document.getElementById('root'));
```

Kolejnym krokiem jest przekazanie danych w drugą stronę - z formularza `TweetForm` do rodzica - `TweetApp`. W tym celu rodzic musi przekazać do swojego dziecka wywołanie zwrotne (ang. callback) jako props, zaś dziecko powinno wywołać ów callback przekazując do niego dane.

Nasz komponent `TweetForm` posiada guzik, który oznacza, że zakończyliśmy tworzenie wiadomości, więc dodajmy do niego obsługę zdarzenia `onClick`, które pośrednio wywoła przekazany handler `this.props.onSubmit`.

Po wpisaniu treści i przyciśnięciu klawisza dane z komponentu zostaną przekazane w górę - do rodzica - a następnie wyświetlone w oknie alertu.

Dodatkowo, ponieważ używamy kontrolowanego formularza zmieniając `this.state.text` na pusty string po przesłaniu danych usuwamy tekst wpisany w pole.

## Częste błędy

Programiści, który dużo pracowali z HTML i JS mogą z rozpędu użyć zapisu:

```jsx
<button onClick={this.handleSubmit()}>Tweetuj!</button>
```

jednak przekonają się, że kod ten wywołany jest od razu, a co gorsze, wywoływany jest za każdym razem, kiedy komponent ponownie się wyrenderuje. Do handlerów zdarzeń powinniśmy przekazywać zawsze wskaźnik na funkcję (lub samo wyrażenie funkcji), powyższy przykład wpierw wywoła funkcję `this.handleSubmit` a wartość, którą zwróci przekaże do handlera `onClick`.

```jsx
class TweetForm extends React.Component {

  state = {
    text: ''
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.text);
    this.setState({ text: '' });
  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <input type="text" onChange={this.handleChange} value={text} />
        <br />
        <button onClick={this.handleSubmit}>Tweetuj!</button>
      </div>                    
    )
  }          
}


class TweetApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tweets: this.props.tweets
    }
  }

  addTweet = (text) => {
    alert(text);
  }

  render() {
    return (
      <div>
        <TweetForm onSubmit={this.addTweet} />
        <TweetList tweets={this.state.tweets} />                
      </div>
    )
  }
}
```

Ostatnie, co musimy zrobić to zaktualizować stan rodzica, dodając do niego nowy tweet. W tym celu używamy oczywiście metody`this.setState`. Upewnijmy się od razu, że dodawany przez nas Tweet ma odpowiednie - unikalne - `id` oraz, że umieszczony został na początku listy Tweetów.

```jsx
  addTweet = (text) => {
    const newTweet = {
      id: this.state.tweets.length + 1,
      user: {
        name: "Bartosz Szczeciński",
        handle: "btmpl"
      },
      date: new Date(),
      text: text
    }

    this.setState((state) => ({
      tweets: [newTweet, ...state.tweets]
    }));
  }
```
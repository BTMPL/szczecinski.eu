---
title: propTypes i defaultProps
---

## propTypes

React pozwala na określanie tego jakie poperty jest w stanie obsłużyć nasz komponent - możemy określić zarówno ich nazwy jak i typy. Wyczerpujące informacje na temat wszystkich możliwych wspieranych typów znajdziesz na stronie projektu [prop-types](https://github.com/facebook/prop-types).

Zdefiniujmy domyślne props dla naszych komponentów.

Nasz komponent `TweetTime` będzie od teraz wymagał przekazania instancji `Date`, `TweetUser` będzie oczekiwał przekazania nicku (handle), ale imię (name) jest już opcjonalne, zaś `Tweet` będzie oczekiwał obiektu o określonej strukturze.

Warto mieć na uwadze, że mechanizm PropTypes jest tylko sugestią - jest on jedynie używany jeżeli aplikacja działa w trybie developerskim, a nawet jeżeli przekażemy złe wartości nie spowoduje to zatrzymania aplikacji a jedynie komunikat w konsoli. PropTypes powinny być używane jako rodzaj dokumentacji komponentu, ale są także używane przez auto-podpowiadanie składni w wielu popularnych edytorach kodu.

## defaultProps

Dodatkowo, dla komponentu `TweetUser` zdefiniowaliśmy wartość domyślną propsu `name` na "Anonim". Jeżeli nie przekażemy żadnej wartości (lub przekażemy jawnie `undefined`) zostanie użyta właśnie wartość domyślna.

Definiowanie wartości domyślnych ma sens głównie dla propsów, których nie oznaczyliśmy jako `isRequired`, ale warto zdefiniować je też dla pozostałych, ponieważ mimo iż developer upewnił się, że dane te są przekazywane, czasem może ich po prostu brakować z powodu błędu w API etc.

```jsx
import PropTypes from "prop-types";

const TweetTime = (props) => {
  const date = `${props.date.getDate()} ${props.date.toLocaleString('pl-pl', { month: "long" })}`;
  return <time>{date}</time>
};
TweetTime.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
};

const TweetUser = ({ name, handle }) => <span><b>{name}</b> @{handle}</span>;
TweetUser.propTypes = {
  handle: PropTypes.string.isRequired,
  name: PropTypes.string  
};
TweetUser.defaultProps = {
  name: 'Anonim'
};

class Tweet extends React.Component {

  render() {
    const { user, text, date } = this.props.tweet;
    return (
      <div>
        <TweetUser name={user.name} handle={user.handle} /> -
        <TweetTime date={date} />
        <p>
          {text}
        </p>
      </div>
    )
  }
}

Tweet.propTypes = {
  tweet: PropTypes.shape({
    user: PropTypes.shape({
      handle: PropTypes.string.isReqired,
      name: PropTypes.string,
    }),
    date: PropTypes.instanceOf(Date).isRequired,
    text: PropTypes.string.isRequired
  })
} 
```


## Alternatywna notacja

Jeżeli używasz CRA lub dodałeś do projektu preset [babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) możesz używać alternatywnego, krótszego zapisu PropTypes dla komponentów stanowych.

Opiera on się o nowy typ pola danych - `static` ale w praktyce wciąż transpilowany jest na poprzednią notację.

```jsx
class Tweet extends React.Component {

  static propTypes = {
    tweet: PropTypes.shape({
      user: PropTypes.shape({
        handle: PropTypes.string.isReqired,
        name: PropTypes.string,
      }),
      date: PropTypes.instanceOf(Date).isRequired,
      text: PropTypes.string.isRequired
    })
  } 

  render() {
    const { user, text, date } = this.props.tweet;
    return (
      <div>
        <TweetUser name={user.name} handle={user.handle} /> -
        <TweetTime date={date} />
        <p>
          {text}
        </p>
      </div>
    )
  }
}     
```
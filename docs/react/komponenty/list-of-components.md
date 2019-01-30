---
title: Listy komponentów
---

W jednym z poprzednich ćwiczeń wyrenderowaliśmy wiele kopii elementu `Tweet` umieszczając go wielokrotnie w kodzie JSX oczywiście rozwiązanie takie nie sprawdzi się w przypadku, kiedy lista elementów jest dynamiczna i chcemy wyrenderować je wszystkie.

W składni JSX możemy zwrócić, albo osadzić tablicę elementów, co pomoże nam rozwiązać ten problem. Zacznijmy od prostego rozwiązania renderującego tablicę komponentów `Tweet`. W tym celu stworzymy prosty komponent `TweetList`.

Przykład ten zadziała dokładnie tak jak oczekujemy i wyrenderuje trzy kopie tego samego elementu `Tweet`, jednak jeżeli zajrzymy do konsoli zobaczymy, że React wygenerował komunikat błędu informujący o braku unikatowego propu `key` na każdym z elementów tablicy.

```jsx
Warning: Each child in an array or iterator should have a unique "key" prop.
```

```jsx
const TweetList = () => {
  const tweets = [
    <Tweet tweet={TweetData} />,
    <Tweet tweet={TweetData} />,
    <Tweet tweet={TweetData} />,
  ];
  
  return (
    <div>
      {tweets}
    </div>
  );
}

ReactDOM.render(<TweetList />, document.getElementById('root')); 
```

## Znaczenie kluczy

W celu optymalizacji wydajności, przy każdym renderowaniu komponentu React stara się nie usuwać i tworzyć nowych elementów DOM i kiedy to możliwe wykorzystuje już istniejące elementy. W przypadku tablic, których zawartość może ulegać zmianie (wartości są zmieniane, elementy są dodawane i usuwane) React potrzebuje odrobiony pomocy ze strony developera w określeniu który element DOM należy zaktualizować, jeżeli dane w tablicy zmieniły się, a który usunąć. W innym wypadku DOM i VDOM mogły by ulec desynchronizacji i nasze UI nie odzwierciedlało by stanu aplikacji.

Aby zapobiec takim sytuacjom, w momencie kiedy w JSX renderowana jest kolekcja (tablica) developer musi do każdego jej elementu przekazać jawnie prop `key`. Zaktualizujmy zatem nasz komponent generujący listę.

Musimy mieć na uwadze, aby:

*   klucze były stringami
*   były unikalne w skali wspólnego rodzica
*   były "stałe" - nie powinnyśmy generować ich losowo (np. używając `Math.random()`) w czasie renderowania
*   nie ulegały zmianie podczas kolejnych renderowań tablicy - indeks elementu tablicy powinniśmy używać tylko w ostateczności!

```jsx
const TweetList = () => {
  const tweets = [
    <Tweet tweet={TweetData} key="tweet1" />,
    <Tweet tweet={TweetData} key="tweet2" />,
    <Tweet tweet={TweetData} key="tweet3" />,
  ];
  
  return (
    <div>
      {tweets}
    </div>
  );
}
```

Nasza aplikacja generuje już listę Tweetów, ale nie działa to jeszcze tak, jakbyśmy chcieli. Dane o Tweetach pobiera on z aplikacji, a powinien otrzymywać jako parametr, a sama lista - mimo, że jest tablicą - wciąż nie jest w żaden sposób dynamiczna.

Zmieniliśmy nieco strukturę naszej zmiennej `TweetData` - jest to teraz tablica zawierająca dane 2 Tweetów, a same dane wzbogaciliśmy o klucz `id`, który stanowić będzie nasz `key` dla renderowanej kolekcji Tweetów.

Zmianie uległ też sam komponent `TweetList` - teraz przyjmuje on kolekcję obiektów (Tweetów) i renderuje ją, nadając każdemu elementowi odpowiedni `key`.

```jsx
const TweetData = [{
  id: 1,
  user: {
    name: "Bartosz Szczeciński",
    handle: "btmpl"
  },
  date: new Date(),
  text: "Witaj świecie!"
}, {
  id: 2,
  user: {
    name: "Bartosz Szczeciński",
    handle: "btmpl"
  },
  date: new Date(),
  text: "To jest mój prywatny Twitter!"
}];
              
const TweetList = ({ tweets }) => {                
  return (
    <div>
      {tweets.map(item => <Tweet tweet={item} key={item.id} />)}
    </div>
  );
}   
TweetList.propTypes = {
  tweets: PropTypes.arrayOf(PropTypes.object)
}

ReactDOM.render(<TweetList tweets={TweetData} />, document.getElementById('root'));
```

<iframe src="https://codesandbox.io/embed/1y6yowov6q" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
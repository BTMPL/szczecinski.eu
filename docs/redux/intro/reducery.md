---
title: Reducery
---

Reducer to czysta funkcja, która wywołana z aktualnym stanem oraz akcją przeprowadza odpowiednie modyfikacje i zwraca nowy stan. Jeżeli reducer nie wie w jaki sposób obsłużyć daną akcję, powinien zwrócić niezmodyfikowany stan.

Redux nakłada na nas dwa ograniczenia:

- nie powinniśmy mutować otrzymanego stanu
- reducer nie może zwrócić wartości `undefined` (ale może `false`, `null` etc.)

Dobrym zwyczajem jest zadeklarowanie domyślnego (początkowego) stanu i przekazanie go do argumentu jako wartość domyślna.

```js
const initialState = 0;
const reducer = (state = initialState, action) => {
  return state;
}
```

Powyższy reducer nie obsługuje żadnej akcji; wywołany ze stanem i dowolną akcją zwraca aktualny stan. Częstym zapisem (przydatnym tylko w małych reducerach) jest zapisanie logiki jako `switch`:

```js
// zmienna INCREMENT_COUNTER pochodzi z poprzedniego rozdziału - Akcje

const initialState = 0;
export const reducer = (state = initialState, action) => {
  /**
   * Akcja to obiekt z właściwością `type`, dlatego nie musimy 
   * sprawdzać, czy `action` to rzeczywiście obiekt
   */
  switch(action.type) {
    case INCREMENT_COUNTER:
      return state + action.by;
    default:
      return state;
  }
}
```

Jako że reducer jest zwykłą funkcją, możemy przetestować go bez inicjacji całego Reduxa:

```js
const newState = reducer(undefined, {
  type: INCREMENT_COUNTER,
  by: 10
});
console.log(newState); // "10";

const newState2 = reducer(newState, {
  type: INCREMENT_COUNTER,
  by: 5
});
console.log(newState); // "10";
console.log(newState2); // "15"
console.log(newState === newState2); // "false"

const newState3 = reducer(newState2, {
  type: "UNKNOWN ACTION",
  by: 5
});
console.log(newState3); // "15"
console.log(newState2 === newState3); // "true"
```

<iframe src="https://codesandbox.io/embed/lrm16p0mm" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Przypomnijmy sobie założenia reducerów:

- reducer nie powinien mutować oryginalnego stanu - dlatego `console.log(newState)` i `console.log(newState2)` pokazują wartości, których się spodziewamy
- jeżeli reducer nie wie, jak obsłużyć daną akcję, zwraca stan, z którym został wywołany, dlatego `newState3` jest tym samym, co `newState2`

## Praca ze złożonymi typami danych

Ponieważ nie powinniśmy modyfikować stanu, który otrzymujemy, poniższy zapis jest błędny.

> Uwaga - poniższy kod jest celowo błędny! Nie stosuj tego zapisu w swojej aplikacji!

```js
const collectionReducer = (state = [], action) => {
  switch(action.type) {
    case ADD_ITEM_TO_COLLECTION:
      state = state.push(action.item);
      return state;
    default:
      return state;
  }
}
```

Zamiast tego powinniśmy używać nie mutujących funkcji, np.:

```js
    case ADD_ITEM_TO_COLLECTION:
      return state.concat(action.item);
```

Analogiczna sytuacja ma miejsce w przypadku kiedy chcemy podmienić (zaktualizować) elementy tablicy, obiektów etc. Należy użyć metod takich jak `Array.prototype.map`, `Object.assign`.

## Obawy o wydajność

Przeczytawszy powyższy paragraf możemy zacząć obawiać się o wydajność naszych aplikacji - w końcu po każdej akcji, którą obsługuje reducer, tworzona jest nowa kopia obiektu, co powoduje zajęcie zasobów użytkownika etc. Sytuacja ta może wydać się jeszcze bardziej groźna w wypadku, kiedy zmieniamy jeden element w tablicy zawierających setki obiektów. Wyobraźmy sobie sytuację, gdzie w kolekcji 100 postów chcemy zmienić właściwości `isRead` jednego z nich:

```js
return state.map((post, idOfPost) => {
  if (idOfPost === post.id) {
    return Object.assign({}, post, { isRead: true });
  }
  else {
    return post;
  }
});
```

Przy 100 postach może wydawać się, że zmieniając dane tylko w jednym stworzyliśmy kopię 100. Nie tak jednak działa JavaScript - w tym przypadku utworzona zostaje kopia tablicy, zawierająca referencje (w uproszczeniu, wskaźniki do miejsca gdzie w RAM przechowywane są dane) do 99 starych obiektów postu i jeden nowy obiekt - ten, który zmodyfikowaliśmy. Odpowiednio zaprojektowana aplikacja sama wykryje, że zmiana zaszła tylko w jednym elemencie i np. nie wyrenderuje ponownie tych, które pozostały niezmienione.

## Notacja mapy typów akcji

Jak można się domyśleć, wraz ze wzrostem ilości akcji, które nasz reducer "umie" obsłużyć, zapis `switch` staje się co raz mniej czytelny. Popularną formą zastępującą te notację jest mapa akcji:

```js
const incrementActionHandler = (state, action) => state + action.by;
const decrementActionHandler = (state, action) => state - action.by;
const resetHandler = () => 0;

const initialState = 0;
export const reducer = (state = initialState, action) => {
  const actionMape = {
    INCREMENT_COUNTER: incrementActionHandler,
    DECREMENT_COUNTER: decrementActionHandler,
    RESET_COUNTER: resetHandler
  };

  if (actionMap[action.type]) return actionMap[action.type](state, action);

  return state;
}
```
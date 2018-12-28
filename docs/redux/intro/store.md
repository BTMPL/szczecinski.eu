---
title: Store
---

Store jest kluczowym elementem Reduxa, jednym z niewielu, jakie tworzy API Reduxa. To w store przechowywane są dane, to "do" store emitowane są akcje i to store obsługuje bardziej złożone mechanizmy jak middleware i enchancery.

Store tworzone jest poprzez wywołanie funkcji `createStore` i przekazanie do niej naszego reducera:

```js
import { createStore } from 'redux';

const store = createStore(reducer);
```

W efekcie uzyskujemy obiekt, który zawiera kilka metod. Do poprawnej pracy wystarczy poznać 3 z nich:

## dispatch

Funkcja `dispatch(Object)` pozwala na "wyemitowanie" akcji do store, co w efekcie spowoduje wywołanie reducerów i zaktualizowanie stanu aplikacji:

```js
store.dispatch(incrementCounter(10));
```

Funkcja `dispatch` oczekuje, że wywołana zostanie z obiektem akcji - w przeciwnym wypadku w konsoli wyświetlony zostanie stosowny komunikat. Istnieje wiele możliwości obejścia tego ograniczenia, więcej na ten temat dowiesz się z sekcji o middleware.

Wywołanie `store.dispatch` z akcją, jest jedynym sposobem na przekazanie jej do Reduxa w celu aktualizacji stanu. Częstą pomyłką osób zaczynających przygodę z reduxem jest po prostu wywołanie kreatora akcji:

> Uwaga - poniższy kod jest celowo błędny! Nie stosuj tego zapisu w swojej aplikacji!

```js
incrementCounter(10);
```

## subscribe

Funkcja `subscribe(Function)` pozwala na zasubskrybowanie informacji o zdarzeniu zmiany stanu. Jako zwróconą wartość otrzymujemy funkcję, pozwalającą na przerwanie subskrypcji. 

```js
const unsubscribe = store.subscribe(() => {
  // akcja została przetworzona przez wszystkie reducery
  // i stan Reduxa został najprawdopodobniej zaktualizowany
});

// kiedy nie potrzebujemy już subskrybować informacji o zmianie stanu:
unsubscribe();
```

> Zarejestrowany callback jest wywoływany bez żadnego argumentu.

## getState

Funkcja `getState` pozwala nam na pobranie aktualnego store - możemy wywołać ją w dowolnym momencie, wszędzie tam, gdzie posiadamy referencję do store. Najczęściej stosowana jest w callbacku `store.subscribe`:

```js
store.subscribe(() => {
  // stan został najprawdopodobniej zaktualizowany
  const value = store.getState();
  console.log('Nowa wartość: ' + value);
});
```
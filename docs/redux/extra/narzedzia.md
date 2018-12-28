---
title: Narzędzia
---

## Redux Devtools Extension

Najpopularniejszym i najprzydatniejszym narzędziem jakie powinniśmy dodać do naszego projektu jest niewątpliwie [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) składające się z 2 części: enhancera oraz UI (występującego albo w postaci dodatku do naszego projektu, albo jako rozszerzenie do przeglądarki - zdecydowanie polecam to drugie).

Enhancery to mechanizm pozwalający na dodanie nowych możliwości do samego store - jest to potężniejsza wersja middleware.

Narzędzie to pozwala nam na:

- obserwowanie dispatchowanych akcji, stanu po każdej z nich oraz diffu poprzedniego i aktualnego stanu,
- przeskakiwanie pomiędzy akcjami (wstecz, do przodu),
- zapisywanie historii akcji jako plik `.json` i jego wczytywanie w innej przeglądarce,
- ręczne dispatchowanie akcji

### Instalacja

Narzędzie to nie wymaga instalacji żadnych pakietów npm (zakładając, że używamy wersji dla przeglądarek) a jedynie konfiguracji naszego store.

Jeżeli nie używamy żadnych innnych enhancerów ani middleware, wystarczy że wywołamy:

```js
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
```

Jeżeli używamy jakieś middleware:

```js
import { createStore, applyMiddleware, compose } from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk, invariant)
));
```

Następnym krokiem powinna być instalacja rozszerzenia dla naszej przeglądarki:

- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- [Electron](https://github.com/GPMDP/electron-devtools-installer)
- [inne](https://github.com/zalmoxisus/remote-redux-devtools)

### Używanie

Jeżeli całość przebiegła pomyślnie w przeglądarce pojawi się nowa ikona rozszerzenia, a po kliknięciu w nią pojawi się UI:

!["Redux devtools"](assets/redux-devtools.png)
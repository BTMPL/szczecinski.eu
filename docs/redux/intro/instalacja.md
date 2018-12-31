---
title: Instalacja
---

Redux dystrybuowany jest w postaci jednej paczki, zawierającej liczne nazwane eksporty. Aby dodać ją do swojego projektu wywołaj polecenie:

```bash
npm install redux
```

W pakiecie znajdują się źródła oraz biblioteka skompilowana do formatu ES6 oraz ES Modules. Ponieważ zminifikowana wersja to około 6kB nie musisz martwić się o tree shaking i inne mechanizmy zminiejszające kod.

Jeżeli w swoim środowisku nie używasz bundlera, możesz użyć kopii skompilowanej do formatu UMD, np. z usługi unpkg.com:

```html
<script src="https://unpkg.com/redux@4.0.1/dist/redux.min.js"></script>
```

Po dodaniu zasobu w ten sposób, domyślny eksport będzie dostępny jako `window.Redux`
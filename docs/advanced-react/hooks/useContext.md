---
title: useContext
---

`useEffect` jest prostym, ale potężnym i przydatnym mechanizmem - pozwala on komponentom opartym o funkcje na dostęp do kontekstu, bez konieczności implementacji wzorca Render Props i owijania komponentów w Consumery. Dodatkowo, w odróżnieniu od `contextType` komponent może korzystać z wielu kontekstów.

Hook ten musimy zainicjować z kontekstem - nie z Providerem czy Consumerem, ale całym obiektem, uzyskanym z `React.createContext`.

Powróćmy zatem do naszego przykładu użycia kontekstu i zamieńmy komponenty tłumaczenia na używający `useContext`:

```jsx
import React, { useContext } from "react";

import Context from "./TranslationContext";

export default props => {
  const translationContext = useContext(Context);
  return translationContext.labels[props.label];
};
```

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/l7krlv419z" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

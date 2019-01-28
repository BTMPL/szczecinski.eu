---
title: Własne hooki
---

React umożliwia także tworzenie własnych Hooków, dzięki czemu jesteśmy w stanie usunąć logikę z naszych komponentów - będą one odpowiedzialne tylko za wygląd UI - i współdzielić ją między wieloma komponentami. Hooki takie możemy również udostępniać tak samo jak inne aplikacje / komponenty np. za pomocą npm. Dużą kolekcję Hooków stworzonych przez użytkowników React znajdziecie na stronie [useHooks.com](https://usehooks.com/).

## Tworzenie własnych Hooków

W celu utworzenia własnego Hooku musimy zadeklarować go jako funkcja zaczynająca się od słowa `use` - w ten sposób React odróżnia Hooki od zwykłych funkcji i zapewnia, że wszystkie związane z nimi mechanizmy będą działać poprawnie.

Hooki są też drugim z miejsc, w którym możemy wywoływać inne Hooki, dzięki czemu mogą one np. zawierać swój własny stan, albo efekty.

### Przykład 1: Pobieranie danych

Utwórzmy zatem prostą aplikację, wyświetlającą wszystkie Githubowe repozytoria użytkownika:

```jsx
const InputForm = props => {
  const [value, setValue] = useState("");
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button disabled={!value} onClick={() => props.onSubmit(value)}>
        Szukaj
      </button>
    </div>
  );
};

const App = () => {
  const [userName, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  useEffect(
    () => {
      if (!userName) return;
      fetch("https://api.github.com/users/btmpl/repos")
        .then(response => response.json())
        .then(repositories => {
          setRepositories(repositories);
        });
    },
    [userName]
  );

  return (
    <div>
      <InputForm onSubmit={setUsername} />
      <ul>
        {repositories.map(item => (
          <li key={item.full_name}>{item.full_name}</li>
        ))}
      </ul>
    </div>
  );
};
```

Opierając się na naszych dotychczasowych informacjach, utworzyliśmy oddzielny komponent przechowujący nazwę użytkownika i oddzielny, odpowiedzialny za logikę pobierania i wyświetlania danych. Rozwiązanie takie jest niestety mało elastyczne - jeżeli potrzebowali byśmy wyświetlać dane w innej formie lub w innym komponencie konieczne było by kopiowanie tam całego kodu `useEffect` i skojarzonego z nim stanu.

Rozwiązujemy to wprowadzając nowy, własny Hook - `useGithub`:

```jsx
const useGithub = () => {
  const [userName, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);

  useEffect(
    () => {
      if (!userName) return;
      fetch("https://api.github.com/users/btmpl/repos")
        .then(response => response.json())
        .then(repositories => {
          setRepositories(repositories);
        });
    },
    [userName]
  );

  return [setUsername, repositories];
};

const App2 = () => {
  const [doSearch, repositories] = useGithub();
  return (
    <div>
      <InputForm onSubmit={doSearch} />
      <ul>
        {repositories.map(item => (
          <li key={item.full_name}>{item.full_name}</li>
        ))}
      </ul>
    </div>
  );
};
```

Teraz nasz komponent `App` nie jest już w żaden sposób obarczony logiką pobierania danych z Github - w każdym momencie możemy podmienić wewnętrzną logikę `useGithub` oraz współdzielić ją z innymi komponentami / Hookami.

### Przykład 2: Obsługa formularzy

inny przydatny przykład, to Hook pozwalający na łatwą obsługę pól formularza, np. aby utworzyć re-używalnego Hooka dla pól tekstowych (numerycznych, email etc.):

```jsx
const useInput = defaults => {
  const [value, updater] = useState(defaults.value || "");

  return {
    props: {
      type: "text",
      ...defaults,
      onChange: e => updater(e.target.value)
    },
    value
  };
};

const App = () => {
  const name = useInput({
    placeholder: "Wpisz imię",
    required: true
  });
  const email = useInput({
    type: "email",
    placeholder: "Wpisz swój e-mail",
    required: true
  });
  return (
    <form onSubmit={_ => false}>
      <input {...name.props} />
      <input {...email.props} />
      <p>
        Wpisana wartość: {name.value} {email.value}
      </p>
      <input type="submit" />
    </form>
  );
};
```

Utworzony w ten sposób Hook pozwala na opisanie wartości domyślnych dla elementu `<input />`. Zwracana przez niego wartość, to obiekt, zawierający wartość pola, oraz obiekt atrybutów, które powinniśmy przekazać do naszego elementu HTML. Oczywiście rozszerzenie Hooka o obsługę pól typu checkbox czy radio jest również możliwe.

## Kompletny przykład

<iframe src="https://codesandbox.io/embed/20ml6o0yzn" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

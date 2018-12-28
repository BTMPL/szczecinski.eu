---
title: Wymiana danych - AJAX
---

React nie posiada zbudowanych mechanizmów pozwalających na komunikację z backendami w celu pobrania lub wysłania danych - developer może dowolnie dobrać rozwiązanie pasujące do jego wymagań. Może być to komunikacja za pomocą AJAX (tutaj najczęściej używany jest `fetch` lub `axios`), sockety (np. `socket.io`) czy GraphQL.

W naszej aplikacji wdrożymy rozwiązanie oparte o AJAX i używające wbudowanej w przeglądarki funkcji `fetch`

Przed przystąpieniem do integracji musimy zdać sobie sprawę z jednej ważnej rzeczy - w React nie ma możliwości aby komponent sam z siebie wstrzymał się z renderowaniem do momentu, aż dane zostaną pobrane. Nasze komponenty powinny być skonstruowane tak, by móc obsłużyć stan braku danych (a idealnie stany takie jak "dane nie pobrane", "brak danych dla zapytania", "dane pobrane").

Kolejną wynikającą z tej sytuacji rzeczą do zapamiętania jest miejsce, w którym inicjujemy żądanie pobrania danych. Jeżeli nie ma możliwości, by dane trafiły do nas przed pierwszym wywołaniem `render()`, nie zyskamy nic z umieszczania go w `contructor`. Dodatkowo przemawia za tym zmiana, jaką wprowadza React Fiber, na skutek której funkcje takie jak `constructor`, `UNSAFE_componentWill` mogą zostać wywołane wielokrotnie przed wywołaniem `render()` - jeżeli tak się stanie, nasze zapytanie AJAX zostanie wysłane wielokrotnie.

Uzbrojeni w tę wiedzę dodajmy do naszej aplikacji pobieranie danych z zewnętrznego serwera. Na potrzeby demonstracji skorzystamy z ogólnodostępnego serwisu [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/).

Pierwszą rzeczą o którą musimy zadbać, to ustawienie `this.state.tweets` na pusty Array. Użyjemy tego by sprawdzić, czy udało nam się już załadować jakieś Tweety z API.

W metodzie `render()` dodajemy nasze sprawdzenie - jeżeli kolekcja tweets jest pusta, wyświetlmy komunikat o braku Tweetów, w przeciwnym wypadku - komponent `<TweetList>`.

Cała logika pobierania danych jak ustaliliśmy wcześniej znajduje się w `componentDidMount()`. Używając funkcji `fetch`( [dokumentacja w MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) ):

1.  pobieramy dane z zewnętrznego serwera
2.  zamieniamy odpowiedź w format JSON
3.  dodajemy wyniki do tablicy `this.state.tweets` dbając o to żeby przyjęły one kształt, jakiego oczekuje nasza aplikacja

Dodatkowo, w naszej metodzie `addTweet` dodajemy przesyłanie danych do serwera i w oparciu o odpowiedź, jaką otrzymujemy na to zapytanie modyfikujemy naszą kolekcję Tweetów - dodajemy nowy Tweet na początek listy (musimy tylko upewnić się, że data, którą otrzymamy od serwera jest obiektem, a nie stringiem).

Rozwiązanie tego typu nazywamy "pesymistycznym aktualizowaniem". Jego przeciwieństwo - "optymistyczne aktualizowanie" - polega na dodaniu elementu do stanu lokalnego i "zaufaniu" że dane dotrą do serwera i zostaną pomyślnie zapisane. Oczywiście możemy zaimplementować też ponawianie niepomyślnych zapytań etc.

### CORS

Przeglądarki implementują mechanizm CORS (ang. Cross Origin Request Security), który aktywowany jest w momencie, kiedy przeglądarka wysyła żądanie AJAX do serwera dostępnego pod inną domeną (sub-domeną, portem lub protokołem). Mechanizm ten ma za zadanie uniemożliwienie złośliwym skryptom na wykonywanie np. połączeń do banków internetowych za pomocą przeglądarki użytkownika, w której mogą znajdować się dane do logowania. Więcej informacji nt. tego mechanizmu znaleźć można [na stronie MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Może zdarzyć się, że podczas łączenia się z API nie będziemy mogli pobrać z niego danych (nawet pomimo tego, że widzimy je w zakładce z połączeniami w naszej przeglądarce). CRA zapewnia nam obejście tego problemu na czas tworzenia aplikacji (z użyciem webpack), ale docelowo będziemy musieli zadbać o to, żeby komunikacja z API była możliwa bez tego rozwiązania. Więcej na temat wbudowanego serwera proxy znajdziesz w [dokumentacji](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development).
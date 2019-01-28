---
title: Wprowadzenie
---

[React Hooks](https://reactjs.org/docs/hooks-intro.html) to nowy mechanizm pozwalający na wdrożenie w komponentach opartych o funkcje niektórych z funkcjonalności, które do tej pory wymagały utworzenia komponentów klasowych, tj. stan komponentu czy wywoływanie operacji w odpowiednich cyklach życia komponentu.

Hooki dostępne są jako seria funkcji w obiekcie `React`. Ich nazwa zawsze zaczyna się od słowa `use`: `useState`, `useEffect` czy `useReducer`.

Dostępne są one **wyłącznie** w komponentach opartych o funkcje i nie ma możliwości wykorzystania ich zarówno w komponentach klasowych i jak i poza komponentami (z wyjątkiem osadzania wewnątrz własnych Hooków).

> #### Uwaga
>
> Hooki dostępne będą w React dopiero od wersji 16.8.0. Jeżeli chcesz skorzystać z nich wcześniej musisz do swojego projektu dodać alphy pakietu react i react-dom: `npm install react@next react-dom@next`

## Motywacja

Motywacją do wprowadzenia tego mechanizmu były:

- zachęcenie do tworzenia mniej złożonych komponentów - trzymanie dużej ilości danych w stanie komponentu nie tylko komplikuje jego mechanikę ale sprawia też, że staje się on trudniejszy do wykorzystywania w innych celach
- zachęcenie do tworzenia re-używalnej logiki - umożliwiając łatwe tworzenie własnych Hooków zachęcamy do wykorzystywania ich w innych częściach aplikacji, często bez konieczności stosowania wzorców takich jak render props czy high order components
- czyste funkcje są łatwiejsze do zrozumienia - dotyczy to zarówno programistów (np. poprzez wyeliminowanie konieczności bindowania funkcji updatujących stan) jak i dla kompilatorów i bundlerów

Mechanizm Hooków - w połączeniu z innymi mechanizmami, tj. Context czy Suspense - zastępuje także dużą ilość przypadków, w których dotychczas stosowali byśmy wzorzec HoC lub render props.

## Adaptacja

Hookie nie zamierzają zastąpić komponentów klasowych poprzez wyeliminowanie tego API - stanowią one dopełnienie komponentów klasowych i umożliwiają przejście z jednej metody tworzenia komponentów na drugą. Jako iż wiele kodu wciąż używać będzie klas przez długi czas polecam mimo wszystko zapoznać się z oboma mechanizmami.

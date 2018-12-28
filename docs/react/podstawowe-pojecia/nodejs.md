---
title: Środowisko NodeJS
---

Kurs przygotowany jest z myślą o użytkownikach systemów Unixowych oraz Windows. Większość poleceń wykonywanych będzie w powłoce, dlatego zaleca się, by czytelnik znał podstawy obsługi odpowiedniej powłoki, zaś użytkownicy Windows używali powłoki bash (np. git-bash.exe)

Pierwszym krokiem powinno być upewnieni się, że w naszym systemie znajduje się środowisko NodeJS. Jeżeli nie, odpowiednie paczki można [pobrać ze strony nodejs.org](https://nodejs.org/en/) lub zainstalować za pomocą managera odpowiedniego dla naszegosystemu.


W następnej kolejności, upewnijmy się, że dysponujemy odpowiednimi wersjami node oraz npm. Najnowsze wersje nie są wymagane, ale na pewno pomagają.

Upewnijmy się więc, że node posiadamy w wersji minimum 7.x, a npm 5.x. Aby uaktualnić npm wystarczy najczęściej wydać 
polecenie `npm install -g npm`

```bash
λ node --version
v7.10.0

λ npm --version
5.4.1
```

## Edytor kodu

React nie posiada dedykowanego środowiska IDE (istnieje co prawda projekt [Nuclide](https://nuclide.io/) dedykowany dla React Native) więc wybór edytora pozostaje preferencją developera. Ze swojej strony polecam świetny i darmowy
edytor [Visual Studio Code](https://code.visualstudio.com/) lub [Atom](https://atom.io/) - 
głównie ze względu na bogate środowisko dodatków i rozszerzeń. Warto upewnić się, że wybrany przez nas edytor posiada wsparcie dla podświetlania nowej składni ES6 oraz JSX.

## Folder projektu

Może wydawać się to oczywiste, jednak wybierając lokację naszego projektu powinniśmy pamiętać o kilku rzeczach, które pozwolą nam uniknąć problemów:

*   nazwa folderu nie powinna zawierać spacji ani znaków specjalnych
*   nazwa folderu nie powinna pokrywać się z nazwami modułów, które będziemy dodawać do projektu
*   na systemach Windows, pamiętaj, by ścieżka folderu nie była zbyt długa - npm potrafi generować głęboką strukturę, a starsze wersje Windowsa posiadają ograniczenie co do długości ścieżki
---
title: Podstawowe pojęcia
---

Przed rozpoczęciem pracy omówmy kilka podstawowych pojęć, którymi będziemy posługiwać się w kursie lub z którymi zetkniesz się pracując z React.

**SPA, single page application** - aplikacje zbudowane z dużym naciskiem na frontend, w którym całość lub większość interakcji odbywa się tylko i wyłącznie po stronie klienta, a dane wymieniane są z serwerem poprzez komunikację API. Strony tego typu nie korzystają ze standardowego modelu zapytanie-odpowiedź w celu pobierania interfejsu użytkownika.

**ECMAScript, ES** - specyfikacja języka skryptowego, którego jedną z implementacji jest JavaScript. Obecnie używa się określeń typu **ES6** lub **ES2015** w celu określeni wersji ECMAScript, której używamy w tworzonym kodzie JavaScript.

**node, nodejs** - środowisko, w którym możliwe jest wykonywanie aplikacji napisanych w języku JavaScript. Pozwala na uruchamianie aplikacji w odseparowaniu od systemu operacyjnego dzięki czemu aplikacje stworzone dla systemów Unixowych działają bez problemu lub z drobnymi modyfikacjami np. na platformie Windows.

**npm, yarn** - ang. *node package manager* menadżery pakietów instalowany wraz z Node. yarn stanowi alternatywę stworzoną przez Facebook. Oba projekty korzystają ze wspólnego repozytorium więc można je stosować naprzemiennie.

**moduł** - aplikacja udostępniona poprzez platformę npm, którą możemy dodać do naszego programu w celu zapewnienia składowej funkcjonalności; jako moduły npm dystrybuowane są także całe niezależne aplikacje, uruchamiane z linii poleceń.

**biblioteka** - kod rozszerzający aplikacje o dodatkową funkcjonalność, nie stanowiący oddzielnej aplikacji i zwykle nie wystarczający do zaspokojenia skomplikowanych założeń biznesowych.

**framework** - samowystarczalny i kompletny zestaw bibliotek, narzędzi i standardów pozwalający na tworzenie aplikacji.

## Pojęcia związane z React

**VDOM** - "wirtualna" reprezentacja DOM, czyli modelu obiektowego strony. W celu optymalizacji ilości operacji zmiany HTML React przeprowadza wszystkie operacja na wirtualnym modelu - aktualizuje go w oparciu o przetworzone dane i porównuje z poprzednią wersją, po czym oblicza jakie elementy HTML należy dodać, usunąć lub zmienić.

**JSX** - język znaczników, który pozwala na opisanie wyglądu i funkcjonalności elementów za pomocą składni przypominającej HTML

**boilerplate** - zaopiniowany zestaw bibliotek, skryptów konfiguracyjnych i wytycznych co do standardów pozwalający na szybkie przystąpienie do realizowania funkcji biznesowych.
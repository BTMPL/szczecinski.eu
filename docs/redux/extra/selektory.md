---
title: Selektory
---

Selektory to funkcje, które otrzymują cały obiekt stanu (lub obiekt stanu konkretnego reducera) i zwracają sekcję, która interesuje dany komponent. Mechanizm ten pozwala na umieszczenie logiki w jednym miejscu i łatwiejszy refactoring, zmniejsza poziom skomplikowania `mapStateToProps` oraz pozwala na wprowadzenie dodatkowej optymalizacji renderowania komponentów.

Selektory nie są mechanizmem oferowanym przez Redux czy react-redux - są to zwykłe funkcje.

## Używanie selektorów w celu uproszczenia kodu

Zakładając następujący stan Reduxa:

```js
{
  todos: [
    {
      id: 1,
      name: "Zapoznać się z kursem React",
      status: "done"
    },
    {
      id: 2,
      name: "Zapoznać się z kursem Redux",
      status: "in-progress"
    },
    {
      id: 3,
      name: "Zapoznać się ze szczegółami na temat selektorów",
      status: "in-progress"
    }
  ]
}
```

za każdym razem, kiedy chcemy wybrać tylko TODO w statusie `in-progress` musielibyśmy pisać:

```js
const mapStateToProps = (state) => {
  return {
    todo: state.filter(item => item.status === "in-progress")
  }
}
```

Jeżeli w strukturze Reduxa albo poszczególnego reducera zaszła by jakakolwiek zmiana, konieczne było by poprawienie wszystkich miejsc, w których użyliśmy powyższego kodu. Dodatkowo, kod ten znajdował by się w pliku komponentu, co prowadzi do przenikania się odpowiedzialności. Zamiast tego możemy utworzyć selektor i zapisać go w pliku z danymi Reduxa:

```js
export const getInProgress = (todos) => {
  return todos.filter(item => item.status === "in-progress");
};

export const getDone = (todos) => {
  return todos.filter(item => item.status === "done");
};
```

a w samym komponencie:

```js
import { getInProgress } from './redux/todo';

const mapStateToProps = (state) => {
  return {
    todo: getInProgress(state.todos)
  }
}
```

## Używanie selektorów z parametryzacją

Selektory, podobnie jak kreatory akcji, mogą być parametryzowane w celu rozszerzenia ich możliwości i zmniejszenia ilości powtarzającego się kodu:

```js
export const getInStatus = (todos, status) => {
  return todos.filter(item => item.status === status);
};

const mapStateToProps = (state) => {
  return {
    todo: getInStatus(state.todos, "in-progess"),
    done: getInStatus(state.todos, "done")
  };
};
```

Parametryzację można także przeprowadzić za pomocą propsów komponentu:

```js
const mapStateToProps = (state, ownProps) => {
  return {
    todo: getInStatus(state.todos, ownProps.status)
  };
};

ReactDOM.render(<TodoList status="in-progress" />, document.getElementById('root'));
```



## `reselect` - polepszanie wydajności

Używanie selektorów do wyboru podzbioru obiektów może prowadzić do zbędnego re-renderowania się komponentu. `connect` sprawdza, czy props przekazane do komponentu są równe propsom przekazanym w poprzednim renderowaniu i jeżeli tak, nie re-renderuje komponentu. Niestety, selektory zwracające nową tablicę (wynik działania `.filter`) powodują, że nawet jeżeli rzeczywiste elementy nie ulegną zmianie, nowa tablica nie będzie równa starej.

Aby zapobiec takiej sytuacji możemy użyć memoizacji danych, np. za pomocą popularnej biblioteki [reselect](https://github.com/reduxjs/reselect). Funkcja `createSelector` z tej biblioteki musi zostać wywołana z minimum 2 funkcjami:

- dowolna ilość funkcji wybierających dane z Reduxa,
- jedna (ostatnia) funkcja przekształcająca dane na oczekiwane przez komponent

Wyniki funkcji zwracających dane są zapamiętywane i jeżeli nie uległy zmianie, funkcja przekształcająca nie jest wywoływana, a zamiast niej zwracana jest przypisana do zapamiętanych danych wejściowych wartość:

```js
import { createSelector } from 'reselect';

const state = {
  todos: [
    {
      id: 1,
      name: "Zapoznać się z kursem React",
      status: "done"
    },
    {
      id: 2,
      name: "Zapoznać się z kursem Redux",
      status: "in-progress"
    },
    {
      id: 3,
      name: "Zapoznać się ze szczegółami na temat selektorów",
      status: "in-progress"
    }
  ]
};

const getInStatus = (state, status) => {
  return state.filter(item => item.status === status);
};

const memoizedInProgress = createSelector(
  // wybierz dane z Reduxa, pełna tabela
  (state) => state.todos,
   // wybierz z danych zwróconych przez poprzednią funkcję interesujące nas dane
  (todos) => {
    console.log("Brak danych w pamięci - przelicz");
    return getInStatus(todos, "in-progress")
  }
);

console.log(memoizedInProgress(state)); // "Brak danych w pamięci - przelicz", "[Object, Object]"
console.log(memoizedInProgress(state)); // "[Object, Object]"
```

<iframe src="https://codesandbox.io/embed/m57zxo341x" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
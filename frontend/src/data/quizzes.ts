import { QuizQuestion } from "@/components/shared/quiz";

export const quizzes: Record<string, QuizQuestion[]> = {
  "what-is-python": [
    {
      id: "1",
      question: "В честь кого назван язык Python?",
      options: [
        "В честь змеи питон",
        "В честь комедийной группы Monty Python",
        "В честь создателя Гвидо Питона",
        "В честь греческого бога",
      ],
      correctIndex: 1,
      explanation: "Гвидо ван Россум назвал язык в честь британской комедийной группы Monty Python, а не в честь змеи!",
    },
    {
      id: "2",
      question: "Какая функция выводит текст на экран в Python?",
      options: ["echo()", "console.log()", "print()", "write()"],
      correctIndex: 2,
      explanation: "Функция print() используется для вывода текста и данных на экран в Python.",
    },
    {
      id: "3",
      question: "Какой год создания Python?",
      options: ["1985", "1991", "2000", "1995"],
      correctIndex: 1,
      explanation: "Python был создан Гвидо ван Россумом в 1991 году.",
    },
  ],
  
  "first-program": [
    {
      id: "1",
      question: "Как начинается комментарий в Python?",
      options: ["//", "/*", "#", "--"],
      correctIndex: 2,
      explanation: "В Python комментарии начинаются с символа #. Всё после # на этой строке игнорируется.",
    },
    {
      id: "2",
      question: "Что выведет print(2 + 2)?",
      options: ["2 + 2", "22", "4", "Ошибку"],
      correctIndex: 2,
      explanation: "Python выполнит математическую операцию и выведет результат: 4.",
    },
    {
      id: "3",
      question: "Какой результат деления 15 / 3 в Python?",
      options: ["5", "5.0", "5.00", "Ошибка"],
      correctIndex: 1,
      explanation: "При делении / Python всегда возвращает число с плавающей точкой (float), даже если результат целый.",
    },
  ],
  
  "variables": [
    {
      id: "1",
      question: "Какое имя переменной НЕ допустимо в Python?",
      options: ["my_var", "_private", "2name", "firstName"],
      correctIndex: 2,
      explanation: "Имя переменной не может начинаться с цифры. 2name — недопустимое имя.",
    },
    {
      id: "2",
      question: "Что делает оператор = в Python?",
      options: [
        "Сравнивает два значения",
        "Присваивает значение переменной",
        "Проверяет равенство",
        "Складывает числа",
      ],
      correctIndex: 1,
      explanation: "Оператор = присваивает значение переменной. Для сравнения используется ==.",
    },
    {
      id: "3",
      question: "Переменные name и Name в Python — это...",
      options: [
        "Одна и та же переменная",
        "Разные переменные",
        "Вызовут ошибку",
        "Зависит от настроек",
      ],
      correctIndex: 1,
      explanation: "Python чувствителен к регистру (case-sensitive). name и Name — это две разные переменные.",
    },
  ],
  
  "data-types": [
    {
      id: "1",
      question: "Какой тип данных у значения 'Hello'?",
      options: ["int", "float", "str", "bool"],
      correctIndex: 2,
      explanation: "Текст в кавычках — это строка (str, от string).",
    },
    {
      id: "2",
      question: "Что выведет print(type(3.14))?",
      options: [
        "<class 'int'>",
        "<class 'float'>",
        "<class 'str'>",
        "<class 'number'>",
      ],
      correctIndex: 1,
      explanation: "Числа с десятичной точкой имеют тип float (число с плавающей точкой).",
    },
    {
      id: "3",
      question: "Как правильно вставить переменную age в строку?",
      options: [
        'print("Мне " + age + " лет")',
        'print(f"Мне {age} лет")',
        'print("Мне {age} лет")',
        'print("Мне", age, "лет")',
      ],
      correctIndex: 1,
      explanation: "f-строки (f перед кавычками) — самый удобный способ вставки переменных в текст.",
    },
  ],
  
  "conditions": [
    {
      id: "1",
      question: "Какой оператор проверяет равенство в Python?",
      options: ["=", "==", "===", "equals"],
      correctIndex: 1,
      explanation: "Оператор == проверяет равенство. Один знак = используется для присваивания.",
    },
    {
      id: "2",
      question: "Что означает elif в Python?",
      options: ["else if", "end if", "elif — это ошибка", "else finally"],
      correctIndex: 0,
      explanation: "elif — это сокращение от 'else if' (иначе если).",
    },
    {
      id: "3",
      question: "Что важно соблюдать внутри блока if?",
      options: [
        "Фигурные скобки {}",
        "Отступы (4 пробела)",
        "Точку с запятой ;",
        "Круглые скобки ()",
      ],
      correctIndex: 1,
      explanation: "В Python отступы (обычно 4 пробела) определяют блоки кода. Это обязательно!",
    },
  ],
  
  "loops-for": [
    {
      id: "1",
      question: "Что выведет range(5)?",
      options: [
        "Числа от 1 до 5",
        "Числа от 0 до 5",
        "Числа от 0 до 4",
        "Число 5",
      ],
      correctIndex: 2,
      explanation: "range(5) создаёт последовательность от 0 до 4 (не включая 5).",
    },
    {
      id: "2",
      question: "Что делает range(2, 8)?",
      options: [
        "Числа от 2 до 8",
        "Числа от 2 до 7",
        "Числа от 0 до 8",
        "Ошибка",
      ],
      correctIndex: 1,
      explanation: "range(2, 8) создаёт числа от 2 до 7 (не включая 8).",
    },
    {
      id: "3",
      question: "Сколько раз выполнится цикл for i in range(3)?",
      options: ["2 раза", "3 раза", "4 раза", "Бесконечно"],
      correctIndex: 1,
      explanation: "range(3) создаёт 3 числа: 0, 1, 2. Цикл выполнится 3 раза.",
    },
  ],
  
  "functions-basics": [
    {
      id: "1",
      question: "Какое ключевое слово создаёт функцию в Python?",
      options: ["function", "func", "def", "fn"],
      correctIndex: 2,
      explanation: "Ключевое слово def (от define — определить) используется для создания функций.",
    },
    {
      id: "2",
      question: "Что такое параметр функции?",
      options: [
        "Имя функции",
        "Данные, которые передаются в функцию",
        "Результат работы функции",
        "Комментарий к функции",
      ],
      correctIndex: 1,
      explanation: "Параметры — это данные, которые функция получает при вызове для работы.",
    },
    {
      id: "3",
      question: "Что делает return в функции?",
      options: [
        "Выводит текст на экран",
        "Завершает программу",
        "Возвращает значение из функции",
        "Создаёт переменную",
      ],
      correctIndex: 2,
      explanation: "return возвращает значение из функции обратно в место вызова.",
    },
  ],

  "dictionaries": [
    {
      id: "1",
      question: "Как получить значение по ключу 'name' из словаря person?",
      options: ["person.name", "person[name]", 'person["name"]', "person(name)"],
      correctIndex: 2,
      explanation: "Значение из словаря получают через квадратные скобки с ключом в кавычках: person[\"name\"]",
    },
    {
      id: "2",
      question: "Что вернёт person.get('phone') если ключа 'phone' нет в словаре?",
      options: ["Ошибку KeyError", "None", "0", "False"],
      correctIndex: 1,
      explanation: "Метод .get() возвращает None если ключ не найден, в отличие от person['phone'] который вызовет ошибку.",
    },
    {
      id: "3",
      question: "Какой тип данных НЕ может быть ключом словаря?",
      options: ["Строка", "Число", "Список", "Кортеж"],
      correctIndex: 2,
      explanation: "Списки изменяемы, поэтому не могут быть ключами. Ключи должны быть неизменяемыми (строки, числа, кортежи).",
    },
  ],

  "string-methods": [
    {
      id: "1",
      question: "Что делает метод .strip()?",
      options: [
        "Удаляет все пробелы из строки",
        "Удаляет пробелы в начале и конце строки",
        "Разбивает строку на список",
        "Переводит в нижний регистр",
      ],
      correctIndex: 1,
      explanation: "strip() удаляет пробелы (и другие пробельные символы) только в начале и конце строки.",
    },
    {
      id: "2",
      question: 'Что вернёт "hello".find("x")?',
      options: ["None", "False", "-1", "Ошибку"],
      correctIndex: 2,
      explanation: "Метод find() возвращает -1 если подстрока не найдена.",
    },
    {
      id: "3",
      question: 'Как объединить список ["a", "b", "c"] в строку "a-b-c"?',
      options: [
        '["a", "b", "c"].join("-")',
        '"-".join(["a", "b", "c"])',
        'join("-", ["a", "b", "c"])',
        '["a", "b", "c"].concat("-")',
      ],
      correctIndex: 1,
      explanation: "В Python join() вызывается на разделителе: разделитель.join(список)",
    },
  ],

  "error-handling": [
    {
      id: "1",
      question: "Какой блок выполнится, если ошибки НЕ произошло?",
      options: ["except", "else", "finally", "try"],
      correctIndex: 1,
      explanation: "Блок else выполняется только если в try не было ошибок.",
    },
    {
      id: "2",
      question: "Какая ошибка возникнет при int('abc')?",
      options: ["TypeError", "ValueError", "SyntaxError", "NameError"],
      correctIndex: 1,
      explanation: "ValueError возникает когда функция получает аргумент правильного типа, но неподходящего значения.",
    },
    {
      id: "3",
      question: "Какой блок выполнится ВСЕГДА, независимо от ошибки?",
      options: ["try", "except", "else", "finally"],
      correctIndex: 3,
      explanation: "Блок finally выполняется всегда — и при ошибке, и без неё. Используется для очистки ресурсов.",
    },
  ],
};

export function getQuizBySlug(slug: string): QuizQuestion[] | undefined {
  return quizzes[slug];
}

export function hasQuiz(slug: string): boolean {
  return slug in quizzes;
}

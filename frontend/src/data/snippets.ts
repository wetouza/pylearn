export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  tags: string[];
}

export const snippetCategories = [
  { id: "basics", name: "Основы", icon: "🐍" },
  { id: "strings", name: "Строки", icon: "📝" },
  { id: "lists", name: "Списки", icon: "📋" },
  { id: "dicts", name: "Словари", icon: "📖" },
  { id: "files", name: "Файлы", icon: "📁" },
  { id: "functions", name: "Функции", icon: "⚡" },
  { id: "classes", name: "Классы", icon: "🏗️" },
  { id: "useful", name: "Полезное", icon: "🛠️" },
];

export const snippets: CodeSnippet[] = [
  // Basics
  {
    id: "hello-world",
    title: "Hello World",
    description: "Классическая первая программа",
    category: "basics",
    code: `print("Hello, World!")`,
    tags: ["print", "начало"],
  },
  {
    id: "input-output",
    title: "Ввод/вывод",
    description: "Получение данных от пользователя",
    category: "basics",
    code: `name = input("Как тебя зовут? ")
print(f"Привет, {name}!")`,
    tags: ["input", "print", "f-string"],
  },
  {
    id: "if-else",
    title: "Условия if/else",
    description: "Базовая условная конструкция",
    category: "basics",
    code: `age = 18

if age >= 18:
    print("Совершеннолетний")
elif age >= 14:
    print("Подросток")
else:
    print("Ребёнок")`,
    tags: ["if", "else", "elif", "условия"],
  },
  {
    id: "for-loop",
    title: "Цикл for",
    description: "Перебор элементов",
    category: "basics",
    code: `# Перебор чисел
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Перебор списка
fruits = ["яблоко", "банан", "апельсин"]
for fruit in fruits:
    print(fruit)`,
    tags: ["for", "range", "цикл"],
  },
  {
    id: "while-loop",
    title: "Цикл while",
    description: "Цикл с условием",
    category: "basics",
    code: `count = 0
while count < 5:
    print(count)
    count += 1`,
    tags: ["while", "цикл"],
  },

  // Strings
  {
    id: "string-methods",
    title: "Методы строк",
    description: "Основные операции со строками",
    category: "strings",
    code: `text = "  Hello, Python!  "

print(text.strip())      # Убрать пробелы
print(text.lower())      # В нижний регистр
print(text.upper())      # В верхний регистр
print(text.replace("Python", "World"))
print(text.split(","))   # Разбить по разделителю
print(len(text))         # Длина строки`,
    tags: ["strip", "lower", "upper", "split", "len"],
  },
  {
    id: "f-strings",
    title: "F-строки",
    description: "Форматирование строк",
    category: "strings",
    code: `name = "Анна"
age = 25
price = 19.99

# Базовое использование
print(f"Привет, {name}!")

# С выражениями
print(f"Через 10 лет тебе будет {age + 10}")

# Форматирование чисел
print(f"Цена: {price:.2f} руб.")
print(f"Число: {42:05d}")  # 00042`,
    tags: ["f-string", "format", "форматирование"],
  },
  {
    id: "string-slice",
    title: "Срезы строк",
    description: "Извлечение подстрок",
    category: "strings",
    code: `text = "Python"

print(text[0])      # P (первый символ)
print(text[-1])     # n (последний символ)
print(text[0:3])    # Pyt (с 0 по 2)
print(text[2:])     # thon (с 2 до конца)
print(text[:3])     # Pyt (с начала до 2)
print(text[::-1])   # nohtyP (реверс)`,
    tags: ["slice", "срез", "индекс"],
  },

  // Lists
  {
    id: "list-basics",
    title: "Основы списков",
    description: "Создание и базовые операции",
    category: "lists",
    code: `# Создание списка
fruits = ["яблоко", "банан", "апельсин"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "два", 3.0, True]

# Доступ к элементам
print(fruits[0])   # яблоко
print(fruits[-1])  # апельсин

# Изменение
fruits[1] = "груша"

# Длина
print(len(fruits))`,
    tags: ["list", "список", "индекс"],
  },
  {
    id: "list-methods",
    title: "Методы списков",
    description: "Добавление, удаление, сортировка",
    category: "lists",
    code: `fruits = ["яблоко", "банан"]

# Добавление
fruits.append("апельсин")     # В конец
fruits.insert(0, "груша")     # По индексу
fruits.extend(["киви", "манго"])  # Несколько

# Удаление
fruits.remove("банан")        # По значению
last = fruits.pop()           # Последний
first = fruits.pop(0)         # По индексу

# Сортировка
fruits.sort()                 # По возрастанию
fruits.sort(reverse=True)     # По убыванию
fruits.reverse()              # Реверс`,
    tags: ["append", "insert", "remove", "pop", "sort"],
  },
  {
    id: "list-comprehension",
    title: "List Comprehension",
    description: "Генераторы списков",
    category: "lists",
    code: `# Базовый синтаксис
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# С условием
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# С преобразованием
words = ["hello", "world"]
upper = [w.upper() for w in words]
# ["HELLO", "WORLD"]`,
    tags: ["comprehension", "генератор"],
  },

  // Dicts
  {
    id: "dict-basics",
    title: "Основы словарей",
    description: "Создание и доступ к данным",
    category: "dicts",
    code: `# Создание словаря
person = {
    "name": "Анна",
    "age": 25,
    "city": "Москва"
}

# Доступ к значениям
print(person["name"])        # Анна
print(person.get("age"))     # 25
print(person.get("job", "Не указано"))  # Значение по умолчанию

# Изменение
person["age"] = 26
person["job"] = "Разработчик"`,
    tags: ["dict", "словарь", "ключ"],
  },
  {
    id: "dict-methods",
    title: "Методы словарей",
    description: "Операции со словарями",
    category: "dicts",
    code: `person = {"name": "Анна", "age": 25}

# Получение ключей и значений
print(person.keys())    # dict_keys(['name', 'age'])
print(person.values())  # dict_values(['Анна', 25])
print(person.items())   # dict_items([('name', 'Анна'), ('age', 25)])

# Перебор
for key, value in person.items():
    print(f"{key}: {value}")

# Удаление
del person["age"]
person.pop("name")
person.clear()  # Очистить всё`,
    tags: ["keys", "values", "items", "перебор"],
  },

  // Files
  {
    id: "file-read",
    title: "Чтение файла",
    description: "Различные способы чтения",
    category: "files",
    code: `# Чтение всего файла
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# Чтение построчно
with open("file.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# Чтение в список строк
with open("file.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()`,
    tags: ["open", "read", "файл", "чтение"],
  },
  {
    id: "file-write",
    title: "Запись в файл",
    description: "Создание и запись данных",
    category: "files",
    code: `# Запись (перезапись файла)
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Привет, мир!\\n")
    f.write("Вторая строка")

# Добавление в конец
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("\\nНовая строка")

# Запись списка строк
lines = ["Строка 1", "Строка 2", "Строка 3"]
with open("file.txt", "w", encoding="utf-8") as f:
    f.writelines(line + "\\n" for line in lines)`,
    tags: ["open", "write", "файл", "запись"],
  },

  // Functions
  {
    id: "function-basic",
    title: "Базовая функция",
    description: "Создание и вызов функции",
    category: "functions",
    code: `def greet(name):
    """Приветствует пользователя"""
    return f"Привет, {name}!"

# Вызов функции
message = greet("Анна")
print(message)  # Привет, Анна!

# Функция с несколькими параметрами
def add(a, b):
    return a + b

result = add(5, 3)  # 8`,
    tags: ["def", "return", "функция"],
  },
  {
    id: "function-args",
    title: "Аргументы функций",
    description: "Разные типы аргументов",
    category: "functions",
    code: `# Значения по умолчанию
def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Анна"))           # Привет, Анна!
print(greet("Анна", "Здравствуй"))  # Здравствуй, Анна!

# *args - произвольное число аргументов
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4))  # 10

# **kwargs - именованные аргументы
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Анна", age=25)`,
    tags: ["args", "kwargs", "параметры"],
  },
  {
    id: "lambda",
    title: "Lambda функции",
    description: "Анонимные функции",
    category: "functions",
    code: `# Базовый синтаксис
square = lambda x: x ** 2
print(square(5))  # 25

# С несколькими аргументами
add = lambda a, b: a + b
print(add(3, 4))  # 7

# Использование с map/filter
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
# [1, 4, 9, 16, 25]

evens = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4]`,
    tags: ["lambda", "map", "filter", "анонимная"],
  },

  // Classes
  {
    id: "class-basic",
    title: "Базовый класс",
    description: "Создание класса и объекта",
    category: "classes",
    code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Привет, я {self.name}!"
    
    def birthday(self):
        self.age += 1
        return f"Мне теперь {self.age}!"

# Создание объекта
person = Person("Анна", 25)
print(person.greet())     # Привет, я Анна!
print(person.birthday())  # Мне теперь 26!`,
    tags: ["class", "init", "self", "ООП"],
  },
  {
    id: "class-inheritance",
    title: "Наследование",
    description: "Расширение классов",
    category: "classes",
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} говорит: Гав!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} говорит: Мяу!"

dog = Dog("Бобик")
cat = Cat("Мурка")

print(dog.speak())  # Бобик говорит: Гав!
print(cat.speak())  # Мурка говорит: Мяу!`,
    tags: ["inheritance", "наследование", "ООП"],
  },

  // Useful
  {
    id: "try-except",
    title: "Обработка ошибок",
    description: "Try/except конструкция",
    category: "useful",
    code: `try:
    number = int(input("Введи число: "))
    result = 10 / number
    print(f"Результат: {result}")
except ValueError:
    print("Это не число!")
except ZeroDivisionError:
    print("На ноль делить нельзя!")
except Exception as e:
    print(f"Ошибка: {e}")
finally:
    print("Готово!")`,
    tags: ["try", "except", "ошибки", "исключения"],
  },
  {
    id: "random-module",
    title: "Модуль random",
    description: "Генерация случайных чисел",
    category: "useful",
    code: `import random

# Случайное целое число
print(random.randint(1, 10))  # от 1 до 10

# Случайное дробное
print(random.random())        # от 0 до 1
print(random.uniform(1, 10))  # от 1 до 10

# Случайный элемент из списка
fruits = ["яблоко", "банан", "апельсин"]
print(random.choice(fruits))

# Перемешать список
random.shuffle(fruits)
print(fruits)`,
    tags: ["random", "случайный", "randint", "choice"],
  },
  {
    id: "datetime-module",
    title: "Работа с датами",
    description: "Модуль datetime",
    category: "useful",
    code: `from datetime import datetime, timedelta

# Текущая дата и время
now = datetime.now()
print(now)  # 2024-01-15 14:30:00

# Форматирование
print(now.strftime("%d.%m.%Y"))  # 15.01.2024
print(now.strftime("%H:%M"))     # 14:30

# Создание даты
birthday = datetime(2000, 5, 15)

# Разница между датами
age = now - birthday
print(f"Дней прожито: {age.days}")

# Добавление времени
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(weeks=1)`,
    tags: ["datetime", "дата", "время", "strftime"],
  },
  {
    id: "json-module",
    title: "Работа с JSON",
    description: "Чтение и запись JSON",
    category: "useful",
    code: `import json

# Python объект в JSON строку
data = {"name": "Анна", "age": 25, "skills": ["Python", "JS"]}
json_string = json.dumps(data, ensure_ascii=False, indent=2)
print(json_string)

# JSON строка в Python объект
json_str = '{"name": "Боб", "age": 30}'
obj = json.loads(json_str)
print(obj["name"])  # Боб

# Запись в файл
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Чтение из файла
with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)`,
    tags: ["json", "dumps", "loads", "файл"],
  },
];

export function getSnippetsByCategory(category: string): CodeSnippet[] {
  return snippets.filter(s => s.category === category);
}

export function searchSnippets(query: string): CodeSnippet[] {
  const lowerQuery = query.toLowerCase();
  return snippets.filter(s => 
    s.title.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
    s.code.toLowerCase().includes(lowerQuery)
  );
}

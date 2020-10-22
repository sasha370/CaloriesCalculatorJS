// Storage controller

// Item controller
const ItemCtrl = (function () {
  // Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Stracture /State
  // Данные , которые будут гулять среди методов? но они не доступны снаружи
  const data = {
    items: [
      // {id: 0, name: 'Steak ', calories: 1200},
      // {id: 1, name: 'Eggs ', calories: 200},
      // {id: 2, name: 'Cookie ', calories: 2200},
    ],  // Список всех позиций
    currentItem: null,  // текущая позиция ( для удаления, редактирования)
    totalCalories: 0
  }

  return { // возвращаем из функции метод, который возвращает Данные, т.е. дает к ним доступ
    getItems: function () { // метод возвращает список сохраненных позиций
      return data.items;
    },

    addItem: function (name, calories) {  //принимаем значение и сохраняем его, генерируя ID
      //Create Id
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1 // Берем длинну массива и ищем ID последнего ( т.е -1), затем к этому ID добавляем единицу
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories); //перобразуем введеную строку в число

      //Создаем новую запись используя конструктор из модуля Item
      const newItem = new Item(ID, name, calories);
      data.items.push(newItem); //добавляем созданную запись в массив с данными, т.е. сохраняем
      return newItem;
    },
    logData: function () {
      return data;
    },

    // Get item by ID
    // Перебираем сохраненные значения и ищем позицию по заданному ID
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    // Записываем в хранилище текущую позицию
    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    // Суммируем все калории
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    // Возвращаем значение переменной currentItem
    getCurrentItem: function () {
      return data.currentItem;
    },

    // ОБНОВЛЕНИЕ позиции
    updateItem: function (name, calories) {  //принимаем новые данные из формы
      calories = parseInt(calories); //переводим калории в число

      let found = null;
      data.items.forEach(function (item) {  //ищем в базе совпадение и перезаписываем
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    }

  }
})();


// UI controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'

  }


  return {  // Public method
    populateItemList: function (items) {
      let html = '';  // определяем пустую переменную
      items.forEach(function (item) { // Нполняем переменную сформированными Li для каждой позиции
        html += `  
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>
          </li>`;
      });
      // Наполняем Список полученными значениями. Вставляем в Ul
      // ID блока берем из перечня доступных блоков (см.выше)
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return { // считываем значение полей ввода и передаем их дальше
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    getSelectors: function () { // метод разрешает доступ к списку селекторов ГЕТТЕР
      return UISelectors;
    },

    // Отрисовыаем список позиций
    addListItem: function (newItem) {
      document.querySelector(UISelectors.itemList).style.display = 'block'; //При добавлении элемента делаем нашу форму видимой

      // Создаем элемент для отрисовки
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${newItem.id}`;
      li.innerHTML = ` <strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li); // Вставляем полученную строку в UL
    },

    clearInput: function () {  //очищаем поля ввода после нажанития кнопки
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function () { // Скрывает список UL, используем когад он пуст
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    // Отрисовываем Сууму калорий
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    // Очистка до первоначального состояния
    clearEditState: function () {
      UICtrl.clearInput();  //чистим поля ввода
      //Прячем ненужные кнопки и отображаем нужные
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      //Прячем ненужные кнопки и отображаем нужные
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    // Заполняем форму редактируемой строчкой
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name; //данные запрашиваем в контроллере из переменной currentItem
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState(); //Меняем тстау сформы на Редактирование
    },

    //обновляем отрисованную строчку на основании новых данных
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems); //выбираем все записи с классом li и item-list
      listItems = Array.from(listItems); //конвертим все данные в массив

      listItems.forEach(function (listItem) { //пробегаем по всему массиву
        const itemId = listItem.getAttribute('id'); //ищем совпадение по ID
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = ` 
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
        }
      })
    },

  }
})();


// app Controller
const App = (function (ItemCtrl,
                       UICtrl) {
// Load Event Listeners
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors(); // получаем из UI контроллера список доступных селекторов

    // Добавлzем прослушку на нажатие кнопки, по нажатию отправляем в метод добавления
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Отключаем отправку по нажатию Enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    //прослушка кнопки редактирования, т.к. каждую кнопку Edit мы  не можем достать, поэтому реагируем на нажатие строчки
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //прослушка кнопки Update
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
  }

  //Add Item submit
  const itemAddSubmit = function (e) {
    // Получаем поля ввода из UI сонтроллера, чтобы их проверить
    const input = UICtrl.getItemInput();
    if (input.name !== '' && input.calories !== '') { //проверяем, чтобы небыло пустых значений
      const newItem = ItemCtrl.addItem(input.name, input.calories); //передаем в обработчик записей для создания новой записи
      UICtrl.addListItem(newItem); // передаем сформированную позици в отрисовку

      const totalCalories = ItemCtrl.getTotalCalories();  //Получаем сумму всех каллорий
      UICtrl.showTotalCalories(totalCalories); //Отправляем на отрисовку

      UICtrl.clearInput(); //Очищаем поля ввода
    }

    e.preventDefault()
  };

  // РЕДАКТИРОВАНИЕ нажатие кнопки
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) { //фильтруем нажатие только на элементе с опредеенным классом EDIT
      const listId = e.target.parentNode.parentNode.id; // чтобы определить ID нам надо достать до второго родителя, в котором есть поле ID

      // Разбираем полученый ID в строчку item-1
      const listIdArr = listId.split('-');
      // Достаем из массива ID
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id); //заправшиваем Запись для редактирвания
      ItemCtrl.setCurrentItem(itemToEdit); // запписываем в хранилище текущую позицию
      UICtrl.addItemToForm(); //Записываем редактируемые данные в форму
    }
    e.preventDefault()
  };

  // ОБНОВЛЕНИЕ данных из формы
  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput(); //считываем данные из полей формы
    const updateItem = ItemCtrl.updateItem(input.name, input.calories); //отправляем данные на сохранение в data
    UICtrl.updateListItem(updateItem); //передаем в отрисовку новые значения

    // Перерисовываем счетчик
    const totalCalories = ItemCtrl.getTotalCalories();  //Получаем сумму всех каллорий
    UICtrl.showTotalCalories(totalCalories); //Отправляем на отрисовку

    UICtrl.clearEditState(); //Сбрасываем форму для редактирования

    e.preventDefault();
  };

  // ПЕРВОНАЧАЛЬНАЯ инициализация при запуске
  return { // Public method
    init: function () {
      const items = ItemCtrl.getItems(); // при запуске приложения получаем список сохраненных позиций
      UICtrl.clearEditState(); //Очищаем состояние, т.е. возвращаем все кнопки на свои места
      loadEventListeners(); //подключаем прослушку кнопки Add meal

      // Если список сохраненных позиций пуст
      if (items.length === 0) {
        UICtrl.hideList();  //Прячем форму для списка, чтобы не мешала полоса
      } else {
        UICtrl.populateItemList(items); // отправляем полученные данные в контроллер на отрисовку
      }

      const totalCalories = ItemCtrl.getTotalCalories();  //Получаем сумму всех каллорий из Local storage
      UICtrl.showTotalCalories(totalCalories); //Отправляем на отрисовку

    }
  }

})(ItemCtrl, UICtrl);


// Initialize App
App.init();
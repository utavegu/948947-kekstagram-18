// import {a} from "./utils.js";
// console.log(a);
//import {getRandomInteger, getRandomArrayItem} from "./utils.js";

// Пока кучей, потом раскидаю на объекты по типу и на модули
// +1 указываю там, где значение помещается в функцию getRandomInteger аргументом для верхнего предела
// Все подобные константы можешь скидать в один модуль, но внутри обязательно разграничь, в каком из модулей они используются
const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const SPACE_KEYCODE = 32; // Вроде... не тестил.
const COUNT_OF_PHOTOS = 27;
const SHOW_PHOTOS = 11;
const MAX_AVATAR_NUMBER = 6+1;
const MIN_LIKES_NUMBER = 15;
const MAX_LIKES_NUMBER = 200+1;

// Вот чото не уверен я, что сюда "словарь" приплёл...
const COMMENTS_VOCABULARY = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = ['Вася', 'Петя', 'Маша', 'Катя', 'Альберт']; // Давай-ка ты всё-таки рядом с этим полем добавишь в разметку (сам) ещё и дату публикации и поиграешься с объектом дата, поучишься с ним работать. То есть даты могут быть рандомные, но важно, чтобы комментарии сверху были опубликованы раньше, чем комментарии снизу. Короче да, создай ещё одну сущность "pubDate", сделай под неё вёрстку (разметку и стили), ну и в js тоже всё, как полагается

const DESCRIPTIONS = ['С поцонаме на рыбалке', 'Вьетнам в 75ом', 'А это мы на Вудстоке', 'Моя бывшая', 'Попросил сфоткать еду для кекста у людей за соседним столиком', 'Очень философская мысль']; // Кстати да, вместо дескрипшина можно тупо нахуярить сюда фраз из инстаграма Ирины-габбе... гыгыгы... С указанием в комментариях ссылки на её инстаграм... ахаха... бля... идеально, если бы они оттуда автоматом парсились...

/*
ЧТО-ТО У МЕНЯ ЗАКРАЛИСЬ ПОДОЗРЕНИЯ, ЧТО ПЕРЕМЕННЫЕ Я КАК-ТО ЧЕРЕЗ ЖОПУ НАЗВАЛ

Код должен быть разделён на отдельные функции. Стоит отдельно объявить функцию генерации случайных данных, функцию создания DOM-элемента на основе JS-объекта, функцию заполнения блока DOM-элементами на основе массива JS-объектов
3-2:
3) Сделать функцию создания DOM-элемента на основе JS-объекта (пока это не функция у тебя)
4) Сделать функцию заполнения блока DOM-элементами на основе массива JS-объектов

*/

// Максимальное вводить на 1
const getRandomInteger = (max, min = 0) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(array.length);
  return array[randomIndex];
};

// Функция перемешивания массива (вариация алгоритма Фишера-Йетса)
const mixArray = function (arr) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

// JSDoc полагаю (ну типа как другим кодерам передать инфу об интерфейсе твоего творения): ФУНКЦИЯ, которая содаёт count случайных УНИКАЛЬНЫХ значений value. Если в качестве значения передан массив - данные берутся из него, если второй аргумент опущен - генерируются случайные числа... Кстати, надо бы её маленько добработать - ввести третий парметр и заменить им COUNT_OF_PHOTOS, для большей гибкости функции... Только хорошо подумай, как это сделать, потому что второй парметр-то тоже необязательный... Ну как вариант - им обоим дать значения по умолчанию
const generateSetOfUniqueValues = (count, values) => {
  let setOfUniqueNumeric = new Set();
  switch (typeof values) {
    case `object`: {
      if (count > values.length) {throw new Error('Требуемое количество превышает размер уникальных значений в массиве!')} 
        else {
          while (setOfUniqueNumeric.size !== count) {
            setOfUniqueNumeric.add(getRandomArrayItem(values));
          }
          return setOfUniqueNumeric;
        }
    }
    break;
    case `undefined`: {
      while (setOfUniqueNumeric.size !== count) {
        setOfUniqueNumeric.add(getRandomInteger(COUNT_OF_PHOTOS+1, 1));
      }
      return Array.from(setOfUniqueNumeric);
     }
     break;
  }
}

const generateCommentData = () => {
  comment = {
    avatar: getRandomInteger(MAX_AVATAR_NUMBER, 1),
    message: Array.from(generateSetOfUniqueValues(getRandomInteger(3, 1), COMMENTS_VOCABULARY)).join(' '),
    name: getRandomArrayItem(NAMES)
  };
  return comment;
}

const generateComments = () => {
  comments = new Array(getRandomInteger(4, 1)).fill(``).map(() => {
    return generateCommentData();
  });
  return comments;
};

const uniquePhotoIndex = generateSetOfUniqueValues(COUNT_OF_PHOTOS);


// Функции стрелочные!
// Функция создания массива со случайными данными
// Там где можно, откажись от for (теперь можно) - посмотрит как сделано в интенсиве 4
const generateRandomData = (count) => {
  const exemplars = [];
  for (let i = 0; i < count; i++) {
    exemplars[i] = {
      url: `photos/${uniquePhotoIndex[i]}.jpg`, 
      // Фоток побольше закинь, штук 50 (формат 600 на 600, тащи те, что со свободной лицензией)
      description: getRandomArrayItem(DESCRIPTIONS),
      likes: getRandomInteger(MAX_LIKES_NUMBER, MIN_LIKES_NUMBER),
      comments: generateComments()
    };
  }
  return exemplars;
};

const photosDescriptions = generateRandomData(SHOW_PHOTOS);

// Контейнер для миниатюр фотографий
const picturesContainer = document.querySelector('.pictures');

// Шаблон для этих самых фото.
const template = document.querySelector('#picture').content.querySelector('.picture');

// Фрагмент для упаковки
const fragment = document.createDocumentFragment();

// А вот на этом этапе на основе данных создаются уже элементы страницы
// Упаковываю фрагмент N-ным количеством элементов
for (let i = 0; i < SHOW_PHOTOS; i++) {
  let photoElement = template.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photosDescriptions[i].url;
  photoElement.querySelector('.picture__likes').textContent = photosDescriptions[i].likes;
  photoElement.querySelector('.picture__comments').textContent = photosDescriptions[i].comments.length;
  fragment.appendChild(photoElement);
}

picturesContainer.appendChild(fragment);

/* ------------------------------------------------------ */

// БЛОК ПОКАЗА БОЛЬШОГО ИЗОБРАЖЕНИЯ
// Вот тут осторожнее с переходом с варом, может сломаться замыкание

const bigPicture = document.querySelector('.big-picture');

const addClickListener = function (picture) {
  picture.addEventListener('click', function () {
    // console.log(evt.target === picture); ЕВТ УБРАЛ ИЗ ПАРАМЕТРА, ТАК КАК НЕ ИСПОЛЬЗУЮ
    // ФОТОИНДЕКС ВЫКОВЫРИВАЕТ НОМЕР ФОТОГРАФИИ ИЗ КАРТИНКИ, ПО КОТОРОЙ ТКНУЛИ
    const clickedPhotoIndex = parseInt((picture.src.substring(picture.src.length - 10)).match(/\d+/));    
    const requiredPhotoInArray = photosDescriptions.filter(photo => parseInt((photo.url.substring(photo.url.length - 10)).match(/\d+/)) == clickedPhotoIndex);
    const [requiredPhoto] = requiredPhotoInArray;
    
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img').children[0].src = requiredPhoto.url;
    bigPicture.querySelector('.likes-count').textContent = requiredPhoto.likes;
    bigPicture.querySelector('.social__caption').textContent = requiredPhoto.description;

    bigPicture.querySelector('.comments-count').textContent = requiredPhoto.comments.length; // вычислять автоматически на основе количества потомков списка, и в этом блоке - разместить под генерацией комментариев, чтобы логичнее было, иначе как считать то, чего ещё нет... А, дак он и так автоматически вычисляет, всё норм.
    bigPicture.querySelector('.comments-count').style.color = 'red'; // временно, чтобы видел свою ошибку

    const commentList = bigPicture.querySelector('.social__comments');
    while (commentList.firstChild) {
      commentList.removeChild(commentList.firstChild);
    }
    for (let i = 0; requiredPhoto.comments.length; i++) {
      commentList.insertAdjacentHTML('beforeend' ,`<li class="social__comment">
        <img
          class="social__picture"
          src="img/avatar-${requiredPhoto.comments[i].avatar}.svg"
          alt="${requiredPhoto.comments[i].name}"
          width="35" height="35">
        <p class="social__text">${requiredPhoto.comments[i].message}</p>
      </li>
      `);
    };    
  });
};

// Ну и как итог - проверь, что выводимый элемент страницы полностью соответствует сгенерированному объекту с данными (для этого уменьши количество отрисовываемых фото до 2-4)

const pictures = document.querySelectorAll('.picture__img');
for (let i = 0; i < pictures.length; i++) {
  let picture = pictures[i];
  addClickListener (picture);
}



// Далее про закрывание большого изображения
const closePhotoButton = bigPicture.querySelector('.big-picture__cancel');

const closePhoto = () => {
  bigPicture.classList.add('hidden');
};

const onClosePhotoButtonClick = () => {
  closePhoto();
}

const onPhotoEscPress = function (evt) {
  // в проекте 4 не кейкоды, как-то иначе. Переделай на новую версию и разберись в ней
  if (evt.keyCode === ESC_KEYCODE) {
    closePhoto();
  }
};

closePhotoButton.addEventListener('click', onClosePhotoButtonClick)
document.addEventListener('keydown', onPhotoEscPress);

// Разберись всё-таки что там за ошибка вылазит с аватаром и реквайр фото каммент ноу дефайнд при клике по миниатюре

// Вот тут кончается модуль "ЗАГРУЖЕННЫЕ ФОТО"

















// document.querySelector('.social__comment-count').classList.add('visually-hidden'); // Убрал счётчик комментариев
// document.querySelector('.comments-loader').classList.add('visually-hidden'); // Убрал "Загрузить ещё"

/* ------------------------------------------------------ */
// // 4-2

// // Форма редактирования изображения
// var imageEditingForm = document.querySelector('.img-upload__overlay');

// // Контрол загрузки файла
// var fileUploadControl = document.querySelector('#upload-file');

// // Крестик для закрытия формы редактирования изображения
// var formCloseCross = imageEditingForm.querySelector('.img-upload__cancel');


// // Функция показа формы редактирования изображения
// var showImageEditingForm = function () {
//   imageEditingForm.classList.remove('hidden');
//   fileUploadControl.removeEventListener('click', onControlChange);
//   formCloseCross.addEventListener('click', onCrossClick);
//   document.addEventListener('keydown', onEscPress);
// };

// // Функция закрытия формы редактирования изображения
// var hideImageEditingForm = function () {
//   imageEditingForm.classList.add('hidden');
//   formCloseCross.removeEventListener('click', onCrossClick);
//   document.removeEventListener('keydown', onEscPress);
//   fileUploadControl.addEventListener('click', onControlChange);
//   // fileUploadControl.value...??? КОРОЧЕ СБРОСИТЬ ЗНАЧЕНИЕ
//   /*При написании обработчиков, реагирующих на закрытие формы, обратите внимание на то, что при закрытии формы, дополнительно необходимо сбрасывать значение поля выбора файла #upload-file. В принципе, всё будет работать, если при повторной попытке загрузить в поле другую фотографию, но событие change не сработает, если вы попробуете загрузить ту же фотографию.*/
// };



// // Обработчик смены контрола (показывает форму)
// var onControlChange = function (evt) {
//   evt.preventDefault()  // ВОТ ЭТО ТОЖЕ ПОТОМ УБЕРИ. И ЕВТ ИЗ ПАРАМЕТРА
//   showImageEditingForm();
// };

// // Обработчик клика по крестику закрытия (закрывает форму)
// var onCrossClick = function () {
//   hideImageEditingForm();
// };

// // Обработчик нажатия ESC (закрывает форму)
// var onEscPress = function (evt) {
//   if (evt.keyCode === ESC_KEYCODE) {
//     hideImageEditingForm();
//   }
// };


// // Слушатель события чейндж на контроле загрузки файла
// fileUploadControl.addEventListener('click', onControlChange);  // ДЛЯ ПРОСТОТЫ ПОКА ПОМЕНЯЮ change на click

// // Слушатель события клик на крестике закрытия формы
// formCloseCross.addEventListener('click', onCrossClick);

// // Слушатель нажатия ескейп на документе
// document.addEventListener('keydown', onEscPress);

// // НА ДАННОМ ЭТАПЕ ИЗ БАГОВ - ПРИ ОТКРЫТОЙ ФОРМЕ (если конрол в фокусе) НАЖАТИЕ НА ЭНТЕР ИЛИ ПРОБЕЛ ПРИВОДИТ К ОТКРЫТИЮ ИНТЕРФЕЙСА ЗАГРУЗКИ ФАЙЛА - В БУДУЩЕМ НЕ ЗАБУДЬ ПРО ЭТО.

// /* добавим на пин слайдера .effect-level__pin обработчик события mouseup, который будет согласно ТЗ изменять уровень насыщенности фильтра для изображения. Для определения уровня насыщенности, нужно рассчитать положение пина слайдера относительно всего блока и воспользоваться пропорцией, чтобы понять, какой уровень эффекта нужно применить. */



// var INITIAL_STATE = 20; // начальное значение уровня эффекта

// // Слайдер для регулировки глубины эффекта
// var depthOfEffectSlider = document.querySelector('.effect-level');

// // Пин слайдера
// var sliderPin = depthOfEffectSlider.querySelector('.effect-level__pin');

// // Шкала слайдера
// var sliderScale = depthOfEffectSlider.querySelector('.effect-level__line');

// // Значение слайдера
// var sliderValue = document.querySelector('effect-level__value');

// sliderPin.addEventListener('mouseup', function() {
//   // Сколько процентов на шкале показывает пин
//   var pinPercentPosition = Math.round(sliderPin.offsetLeft * 100 / sliderScale.clientWidth);
//   console.log(pinPercentPosition);
// });

// var sliderReset = function () {
//   sliderValue = INITIAL_STATE; // ПОКА ТАК
// };

// var onFilterChange = function () {
//   sliderReset();
//   console.log('РАБОТАЕТ');
// };

// var filtersKit = document.querySelector('.effects__list');
// filtersKit.addEventListener('change', onFilterChange);

// // Поле ввода хэштэгов
// var hashtagsInput = document.querySelector('.text__hashtags');

// document.querySelector('.img-upload__input').removeAttribute('required'); // ПОКА УБРАЛ, ЧТОБЫ НЕ МЕШАЛ ТЕСТИТЬ ПОЛЯ ФОРМЫ

// /*
// Это был быстрый вариант... Но мы тут затем чтобы учиться, потому ниже давай долгий вариант запилим
// hashtagsInput.setAttribute('pattern', '^(([#][A-Za-zА-Яа-я0-9]{1,19})([ \t\v\r\n\f][#][A-Za-zа-яА-Я0-9]{1,19}){0,4})?$');
// hashtagsInput.addEventListener('invalid', function () {
//   if (hashtagsInput.validity.patternMismatch) {
//     hashtagsInput.setCustomValidity('Дружище, чото не по шаблону!');
//   }
// });
// */

// var getArrayOfHashtags = function () {
//   var arrayOfHashtags = (hashtagsInput.value.trim()).split(' ');
//   // БАГ - воспринимает пробелы, как отдельные части массива строк. Надо как-то чтобы он их удалял в конечной версии, перед проверкой ниже. Думаю, уже в конечном массиве (то есть на уровне этого комментария) просто перехеречивать все элементы, которые равны любому количеству пробелов. Вероятно снова привет RegExp и String-овый метод .replace

//   if (arrayOfHashtags.length > 5) {
//     hashtagsInput.setCustomValidity('Не более пяти слов! Сейчас: ' + arrayOfHashtags.length);
//   } else {
//    // ВОТ ПОЧТИ ВСЁ ЗАЕБИСЬ, НО ОН ВСЕГДА ПРОВЕРЯЕТ ТОЛЬКО ПОСЛЕДНИЙ ХЭШТЭГ МАССИВА - ЭТО ТОЧНО ПРО ЗАМЫКАНИЯ
//   // (так что пока тести с одним элементом)
//   //НЕВЫПОЛНЕННЫЕ ЗАДАЧИ:
//       // 1) один и тот же хэш-тег не может быть использован дважды;
//       // 2) теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;
//     for (var i = 0; i < arrayOfHashtags.length; i++) {
//       if (arrayOfHashtags[i].charAt(0) !== "#") {
//         hashtagsInput.setCustomValidity('"' + arrayOfHashtags[i] + '" не хэштэг! (первый символ должен быть #)');
//       } else if (arrayOfHashtags[i].length < 2) {
//         hashtagsInput.setCustomValidity('Не менее двух символов!');
//       } else if (arrayOfHashtags[i].length > 20) {
//         hashtagsInput.setCustomValidity('Длина хэштэга '  + arrayOfHashtags[i] + ' (включая решетку) не должна превышать 20 символов!');
//       } else {
//         hashtagsInput.setCustomValidity('');
//       }
//     }
//   }
// }

// var onHashtagsInputChange = function () {
//   getArrayOfHashtags();
// }

// hashtagsInput.addEventListener('change', onHashtagsInputChange);

// hashtagsInput.addEventListener('keydown', function (evt) {
//   evt.stopPropagation();
// });

// // Поле ввода комментариев
// var commentInput = document.querySelector('.text__description');
// commentInput.setAttribute('maxlength', '140');

// commentInput.addEventListener('keydown', function (evt) {
//   evt.stopPropagation();
// });

// //Форма (так-то, оптимизации ради, можно один раз найти её, а элементы уже искать внутри неё... ну это уже в модулях как пойдёт)
// var imageUploadForm = document.querySelector('.img-upload__form');
// imageUploadForm.setAttribute('action', 'https://js.dump.academy/kekstagram');



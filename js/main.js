const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const SPACE_KEYCODE = 32; // Вроде... не тестил.

const COUNT_OF_PHOTOS = 27; // Всего фотографий в папке
const SHOW_PHOTOS = 26; // Загружать случайных фотографий
const MAX_AVATAR_NUMBER = 6+1;
const MIN_LIKES_NUMBER = 15;
const MAX_LIKES_NUMBER = 200+1;

const COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = ['Вася', 'Петя', 'Маша', 'Катя', 'Альберт'];

const DESCRIPTIONS = ['С поцонаме на рыбалке', 'Вьетнам в 75ом', 'А это мы на Вудстоке', 'Моя бывшая', 'Попросил сфоткать еду для кекста у людей за соседним столиком', 'Очень философская мысль'];


// Сгенерировать случайное число из диапазона (максимальное вводить на 1 больше)
const getRandomInteger = (max, min = 0) => {
  return min + Math.floor(Math.random() * (max - min));
};

// Получить случайный элемент массива
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

// Я понимаю, что подобные многозадачные функции-комбайны это плохо, но тут просто упражнялся в сложных конструкциях
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


/*------------------------------------- БЛОК ФОТОГРАФИЙ (моки - data/mocks) ------------------------------------- */

// Создаёт данные для комментария
const generateCommentData = () => {
  comment = {
    avatar: getRandomInteger(MAX_AVATAR_NUMBER, 1),
    message: Array.from(generateSetOfUniqueValues(getRandomInteger(3, 1), COMMENTS)).join(' '),
    name: getRandomArrayItem(NAMES)
  };
  return comment;
}

// Создаёт от 1 до 3х комментариев
const generateComments = () => {
  comments = new Array(getRandomInteger(4, 1)).fill(``).map(() => {
    return generateCommentData();
  });
  return comments;
};

// Перемешивает индексы всех доступных фотографий
const uniquePhotoIndex = generateSetOfUniqueValues(COUNT_OF_PHOTOS);


// Функция создания массива со случайными данными (о фотографии)
// Там где можно, откажись от for (теперь можно) - посмотрит как сделано в интенсиве 4
const generateRandomData = (count) => {
  return new Array(count)
    .fill(``)
    .map(function(exemplar, index) {
      exemplar = {
        url: `photos/${uniquePhotoIndex[index]}.jpg`, 
        description: getRandomArrayItem(DESCRIPTIONS),
        likes: getRandomInteger(MAX_LIKES_NUMBER, MIN_LIKES_NUMBER),
        comments: generateComments()
      };
    return exemplar;
    });
};

/*------------------------------------- БЛОК ФОТОГРАФИЙ (рендер) ------------------------------------- */

// Генерируем массив фотографий с их метаданными
// Вот это очень важная точка, потому что переменная photosDescriptions дальше используется поголовно и содержит она в себе ДАННЫЕ, которые могут быть получены как из моков, так и с сервера
const photosDescriptions = generateRandomData(SHOW_PHOTOS);
console.log(photosDescriptions);

// Функция создания DOM-элементов на основе JS-объектов 
// и заполнения блока DOM-элементами на основе массива JS-объектов
// Короче собрал их пока в одну, не вижу смысла на 2 разных разбивать
const renderPhotoElements = (numberOfElements) => {
  // Контейнер для миниатюр фотографий
  const picturesContainer = document.querySelector('.pictures');
  // Шаблон для этих самых фото (расположен внизу разметки)
  const template = document.querySelector('#picture').content.querySelector('.picture');
  // Фрагмент для упаковки
  const fragment = document.createDocumentFragment();
  // А вот на этом этапе на основе данных создаются уже элементы страницы
  // Упаковываю фрагмент N-ным количеством элементов
  for (let i = 0; i < numberOfElements; i++) {
    let photoElement = template.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photosDescriptions[i].url;
    photoElement.querySelector('.picture__likes').textContent = photosDescriptions[i].likes;
    photoElement.querySelector('.picture__comments').textContent = photosDescriptions[i].comments.length;
    fragment.appendChild(photoElement);
  }
  // И выкидываю весь фрагмент на страницу
  picturesContainer.appendChild(fragment);
}

renderPhotoElements(SHOW_PHOTOS);

/*------------------------------------- БЛОК ПОКАЗА И СКРЫТИЯ БОЛЬШОГО ИЗОБРАЖЕНИЯ ------------------------------------- */

// Контейнер, отвечающий за полноэкранный показ изображения. Так же содержит в себе прочие метаданные.
const bigPicture = document.querySelector('.big-picture');

// Не нравится мне всё-таки название этой функции...

const addClickListener = function (picture) {
  
  picture.addEventListener('click', function () {
    const clickedPhotoIndex = parseInt((picture.src.substring(picture.src.length - 10)).match(/\d+/));
    const requiredPhotoInArray = photosDescriptions.filter(photo => parseInt((photo.url.substring(photo.url.length - 10)).match(/\d+/)) == clickedPhotoIndex);
    const [requiredPhoto] = requiredPhotoInArray;
    bigPicture.classList.remove('hidden');
    bigPicture.querySelector('.big-picture__img').children[0].src = requiredPhoto.url;
    bigPicture.querySelector('.likes-count').textContent = requiredPhoto.likes;
    bigPicture.querySelector('.social__caption').textContent = requiredPhoto.description;
    bigPicture.querySelector('.comments-count').textContent = requiredPhoto.comments.length;
    bigPicture.querySelector('.comments-count').style.color = 'red'; // временно, чтобы видел свою ошибку... уже забыл, что за ошибка

    const commentList = bigPicture.querySelector('.social__comments');
    while (commentList.firstChild) {
      commentList.removeChild(commentList.firstChild);
    }

    for (let i = 0; requiredPhoto.comments.length; i++) {
      commentList.insertAdjacentHTML('beforeend' ,
      `<li class="social__comment">
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

const miniatures = document.querySelectorAll('.picture__img');
for (let i = 0; i < miniatures.length; i++) { // переделай на пикчур оф пикучуз... фор ду вроде? Ну или фор оф.
  let miniature = miniatures[i];
  addClickListener (miniature);
}

/*------------------------*/

// Далее про закрывание большого изображения
// Так, похоже вижу косячек... слушатель эскейпа на документ должен веситься только при клике на миниатюре. И удаляться при её закрытии.

// Крестик закрытия полноэкранного просмотра
const closePhotoButton = bigPicture.querySelector('.big-picture__cancel');

// Функция, закрывающая модальное окно полноэкранного просмотра изображения
const closePhoto = () => {
  bigPicture.classList.add('hidden');
};

// Функция-обработчик клика по крестику
const onClosePhotoButtonClick = () => {
  closePhoto();
}

// Функция-обработчик нажатия на клавишу эскейп, КОТОРАЯ ДОЛЖНА ВЕШАТЬСЯ ТОЛЬКО ПРИ ОТКРЫТИИ МОДАЛКИ (клику по миниатюре)
// И убираться при закрытии модалки
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


// Кстати, Комодо драгон на движке Гугла (и девтулз у них вроде такой же, а софтвэйр_репортер_тул вроде не вытворяет - попробуй-ка его сделать основным браузером для разработки) И запиши уже себе где-нибудь, где висящие обработчики смотреть

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
//    // ВОТ ПОЧТИ ВСЁ ХОРОШО, НО ОН ВСЕГДА ПРОВЕРЯЕТ ТОЛЬКО ПОСЛЕДНИЙ ХЭШТЭГ МАССИВА - ЭТО ТОЧНО ПРО ЗАМЫКАНИЯ
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



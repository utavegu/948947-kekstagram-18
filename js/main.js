'use strict';

/*
НЕЗАКОНЧЕННЫЕ ЗАДАНИЯ

3-2:
1) В каждом рандомном объекте должно быть от 1 до 3 рандомных комментариев, не повторяющихся! (вот тут видимо сплайс-слайс пригодится). Имена авторов и коомментарии так же случайные.
2) Сообрази чонибудь с дескрипшинами. Пусть это будет дата, например. Массив дат. Без заморочек - просто строка.
3) Сделать функцию создания DOM-элемента на основе JS-объекта (пока это не функция у тебя)
4) Сделать функцию заполнения блока DOM-элементами на основе массива JS-объектов
(Пункты задания примерно соответствуют функциям, которые вы должны создать.)

3-3:
Список комментариев под фотографией: комментарии должны вставляться в блок .social__comments. Разметка каждого комментария должна выглядеть так:
<li class="social__comment">
  <img
    class="social__picture"
    src="img/avatar-{{случайное число от 1 до 6}}.svg"
    alt="{{Автор комментария}}"
    width="35" height="35">
  <p class="social__text">{{текст комментария}}</p>
</li>
*/

var COUNT_OF_PHOTOS = 26;
var MAX_AVATAR_NUMBER = 6;
var MIN_LIKES_NUMBER = 15;
var MAX_LIKES_NUMBER = 200;
var COMMENTS_VOCABULARY = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// Функция для создания случайного числа в заданном интервале
var generateRandomNumber = function (upperLimit, lowerLimit) {
  if (lowerLimit !== undefined) {
    return lowerLimit + Math.trunc(Math.random() * (upperLimit - lowerLimit));
  }
  return Math.ceil(Math.random() * upperLimit);
};

// Функция создания массива со случайными данными
var generateRandomData = function (count) {
  var exemplars = [];
  for (var i = 0; i < count; i++) {
    exemplars[i] = {
      url: 'photos/' + (i + 1) + '.jpg', // !!!!!Адреса картинок не должны повторяться!!!!!
      description: 'описание фотографии',
      likes: generateRandomNumber(MAX_LIKES_NUMBER, MIN_LIKES_NUMBER),
      comments: [
        {
          avatar: 'img/' + generateRandomNumber(MAX_AVATAR_NUMBER) + '.svg',
          message: COMMENTS_VOCABULARY[0],
          name: 'Вася'
        }
      ]
    };
  }
  return exemplars;
};

// Функция перемешивания массива
var mixArray = function (arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

var photoDescription = generateRandomData(COUNT_OF_PHOTOS);

photoDescription = mixArray(photoDescription);

// Место, куда буду вываливать превьюхи чужих фото
var picturesContainer = document.querySelector('.pictures');

// Шаблон для этих самых фото
var template = document.querySelector('#picture').content.querySelector('a');

// Фрагмент для упаковки
var fragment = document.createDocumentFragment();

// Упаковываю фрагмент N-ным количеством элементов
for (var i = 0; i < COUNT_OF_PHOTOS; i++) {
  var photoElement = template.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photoDescription[i].url;
  photoElement.querySelector('.picture__likes').textContent = photoDescription[i].likes;
  photoElement.querySelector('.picture__comments').textContent = photoDescription[i].comments.length;
  fragment.appendChild(photoElement);
}

picturesContainer.appendChild(fragment);

/* ------------------------------------------------------ */

// БЛОК ПОКАЗА БОЛЬШОГО ИЗОБРАЖЕНИЯ
var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');
bigPicture.querySelector('.big-picture__img').children[0].src = photoDescription[0].url;
bigPicture.querySelector('.likes-count').textContent = photoDescription[0].likes;
bigPicture.querySelector('.comments-count').textContent = photoDescription[0].comments.length;
bigPicture.querySelector('.comments-count').style.color = 'red'; // временно, чтобы видел свою ошибку
bigPicture.querySelector('.social__caption').textContent = photoDescription[0].description;

document.querySelector('.social__comment-count').classList.add('visually-hidden'); // Убрал счётчик комментариев
document.querySelector('.comments-loader').classList.add('visually-hidden'); // Убрал "Загрузить ещё"

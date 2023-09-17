import { getDataImages } from './utils';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const dateContainer = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

btnLoadMore.classList.replace('load-more', 'load-more-hidden');

let page = 1;
const perPage = 40;

const onHandleBtnSubmit = e => {
  e.preventDefault();
  dateContainer.innerHTML = '';
  const inputValue = e.target[0].value;
  // console.log(inputValue);

  getDataImages(inputValue, page, perPage)
    .then(r => {
      console.log(r);
      if (inputValue === '' || r.data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, nothing was found for your request or the data entered is incorrect, please check the entered data.'
        );
        btnLoadMore.classList.replace('load-more', 'load-more-hidden');
        return;
      }
      renderList(r.data.hits, dateContainer);
      btnLoadMore.classList.replace('load-more-hidden', 'load-more');
      Notiflix.Notify.info(`Hooray! We found ${r.data.totalHits} images.`);
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

const renderList = (arr, container) => {
  const markup = arr
    .map(
      item => `<div class="photo-card">
      <a href="${item.largeImageURL}">
      <img src="${item.webformatURL}" alt="${item.tags}" width="300" height="250"  loading="lazy" />
      </a>
      <div class="info">
         <p class="info-item">
          <b>Likes:</b>
           ${item.likes}         
           </p>
        <p class="info-item">
           <b>Views:</b>
          ${item.views}
         </p>
        <p class="info-item">
           <b>Comments:</b>
           ${item.comments}
         </p>
         <p class="info-item">
           <b>Downloads:</b>
          ${item.downloads}
         </p>
       </div> 
        </div>`
    )
    .join('');

  container.insertAdjacentHTML('beforeend', markup);

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
};

const onHandleClickBtnLoadMore = e => {
  const inputValueContent = input.value;
  page += 1;
  getDataImages(inputValueContent, page, perPage)
    .then(r => {
      // console.log(inputValueContent);
      console.log(r.data.hits.length);
      renderList(r.data.hits, dateContainer);
      if (r.data.hits.length < perPage) {
        btnLoadMore.classList.replace('load-more', 'load-more-hidden');
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

formEl.addEventListener('submit', onHandleBtnSubmit);
btnLoadMore.addEventListener('click', onHandleClickBtnLoadMore);

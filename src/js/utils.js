import axios from 'axios';
import Notiflix from 'notiflix';
export const API_KEY = '39406323-18b40e87edfb9cc743cee3413';
export const BASE_URL = 'https://pixabay.com/api/';

export const getDataImages = async (data, page, perPage) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: data,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    return response;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

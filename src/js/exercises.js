import { filterExercises } from './api';
const btnFilterList = document.querySelector('.btn-wrapper');
const exFilterBtn = document.querySelectorAll('.exercises-btn-filter');
const exList = document.querySelector('.exercises-list');
const exPagination = document.querySelector('.exercises-pagination');
const span = document.querySelector('.span');
const secondSpan = document.querySelector('.second-span');

let query = 'Muscles';

filterExercises(query).then(({ data: { results, totalPages } }) => {
  exFilterBtn[0].classList.add('is-active');
  exList.insertAdjacentHTML('beforeend', renderFilterItems(results));
  renderPagBtn(totalPages);
  exPagination.firstChild.classList.add('active-pag-btn');
});

btnFilterList.addEventListener('click', e => {
  //   exList.classList.remove('visually-hidden');
  span.classList.add('visually-hidden');
  const button = e.target;
  if (button.nodeName !== 'BUTTON') {
    return;
  }
  const activeFilterBtn = document.querySelector('.is-active');

  if (activeFilterBtn) {
    activeFilterBtn.classList.remove('is-active');
  }
  button.classList.add('is-active');
  query = button.textContent;

  filterExercises(query).then(({ data: { results, totalPages } }) => {
    exList.innerHTML = '';
    exList.insertAdjacentHTML('beforeend', renderFilterItems(results));

    renderPagBtn(totalPages);
    exPagination.firstChild.classList.add('active-pag-btn');
  });
});

exPagination.addEventListener('click', onPagBtnClick);

function onPagBtnClick(e) {
  let page = e.target.textContent;
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }
  const activePagBtn = document.querySelector('.active-pag-btn');
  if (activePagBtn) {
    activePagBtn.classList.remove('active-pag-btn');
  }
  e.target.classList.add('active-pag-btn');

  fetchEx(query, page);
}

function renderFilterItems(data) {
  return data
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ name, filter, imgUrl }) => `<li
          class="exercises-item"
          style="
          background:linear-gradient(0deg, rgba(16, 16, 16, 0.70) 0%, rgba(16, 16, 16, 0.70) 100%), url(${imgUrl});
          background-size: cover;
  background-repeat: no-repeat; 
          "
          data-name = "${name}"
          data-filter = "${filter.toLowerCase().split(' ').join('')}"
        >
        <div class = "text-wrapper">
          <p class="exercises-name" >${name}</p>
          <p class="exercises-text">${filter}</p>
          </div>
        </li>`
    )
    .join('');
}

function renderPagBtn(totalPages) {
  const buttons = Array(totalPages)
    .fill()
    .map(
      (_, idx) =>
        `<button class = "exercises-pagination-btn" type = "button">${
          idx + 1
        }</button>`
    )
    .join('');
  exPagination.innerHTML = '';
  exPagination.insertAdjacentHTML('beforeend', buttons);
}

function fetchEx(query, page) {
  return fetch(
    `https://energyflow.b.goit.study/api/filters?filter=${query}&page=${page}&limit=12`
  )
    .then(res => res.json())
    .then(({ results }) => {
      exList.innerHTML = '';
      exList.insertAdjacentHTML('beforeend', renderFilterItems(results));
    });
}
exList.addEventListener('click', e => {
  const exSubtype = e.target.dataset.name;
  let exFilter = e.target.dataset.filter;

  if (exFilter === 'bodyparts') {
    exFilter = 'bodypart';
  }

  span.classList.remove('visually-hidden');

  exList.innerHTML = '';
  exPagination.innerHTML = '';
  secondSpan.textContent = exSubtype;
  fetch(
    `https://energyflow.b.goit.study/api/exercises?${exFilter}=${exSubtype}&page=1&limit=10`
  )
    .then(res => res.json())
    .then(({ results }) => console.log(results));
});

import Notiflix from 'notiflix';

function createPromise(position, delay) {
  console.log(delay);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      
      const promisedObject = {
        position,
        delay,
      };
      if (shouldResolve) {
        resolve(promisedObject);// Fulfill
      }
      else {
        reject(promisedObject);// Reject
      }
    }, delay);
  });
}

const formElem = document.querySelector(".form");

formElem.addEventListener("submit", makePromises);

function makePromises(event) {
  event.preventDefault();
  const formPromiseData = new FormData(formElem);

  let currentDelay = Number.parseInt(formPromiseData.get("delay"));

  for (let promiseNumber = 0; promiseNumber < formPromiseData.get("amount"); promiseNumber++) {
    createPromise(promiseNumber, currentDelay)
      .then(({ position, delay }) => {
            Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
          })
      .catch(({ position, delay }) => {
            Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
          });

    currentDelay += Number.parseInt(formPromiseData.get("step"));
  }
}
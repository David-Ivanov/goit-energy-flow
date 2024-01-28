import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";
import { subscribe } from './api';

const form = document.querySelector(".footer-form");
const emailInput = document.querySelector(".footer-form-input");

const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();

  if (!emailPattern.test(email)) {
    showError("Invalid email address");
    return;
  }

  try {
    subscribe(email);
    if (subscribe.ok) {
      showSend();
    } else {
      showError();
    }
  } catch (error) {
    showError();
  } finally {
    form.reset();
  }
});

function showSend() {
  iziToast.info({
    title: "Info",
    message:
      "We're excited to have you on board! 🎉 Thank you for subscribing to new exercises on Energy Flow. You've just taken a significant step towards improving your fitness and well-being.",
    position: 'center',
  });
}

function showError() {
  iziToast.error({
    title: "Error",
    message:
      "Sorry, there was an error sending your address. Please try again!",
    position: "center",
  });
}
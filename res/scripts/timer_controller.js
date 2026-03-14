/*
 * MIT License
 *
 * Copyright (c) 2026:
 * vatofichor - Sebastian Mass     [>_<]
 * & Assisted By Gemini Antigravity /|\  
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @file timer_controller.js
 * @description Independent Tooling. Timer functionality providing countdown capabilities with visual and auditory notifications.
 */
var soundurl = getsoundurl();
var dingSound = new Audio(soundurl);

const secondsInput = document.getElementById("secondsInput");
const timeDisplay = document.getElementById("timeDisplay");
const toggleButton = document.getElementById("timer");

let timer;
let currentTime = 0;
let isRunning = false;


function updateDisplay() {
	const hours = Math.floor(currentTime / 3600);
	const minutes = Math.floor((currentTime % 3600) / 60);
	const seconds = currentTime % 60;

	timeDisplay.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}


function getsoundurl() {
	return document.getElementById('sound-url').value;
}


function formatTime(time) {
	return time < 10 ? `0${time}` : time;
}


function toggleTimer() {
	if (isRunning) {
		clearInterval(timer);
		secondsInput.value = currentTime;
		updateDisplay();
		toggleButton.textContent = "Start";
	} else {
		currentTime = parseInt(secondsInput.value) || 0;
		updateDisplay();

		timer = setInterval(() => {
			if (currentTime <= 0) {
				clearInterval(timer);
				toggleButton.textContent = "Start";
				isRunning = false;
				dingSound.src = getsoundurl();
				dingSound.play();
			} else {
				currentTime--;
				updateDisplay();
			}
		}, 1000);

		toggleButton.textContent = "Stop";
	}

	isRunning = !isRunning;
}

toggleButton.addEventListener("click", toggleTimer);
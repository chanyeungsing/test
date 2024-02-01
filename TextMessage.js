class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
    this.ResponseQuestion = null;
    this.ResponseChoices = null;
    this.ResponseAnswer = null;
  }

  getQuestion() {
    fetch("https://us-central1-fyp-a08.cloudfunctions.net/get_question")
      .then(response => response.json())
      .then(data => {
        this.ResponseQuestion = data.question;
        this.ResponseChoices = data.choices;
        this.ResponseAnswer = data.answer;
        this.changeQuestionContext();
      })
      .catch(error => {
        console.error("Error fetching question:", error);
      });
  }

  changeQuestionContext() {
    document.getElementById("TextMessage").innerText = this.ResponseQuestion;
    document.getElementById("selectA").innerText = "A: " + this.ResponseChoices.A;
    document.getElementById("selectB").innerText = "B: " + this.ResponseChoices.B;
    document.getElementById("selectC").innerText = "C: " + this.ResponseChoices.C;
    document.getElementById("selectD").innerText = "D: " + this.ResponseChoices.D;
  }

  verifyAnswer(selectedValue) {
    if(selectedValue === this.ResponseAnswer){
      console.log("good")
    } else{
      console.log("not good")
    }
  }

  createElement() {
    // Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = `
      <p class="TextMessage_p" id="TextMessage" style="font-size:1px;"></p>
      <button class="Select_button" id="selectA" data-question="A">A</button>
      <button class="Select_button" id="selectB" data-question="B">B</button>
      <button class="Select_button" id="selectC" data-question="C">C</button>
      <button class="Select_button" id="selectD" data-question="D">D</button>
      <button class="TextMessage_button" id="nextButton">Next</button>
    `;

    // Initialize the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text
    });

    this.element.querySelector("#nextButton").addEventListener("click", () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    });

    this.element.querySelectorAll(".Select_button").forEach(button => {
      button.addEventListener("click", (event) => {
        console.log("Selected value:");
        const selectedValue = event.target.dataset.question;
        console.log(selectedValue);
        this.verifyAnswer(selectedValue);
      });
      this.done()
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    this.getQuestion();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
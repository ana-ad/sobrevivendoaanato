document.addEventListener("DOMContentLoaded", function() {
  const areas = document.querySelectorAll('area');
  const feedback = document.getElementById('feedback');
  const question = document.getElementById('question');
  const nextButton = document.getElementById('nextButton');
  let structures = [
    "Pré-maxilar",
    "Maxilar",
    "Jugal",
    "Pré-frontal",
    "Frontal",
    "Parietal",
    "Crista supraoccipital",
    "Pós-orbital",
    "Esquamosal",
    "Quadrado",
    "Quadrado-Jugal"
  ];
  
  const totalQuestions = structures.length; // Total de perguntas
  let currentStructure = null;
  let clickable = true;
  let questionCounter = 0;
  let correctAnswers = 0;
  let wrongStructures = [];
  let structureSelected = false; // Variável para controlar se alguma estrutura foi selecionada

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function resetFeedback() {
    feedback.textContent = "";
  }

  function resetQuiz() {
    if (questionCounter === totalQuestions) {
      question.textContent = "Quiz Concluído!";
      question.setAttribute("id", "titulo_final");
      nextButton.style.display = "none";
      const resultMessage = document.createElement('p');
      resultMessage.setAttribute("class","mensagem_final");
      resultMessage.textContent = `Você acertou ${correctAnswers} de ${totalQuestions} perguntas.`;
      question.appendChild(resultMessage);
      if (wrongStructures.length > 0) {
        const wrongStructuresList = document.createElement('ul');
        wrongStructuresList.setAttribute("class", "a-melhorar");
        wrongStructures.forEach(structure => {
          const listItem = document.createElement('li');
          listItem.textContent = structure;
          wrongStructuresList.appendChild(listItem);
        });
        const wrongStructuresTitle = document.createElement('h4');
        wrongStructuresTitle.setAttribute("class", "a_melhorar__titulo");
        wrongStructuresTitle.textContent = "Estruturas Incorretas:";
        question.appendChild(wrongStructuresTitle);
        question.appendChild(wrongStructuresList);
      } else {
        // Se não houver estruturas incorretas, exibir mensagem de parabéns
        const congratsMessage = document.createElement('p');
        congratsMessage.textContent = "Parabéns! Você gabaritou o quiz e não há estruturas para melhorar :)";
        congratsMessage.setAttribute("class", "parabens");
        question.appendChild(congratsMessage);
      }
      // Limpar o feedback
      resetFeedback();
    } else {
      currentStructure = structures.pop();
      question.textContent = `Questão ${questionCounter + 1}/${totalQuestions}: Aponte a estrutura: ${currentStructure}`;
      resetFeedback();
      clickable = true;
      structureSelected = false; // Resetar a variável de controle para cada nova pergunta
      // Reativar eventos de clique nas áreas da imagem para a nova pergunta
      areas.forEach(area => {
        area.addEventListener('click', handleAreaClick);
      });
    }
  }

  function handleAreaClick(event) {
    if (!clickable) return;

    clickable = false;
    const clickedStructure = event.target.getAttribute('title');

    if (clickedStructure === currentStructure) {
      feedback.textContent = "Correto!";
      correctAnswers++;
    } else {
      feedback.textContent = "Incorreto!";

      const correctArea = document.querySelector(`area[title="${currentStructure}"]`);
      correctArea.classList.add('highlight-correct');

      // Adicionar estrutura incorreta à lista
      wrongStructures.push(currentStructure);
    }

    // Desativar eventos de clique nas áreas da imagem após o feedback
    areas.forEach(area => {
      area.removeEventListener('click', handleAreaClick);
    });

    questionCounter++;
  }

  function handleNextButtonClick() {
    if (!structureSelected) { // Verificar se alguma estrutura foi selecionada
      alert("Aponte uma estrutura para continuar");
      return;
    }

    resetQuiz();
  }

  function handleKeyPress(event) {
    // Verificar se a tecla pressionada é Enter (código 13)
    if (event.keyCode === 13) {
      handleNextButtonClick();
    }
  }

  areas.forEach(area => {
    area.addEventListener('click', function() {
      areas.forEach(area => {
        area.classList.remove('selected');
      });
      this.classList.add('selected');
      structureSelected = true; // Definir como verdadeiro quando uma estrutura for selecionada
    });
  });

  nextButton.addEventListener('click', handleNextButtonClick);
  document.addEventListener('keypress', handleKeyPress);

  shuffle(structures);
  resetQuiz();
});
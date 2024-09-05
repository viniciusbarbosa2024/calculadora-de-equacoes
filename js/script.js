'use strict'

const screen = document.getElementById("screen");
const solve = document.getElementById("solve")
const clear = document.getElementById("clear");
const deleteCharacter = document.getElementById("deleteCharacter");
const percentage = document.getElementById("percentage");
const division = document.getElementById("division");
const multiplication = document.getElementById("multiplication");
const subtraction = document.getElementById("subtraction");
const addition = document.getElementById("addition");
const parentheses = document.getElementById("parentheses");
const comma = document.getElementById("comma");
const equals = document.getElementById("equals");
const variableX = document.getElementById('variableX')
const variableX2 = document.getElementById('variableX2')


//Array que conterá todos os botões de números
const buttonNumber = Array(10);
buttonNumber.fill(null);

//Adicionando os botões de números no array
buttonNumber.forEach((element, index) => {
  buttonNumber[index] = document.getElementById(`number${index}`);
});

const ExpressionArray = [];

let cursorPosition = ExpressionArray.length;

//Adicionando listeners

document.addEventListener("DOMContentLoaded", displayCursor);
document.addEventListener("DOMContentLoaded", preventDirectManipulationOfExpression);

screen.addEventListener("click", checkCursorPosition);

screen.addEventListener("keydown", (e) => {
  e.preventDefault(); //Impedir manipulação da expressão usando o teclado
});

solve.addEventListener('click',() => generalFunction('solve'))

buttonNumber.forEach((element, index) => {
  buttonNumber[index].addEventListener("click", () =>
    generalFunction(Number(index))
  );
});

clear.addEventListener("click", () => generalFunction("clear"));
deleteCharacter.addEventListener("click", () =>
  generalFunction("deleteCharacter")
);
percentage.addEventListener("click", () => generalFunction("%"));
division.addEventListener("click", () => generalFunction("/"));
multiplication.addEventListener("click", () => generalFunction("*"));
subtraction.addEventListener("click", () => generalFunction("-"));
addition.addEventListener("click", () => generalFunction("+"));
parentheses.addEventListener("click", () =>
  generalFunction(openOrCloseParentheses())
);
comma.addEventListener("click", () => generalFunction(","));
equals.addEventListener("click", () => generalFunction("="));
variableX.addEventListener('click',() => generalFunction('x'))
variableX2.addEventListener('click',() => generalFunction('x^2'))


function displayCursor() {
  screen.focus();
  screen.setSelectionRange(cursorPosition, cursorPosition);
}

function preventDirectManipulationOfExpression() {
   if (window.screen.width <= 992) {
    screen.setAttribute('disabled','')
   }
} 

//Retorna um array com os índices dos parênteses(ou de abertura ou de fechamento,a depender do ParentheseType) que aparecem antes do cursor
function getIndexesParenthesesBeforeTheCursor(ParentheseType) {
    return ParentheseType.filter(
        (element) => element < cursorPosition
      )
}

function characterBeforeThecursorIsAClosingParenthesis() {
    if (characterBeforeCursor() === ')') {
        return true
    } else {
        return false
    }
}

function typeOfCharacterBeforeCursor() {
  return typeof ExpressionArray[cursorPosition - 1]
}

function characterBeforeCursor() {
  return ExpressionArray[cursorPosition - 1]
}

function getIndexesParentheses(type) {
  let IndexesOpeningParentheses = [];
  let IndexesClosingParentheses = [];

  ExpressionArray.forEach((element, index) => {
    if (element === "(") {
      IndexesOpeningParentheses.push(Number(index));
    } else if (element === ")") {
      IndexesClosingParentheses.push(Number(index));
    }
  });

  if (type === 'OpeningParentheses') {
    return IndexesOpeningParentheses
  } else if (type === 'ClosingParentheses') {
    return IndexesClosingParentheses
  }
}

function numberOfParenthesesBeforeTheCursor(type) {
  return getIndexesParenthesesBeforeTheCursor(getIndexesParentheses(type)).length
}


function openOrCloseParentheses() {
    if (
      numberOfParenthesesBeforeTheCursor('OpeningParentheses') ==
      numberOfParenthesesBeforeTheCursor('ClosingParentheses')
    ) {
        
        return '('

    } else if (characterBeforeThecursorIsAClosingParenthesis()) {
        
        return ')'
    
    } else if (typeOfCharacterBeforeCursor() == 'string') {
        return '('
    } else if (typeOfCharacterBeforeCursor() == 'number') {
        return ')'
    }
  }


function displayOnScreen(string) {
  screen.value = string;
}

function clearExpressionArray() {
  ExpressionArray.splice(0);
}

//O reset do valor do cursorPosition faz com que o cursor apareça no final da expressão
function resetCursorPosition() {
  cursorPosition = ExpressionArray.length;
}

function clearAll() {
  clearExpressionArray();

  resetCursorPosition();
}

function deleteDesiredCharacter() {
  ExpressionArray.splice(cursorPosition - 1, 1);
}

function identifyExpression(expression) {
  let stringExpression = "";
  

  expression.forEach((element, index) => {
    
    if (element == ",") {
      expression[index] = ".";
    } else if (element == "%") {
      expression[index] = "/100*";
    }

    stringExpression += expression[index];
  });

  return stringExpression;
}

function solveExpression(expression) {
  return parseFloat(eval(expression).toFixed(10));
}

function arrayToString(array) {
  let string = "";

  array.forEach((element) => {
    string += String(element);
  });

  return string;
}

function storeValueAndDisplayIt(value) {
  ExpressionArray.splice(cursorPosition, 0, value);

  displayOnScreen(arrayToString(ExpressionArray));

}

function checkCursorPosition(e) {
  cursorPosition = screen.selectionStart;
}

//Define o updateParameter
function setUpdateParameter(typeOfModificationInTheExpression) {
  switch (typeOfModificationInTheExpression) {
    case "add":
      return 1;
    case "keep":
      return 0;
    case "remove":
      return -1;
  }
}

//Atualiza valor da variável cursorPosition
function updateCursorPositionVariableValue(updateParameter) {
  cursorPosition = cursorPosition + updateParameter;
}

//Posiciona o cursor da tela na posição correta
function positionCursorOnScreen() {
  screen.setSelectionRange(cursorPosition, cursorPosition);
}

//Atualiza a posição do cursor na tela
function updateCursorPositionOnScreen(typeOfModificationInTheExpression) {
  //Esta variável serve para orientar a definição da posição do cursor na tela dependendo do tipo de modificação que ocorreu na expressão (aumento, manutenção ou diminuição do tamanho da expressão)
  let updateParameter = setUpdateParameter(typeOfModificationInTheExpression);

  screen.focus();

  updateCursorPositionVariableValue(updateParameter);

  positionCursorOnScreen();
}

function enableTheUseOfTheResultForNewOperations(result) {
  clearExpressionArray();

  let ResultArrayInString = String(result).split("");

  ResultArrayInString.forEach((element) => {
    //Essas condicionais funcionam porque o result só pode ser um único número real (Ex.: 10,-8,6.32), não podendo ser uma expressão (Ex.: 6-5, 6.35*9.4)

    if (element === ".") {
      //Caso de result ser um número não inteiro
      ExpressionArray.push(",");
    } else if (element === "-") {
      //Caso de result ser um número negativo
      ExpressionArray.push(element);
    } else {
      ExpressionArray.push(Number(element));
    }
  });
}


function characterBeforeCursorIsAOperator() {
  if (valueType(characterBeforeCursor()) === 'operator') {
    return true
  } else {
    return false
  }
}

function valueToBeAddedIsNotParentheses(value) {
  if (value === "(" || value === ")") {
    return false;
  } else {
    return true;
  }
}

function ThereAreClosedParenthesesImmediatelyBeforeTheCursor() {
  if (numberOfParenthesesBeforeTheCursor('OpeningParentheses') === numberOfParenthesesBeforeTheCursor('ClosingParentheses') && characterBeforeCursor() === ')') {
    return true
  } else {
    return false
  }
}

//Identifica o tipo do value (number,operator e etc.)
function valueType(value) {
  switch (typeof value) {
    case 'number':
      return 'number'
    case 'string':
      if (value === '(' || value === ')') {
        return 'parenthese'
      } else if (value === 'x' || value === 'x^2') {
        return 'variable'
      } else {
        return 'operator'
      }
      
  }
}

//Condição para adicionar o operador de multiplicação antes da abertura de parênteses
function conditionForAddingMultiplicationOperator() {
  if (valueType(characterBeforeCursor()) === 'number' || ThereAreClosedParenthesesImmediatelyBeforeTheCursor()) {
    return true
  } else {
    return false
  }
}

function characterBeforeCursorIsAVariable() {
  if (valueType(characterBeforeCursor()) === 'variable') {
    return true
  } else {
    return false
  }
}

function theElementIsANumber(element) {
  if (valueType(element) === 'number') {
    return true
  } else {
    return false
  }
}

function theIndexRefersToTheLastElementOfTheArray(index) {
  if (index === ExpressionArray.length-1) {
    return true
  } else {
    return false
  }
}

function theElementIsAOperator(element) {
  if (valueType(element) === 'operator') {
    return true
  } else {
    return false
  }
}

function theElementBeforeThisOneIsANumber(index) {
  if (valueType(ExpressionArray[index-1]) === 'number') {
    return true
  } else {
    return false
  }
}

function theElementIsNotThefirstInTheExpression(index) {
  if (index === 0) {
    return false
  } else {
    return true
  }
}

//Formatar expressão de forma que os coeficentes da equação fiquem facilmente identificáveis (Transforma por exemplo [1,2,5,*,x+,1,2,=,1,4,2] em [125,*,x,+,12,=142])
function formatExpression(expression) {
  let numberMaker = ''
  let formattedExpression = [...expression]
  let addendOfCorrection = 0
  
  expression.forEach((element,index)=> {
    if (theElementIsANumber(element)) {
      if (theIndexRefersToTheLastElementOfTheArray(index)) {
        //Ver * no fim desta função
        
        numberMaker+=String(element)

        formattedExpression.splice(index - addendOfCorrection - numberMaker.length + 1,numberMaker.length,Number(numberMaker))

        numberMaker=''
      } else {
        numberMaker+=String(element)
      }
    } else if (theElementBeforeThisOneIsANumber(index) &&(theElementIsAOperator(element) || element ===')' ) && theElementIsNotThefirstInTheExpression(index)){
      //Ver * no fim desta função
      
      formattedExpression.splice(index - addendOfCorrection - numberMaker.length,numberMaker.length,Number(numberMaker))

      addendOfCorrection += numberMaker.length - 1

      numberMaker=''
    }
  })

  return formattedExpression
  //* A addendOfCorrection serve para que o index da ExpressionArray seja correspondente ao index da formattedExpression (iniciamente cópia da ExpressionArray) que sofre redução no número de elementos devido ao uso do splice
}

function getCoefficienteA(equation,positionOfXInTheEquation) {
  //Dado formattedExpression do tipo
  
  if (equation.indexOf('x') - 3 >=0) {
    return Number(equation[positionOfXInTheEquation - 3] + equation[positionOfXInTheEquation-2])
  } else {
    return Number(equation[positionOfXInTheEquation -2])
  }
}

function getCoefficienteB(equation,positionOfXInTheEquation) {
  return Number(equation[positionOfXInTheEquation+1] + equation[positionOfXInTheEquation+2])
}

function solveEquation(equation) {
  //Toda função de primeiro grau pode ser reduzida à ax+b=0, sendo portanto x=-b/a

  //Dado uma expressão do tipo [a,*,'x',+,b,=,0]

  let positionOfXInTheEquation = equation.indexOf('x')

  let a = getCoefficienteA(equation,positionOfXInTheEquation)

  let b = getCoefficienteB(equation,positionOfXInTheEquation)

  let valueOfX = -b/a

  return valueOfX
}

function theOperatorIsInvalidToBeTheFirstElementOfTheExpression(value) {
  //Dos operadores somente o '-' pode ser o primeiro da expressão,pois ele é o indicativo de um número negativo
  if (value === '-') {
    return false
  } else {
    return true
  }
  
}

//Retorna o array da expressão no membro direito da equação
function getRightLimb(expression,positionOfEqual) {
  return expression.slice(positionOfEqual+1)
}

function reduceNumericalPartToCoefficientB(numericalPartOfTheLeftLimb,rightLimb) {
  return numericalPartOfTheLeftLimb - rightLimb
}

function setSign(coefficientB) {
  return coefficientB > 0 ? '+' : '-'
}

//Obtém a parte numérica do membro esquerdo da equação levando em consideração expressões numéricas anteriores ao x e posteriores a este
function getNumericalPartOfTheLeftLimb(expression,positionOfX,positionOfEqual) {
  let numericalPartOfTheLeftLimbAnteriorToX = null

  let numericalPartOfTheLeftLimbPosteriorToX = expression.slice(positionOfX+1,positionOfEqual)

  if (numericalPartOfTheLeftLimbPosteriorToX.length === 0) {
   numericalPartOfTheLeftLimbPosteriorToX.push(0)
  }

  //Casos em que não há expressão numérica anterior ao x: [a,*,x,+,i,=,j] e [-,a,*,x,+,i,=,j],seno i e j expressões numéricas quaisquer. Em ambos os casos,positionOfX <=3,logo:

  if (positionOfX > 3) {
      //Há uma expressão numérica anterior ao a*x
      numericalPartOfTheLeftLimbAnteriorToX = expression.slice(0,positionOfX-3)

      return [...numericalPartOfTheLeftLimbAnteriorToX,...numericalPartOfTheLeftLimbPosteriorToX]

      
  } else {
      return numericalPartOfTheLeftLimbPosteriorToX
  }
}

function getIndexesOfX(expression) {
  let indexesOfX = []
  expression.forEach((element,index)=> {
    if(element === 'x') {
      indexesOfX.push(index)
    }
  })

  return indexesOfX
}

function getIndexesOfOccurrencesOfX(indexesOfX,positionOfEqual,limb) {
  if (limb === 'left') {
    return indexesOfX.filter((indexes)=>indexes < positionOfEqual)
  } else if (limb === 'right') {
    return indexesOfX.filter((indexes)=>indexes > positionOfEqual)
  }
}

function calculateCoefficientA(coefficientsOfOccurrencesOfXInTheLeftLimb,coefficientsOfOccurrencesOfXInTheRightLimb) {
  if (coefficientsOfOccurrencesOfXInTheRightLimb.length === 0) {
    return solveExpression(identifyExpression(coefficientsOfOccurrencesOfXInTheLeftLimb))
  } else {
  
    return (
      solveExpression(identifyExpression(coefficientsOfOccurrencesOfXInTheLeftLimb)) - solveExpression(identifyExpression(coefficientsOfOccurrencesOfXInTheRightLimb))
    )

  }
}

function removeAllOccurrencesOfXInTheExpression(indexesOfX,positionOfEqual,expression) {
  indexesOfX.forEach((indexOfX) => {
    if (indexOfX === 2 || indexOfX === positionOfEqual+3) {
      expression.splice(indexOfX-2,3,null,null,null)
    } else {
      expression.splice(indexOfX-3,4,null,null,null,null)
    }
  })

  return expression.filter((element)=> element != null)
}

function addXAndCoefficientA(coefficientA,expression) {
  if (coefficientA < 0) {
    expression.unshift('-',Math.abs(coefficientA),'*','x')
  } else {
    expression.unshift(coefficientA,'*','x')
  }

  return expression
}

function checkIfTheLeftMemberIsEmpty(expression) {
  if (expression[expression.length-1] === '=') {
    expression.push(0)
  }

  return expression
}

function checkForAbsenceOfSignalInElement3(expression) {
  if (typeof expression[3] === 'number') {
    expression.splice(3,0,setSign(expression[3]))
  }

  return expression
}

function reduceExpressionSoThatItHasOnlyOneOccurrenceOfX(expression) {
  let positionOfEqual = expression.indexOf('=')
  
  let indexesOfX = getIndexesOfX(expression)
  

  let indexesOfOccurrencesOfXInTheLeftLimb = getIndexesOfOccurrencesOfX(indexesOfX,positionOfEqual,'left')

  let indexesOfOccurrencesOfXInTheRightLimb = getIndexesOfOccurrencesOfX(indexesOfX,positionOfEqual,'right')


  let coefficientsOfOccurrencesOfXInTheLeftLimb = []
  let coefficientsOfOccurrencesOfXInTheRightLimb = []
  
  indexesOfOccurrencesOfXInTheLeftLimb.forEach((indexOfX)=> {
    
    if (indexOfX === 2) {
      coefficientsOfOccurrencesOfXInTheLeftLimb.push('+')
      coefficientsOfOccurrencesOfXInTheLeftLimb.push(expression[indexOfX-2])

    } else {
      coefficientsOfOccurrencesOfXInTheLeftLimb.push(expression[indexOfX-3])

      coefficientsOfOccurrencesOfXInTheLeftLimb.push(expression[indexOfX-2])
    }
  })

  indexesOfOccurrencesOfXInTheRightLimb.forEach((indexOfX)=> {
    if (indexOfX === positionOfEqual+3) {
      coefficientsOfOccurrencesOfXInTheRightLimb.push('+',expression[indexOfX-2])
    } else {
      coefficientsOfOccurrencesOfXInTheRightLimb.push(expression[indexOfX-3],expression[indexOfX-2])
    }
  })

  let coefficientA = calculateCoefficientA(coefficientsOfOccurrencesOfXInTheLeftLimb,coefficientsOfOccurrencesOfXInTheRightLimb)
  
  expression = removeAllOccurrencesOfXInTheExpression(indexesOfX,positionOfEqual,expression)

  expression = addXAndCoefficientA(coefficientA,expression)

  expression = checkIfTheLeftMemberIsEmpty(expression)

  expression = checkForAbsenceOfSignalInElement3(expression)

  return expression

}

//Reduzir expressão para a forma ax+b=0
function getExpressionInCanonicalForm(expression) {
  if (expression.indexOf('x') != expression.lastIndexOf('x')) {
    expression = reduceExpressionSoThatItHasOnlyOneOccurrenceOfX(expression)
  }

  let positionOfEqual = expression.indexOf('=')
  let positionOfX = expression.indexOf('x')
  
  let rightLimb = getRightLimb(expression,positionOfEqual)

  
  let numericalPartOfTheLeftLimb = getNumericalPartOfTheLeftLimb(expression,positionOfX,positionOfEqual)
    
  
  rightLimb = solveExpression(identifyExpression(rightLimb))

  numericalPartOfTheLeftLimb = solveExpression(identifyExpression(numericalPartOfTheLeftLimb))

  let coefficientB = reduceNumericalPartToCoefficientB(numericalPartOfTheLeftLimb,rightLimb)

  let signOfCoefficientB = setSign(coefficientB)

  expression.splice(positionOfX+1)

  let expressionArrayInCanonicalForm =[...expression,signOfCoefficientB,Math.abs(coefficientB),'=',0]

  return expressionArrayInCanonicalForm
}

function generalFunction(value) {
  switch (value) {
    case "clear":
      clearAll();

      displayOnScreen(arrayToString(ExpressionArray));

      displayCursor();

      break;

    case "deleteCharacter":
      if (ExpressionArray.length === 0) {

        displayCursor()

        return
      } else {
        deleteDesiredCharacter();

        displayOnScreen(arrayToString(ExpressionArray));

        updateCursorPositionOnScreen("remove");
      }

      break;

    case "solve":
      //Referente ao solução de equações
    
      if (ExpressionArray.includes('x')) {
        let formattedExpression = formatExpression(ExpressionArray)
        
        let expressionArrayInCanonicalForm = getExpressionInCanonicalForm(formattedExpression)
        
        let valueOfX = solveEquation(expressionArrayInCanonicalForm)

        displayOnScreen(`x = ${valueOfX}`)
      }

      //----------------------------------
    
      let result = solveExpression(identifyExpression(ExpressionArray));

      displayOnScreen(result.toLocaleString("pt-br"));

      enableTheUseOfTheResultForNewOperations(result);

      resetCursorPosition();

      updateCursorPositionOnScreen("keep");

      break;

    default:
      switch (valueType(value)) {
        case 'number': 
          if (characterBeforeCursorIsAVariable()) {
            storeValueAndDisplayIt('*')

            updateCursorPositionOnScreen('add')

            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')

          } else {
            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          }
      
          break

        case 'operator': 
          if (characterBeforeCursorIsAOperator() || (ExpressionArray.length === 0 &&theOperatorIsInvalidToBeTheFirstElementOfTheExpression(value))) {
            alert('formato inválido')
            displayCursor()
          } else {
            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          }
          break

        case 'parenthese':
          if (value === '(' && conditionForAddingMultiplicationOperator()) {
            storeValueAndDisplayIt("*");

            updateCursorPositionOnScreen("add");

            storeValueAndDisplayIt(value);

            updateCursorPositionOnScreen("add");
          } else {
            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          }
          break

        case 'variable':
          if (valueType(characterBeforeCursor()) === 'number' || valueType(characterBeforeCursor()) === 'parenthese') {
            storeValueAndDisplayIt('*')

            updateCursorPositionOnScreen('add')

            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          } else if (characterBeforeCursor() === '*') {
            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          } else {
            storeValueAndDisplayIt(1)

            updateCursorPositionOnScreen('add')

            storeValueAndDisplayIt('*')

            updateCursorPositionOnScreen('add')

            storeValueAndDisplayIt(value)

            updateCursorPositionOnScreen('add')
          }
        
          
          break
      }
  }
}

//Resolver problema de da expressão sem expressão numérica no lado esquerdo

//Resolver problema dos números negativos após o '='
  //Esse problema demanda bastante tempo e é preferível que seja resolvido no final

//Validações das vírgulas

//Validação do =


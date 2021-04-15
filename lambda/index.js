//
// Alexa meal planner sample for beginners
//
const Alexa = require("ask-sdk-core");

const rp = require("request-promise-native");

async function getData(diet,maxcalories) {
  var options = {
    uri: `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&diet=${diet}&maxcalories=${maxcalories}&apiKey=PutAPIKeyHere`,
    json: true,
  };

  var response = await rp(options);
  return response;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Hi, I can help you plan your meals for the day. You could request a specific diet with target calories for the day. For example, you can say get me a vegan meal plan that gives me 2000 calories per day";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const MealIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "MealIntent"
    );
  },
  async handle(handlerInput) {
    const maxcalories =
      handlerInput.requestEnvelope.request.intent.slots.maxcalories.value;
    const diet   =
      handlerInput.requestEnvelope.request.intent.slots.diet.value;
    let speakOutput = "";
    await getData(diet,maxcalories)
      .then((response) => {
        speakOutput = `Okay, you can have these 3 dishes for the day :1) ${response["meals"][0]["servings"]} servings of ${response["meals"][0]["title"]} :2) ${response["meals"][1]["servings"]} servings of ${response["meals"][1]["title"]} :3)  ${response["meals"][2]["servings"]} servings of ${response["meals"][2]["title"]} `;
      })
      .catch((err) => {
        console.log(err);
        speakOutput = `I could not generate a meal plan for your choices. Please try again.`;
      });
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    MealIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

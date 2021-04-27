# Alexa Meal Planner

Alexa Skill - Meal Planner
 
This Alexa Skill presents meal options for a day based on the target calories and diet preferences of the user. It uses the Spoonacular API for generating the meal plan.
https://spoonacular.com/food-api/docs#Generate-Meal-Plan

### This skill is part of the Alexa Skill Development Workshop

### Steps to importing and running this Skill

1) Sign up for an Alexa developer account - https://developer.amazon.com/docs/app-submission/manage-account-and-permissions.html#create_account

2) Sign up for a Spoonacular API account - https://spoonacular.com/food-api/console#Dashboard

### Import and update Code from Github

3) Go to Alexa console, under Skills, click _Create skill_. Enter the Skill Name as _Meal Planner_. Leave _Engligh (US)_ as the default language. Choose Custom under _Choose a model to add to your skill_. Choose Alexa-hosted (Node.js) under _Choose a method to host your skill's backend resources_. Click _Create Skill_. 

![image](https://user-images.githubusercontent.com/9892791/116184733-5d240100-a6ee-11eb-9a8e-70f1497f0112.png)

4) In the next page that opens up, choose _Start From Scratch_. Click _Import Skill_. In the dialog that opens up, provide the URL of this git repository https://github.com/shailsur-2021/alexa.git. 

![image](https://user-images.githubusercontent.com/9892791/116185119-f8b57180-a6ee-11eb-92a2-7c887fdeb36b.png)

5) Once the code is imported successfuly, click on the newly imported _Meal Planner_ skill.

![image](https://user-images.githubusercontent.com/9892791/116185801-56968900-a6f0-11eb-8983-f03250c99451.png)


6) Next, click on the Invocation menu under Build menu on the left navigation. Customize the invocation to anything suitable like, '_plan my meal'_. This phrase becomes your Meal Planner Skill invocation. 

![image](https://user-images.githubusercontent.com/76848465/115782293-1e561a00-a381-11eb-91ed-e4a1cbdf135b.png)

7) Click on Save Model to save your invocation phrase.

![image](https://user-images.githubusercontent.com/9892791/116187203-15ec3f00-a6f3-11eb-9a57-19a6a4c41c53.png)


8) Click on the Build menu. Look into the MealIntent. Examine the _Sample utterances_.

![image](https://user-images.githubusercontent.com/76848465/115781674-4b55fd00-a380-11eb-99ba-4fc00e8122e2.png)

8) Look into the Slots _maxcalories_ and _diet_ under MealIntent. 

![image](https://user-images.githubusercontent.com/76848465/115781780-7b050500-a380-11eb-85d4-7dc073b415f6.png)

Examine the _Alexa speech prompts_ and _User utterance_ sections. Add _How many calories would you consume per day?_ under Alexa speech prompts for the maxcalories slot. Add _I can't live without {maxcalories} per day_ under _User utterances_. Let's understand what we have seen so far.

8) Get to code under the _Code_ menu. Take a look at the code under _index.js_ in the lambda. Copy and paste the following snippet under async handle(handlerInput). You are now writing code to get the inputs _maxcalories_ and _diet_ type from the user and then calling the getData(diet,maxcalories) function to call the Generate Meal Plan Spoonacular API. 

```
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
  }
```

```

async function getData(diet,maxcalories) {
  var options = {
    uri: `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&diet=${diet}&maxcalories=${maxcalories}&apiKey=PUTYOURAPIKEYHERE`,
    json: true,
  };

  var response = await rp(options);
  return response;
}

```

Get the API key specific to your user account under Profile section of the Spoonacular dashboard. Replace 'PUTYOURKEYHERE' in the getData function with your API key.
_Save_ and _Deploy_ the changes made in _index.js_. Save and Build the model under _Build_ menu. It should build successfully. 
Let's understand what we have done so far.

9) Get to the _Test_ menu and test the skill.  Play with the skill such that you invoke options you entered under _Alexa speech prompts_ and _User utterances_ for the _maxcalories_ slot.

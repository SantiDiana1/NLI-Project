# NLI-Project

## Introduction
This project has been carried in the context of the "Sound and Music Computing" master's degree at UPF (Universitat Pompeu Fabra) in Barcelona. The group was composed by Quoc Duong, Iván Fernández and Santiago Diana. 

It is a RASA implementation of a chatbot, presented in a JavaScript interface that allows the user to interact with it. The chatbot delivers information related to the Communications department at the university, but it could be retrained with other features depending on the application.

## Usage - CLI

### Train the model

```
rasa train
```

### Run the chatbot application

Run these commands in a separate terminal from the rasa folder

```
rasa run actions
rasa run --cors "*"
```

The following runs the app in development mode. Open http://localhost:3000 to view it in the browser

```
npm start
```

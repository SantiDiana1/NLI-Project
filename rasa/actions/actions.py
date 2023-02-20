# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

import csv
import os

from typing import Any, Text, Dict, List
from rasa_sdk.events import AllSlotsReset
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from fuzzywuzzy import fuzz


class ActionListDticDegrees(Action):
    def name(self) -> Text:
        return "action_list_dtic_degrees"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        with open('./data/dtic_degrees.csv') as file:
            reader = csv.DictReader(file)
            output = [row for row in reader]

        if output:  # there is at least one value
            # build your reply according to the output
            reply = f"Here is the list of degrees at Universitat Pompeu Fabra:"
            reply += "\n- " + \
                "\n- ".join([item['type'] + " in " + item['name']
                            for item in output])
            # utter the message
            dispatcher.utter_message(reply)

        else:  # the list is empty
            dispatcher.utter_message(
                f"I could not find any degrees at Universitat Pompeu Fabra :/")


class ActionGiveDegreeDesc(Action):
    def name(self) -> Text:
        return "action_give_degree_desc"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        degree_name = next(
            tracker.get_latest_entity_values("degree_name"), None)
        print(degree_name)

        with open('./data/dtic_degrees.csv') as file:
            reader = csv.DictReader(file)
            degree_info = None
            name = None
            highest_score = 0

            print(degree_name) #debug
            score = fuzz.token_set_ratio(degree_name, name)
            for row in reader:
                name = row['name'].lower()
                score = fuzz.token_set_ratio(degree_name, name)
                
                if score > highest_score:
                    highest_score = score
                    degree_info = row
 
        if degree_info:
            # build your reply according to the output
            reply = f"Here is the description for the " + \
                degree_info['type'] + " in " + degree_info['name'] + ":"

            reply += "\n" + degree_info['description']

            # if number of places offered are known
            if degree_info['places'] != -1:
                reply += "\n" + \
                    f"There are {degree_info['places']} places offered for this programme."
            # utter the message
            dispatcher.utter_message(reply)

        else:  # the list is empty
            dispatcher.utter_message(
                f"I could not find what you requested :/")


class ActionGivePersonLocation(Action):
    def name(self) -> Text:
        return "action_give_person_location"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get the person_name from the tracker

        person_name=next(tracker.get_latest_entity_values('person_name'), None)
        if person_name is None:
            dispatcher.utter_message("I'm sorry, I didn't find anyone named like that.")
            return []
        person_name = person_name.lower()
        # Load the CSV file
        file_path = './data/people.csv'
        with open(file_path, 'r') as f:
            reader = csv.reader(f)
            rows = [row for row in reader]

            # Find the closest match to the person_name in the CSV file
            closest_match = None
            highest_score = 0
            room=None
            building=None
            for row in rows:
                name = row[4].lower()
                score = fuzz.token_set_ratio(person_name, name)
                
                if score > highest_score:
                    highest_score = score
                    closest_match = name
                    room= row[2]
                    building=row[3]

        # Return the closest match as a response
        response = f"{closest_match.title()} is located in {room} at {building}."
        dispatcher.utter_message(text=response)

        return []


class ActionListDptPeople(Action):
    def name(self) -> Text:
        return "action_list_dpt_people"

    def run(self, dispatcher, tracker, domain):
         
        department=next(tracker.get_latest_entity_values('department'), None)
        if department is None:
            dispatcher.utter_message("I'm sorry, I didn't understand that.")
            return []
        department = department.lower()
        closest_match = None
        highest_score = 0
        with open('./data/people.csv') as file:
            reader = csv.DictReader(file)
            #first row skipped
            next(reader)
            dpt_people = []
            for row in reader:
                #Get closest fit
                            
                department_name=row['DEPARTMENT_FULL'].lower()
                department_abrv=row['DEPARTMENT'].lower()
                score = fuzz.token_set_ratio(department, department_name)
                score_abrv = fuzz.token_set_ratio(department, department_abrv)

                if score > highest_score:
                    highest_score = score
                    closest_match = department_name
                if score_abrv > highest_score:
                    highest_score = score_abrv
                    closest_match = department_abrv

            for row in reader:
                if row['department'] == closest_match:
                    dpt_people.append(row['name'])
            
            if dpt_people:  # there is at least one value
                # build your reply according to the output
                reply = f"Here is the list of people in the {closest_match} department:"
                reply += "\n- " + \
                    "\n- ".join([item for item in dpt_people])
                # utter the message
                dispatcher.utter_message(reply)
                
            else:  # the list is empty
                message="The department does not exist or we could't find anyone :/"
                dispatcher.utter_message(message)



class ActionClearSlots(Action):
    def name(self) -> Text:
        return "action_clear_slots"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        return [AllSlotsReset()]



 

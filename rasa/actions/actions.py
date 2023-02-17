# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

import csv
import os

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


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

        degree_name = tracker.get_slot('degree_name')

        with open('./data/dtic_degrees.csv') as file:
            reader = csv.DictReader(file)
            degree_info = None

            for row in reader:
                if row['name'] == degree_name:
                    degree_info = row

        if degree_info:
            # build your reply according to the output
            reply = f"Here is the description for the " + \
                degree_info['type'] + " in " + degree_info['name'] + ":"

            reply += "\n" + degree_info['description']
            # utter the message
            dispatcher.utter_message(reply)

        else:  # the list is empty
            dispatcher.utter_message(
                f"I could not find what you requested :/")

# TODO: handle synonyms


class ActionGivePersonRoom(Action):
    def name(self) -> Text:
        return "action_give_person_room"

    def run(self, dispatcher, tracker, domain):
        person_name = tracker.get_slot("person_name")
        person_surname = tracker.get_slot("person_surname")
        room = None
        with open('./data/people.csv') as file:
            reader = csv.DictReader(file)

            for row in reader:
                if row['NAME'].lower().strip() == person_name and row['SURNAME'].lower().strip() == person_surname:
                    room = row['ROOM']
                    response = f"The room of {person_name,person_surname} is {room}"
                    dispatcher.utter_message(response)
                    return []

                if room == None:
                    dispatcher.utter_message(
                        f"I'm sorry, I couldn't find a room for {person_name}.")


class ActionListDptPeople(Action):
    def name(self) -> Text:
        return "action_list_dpt_people"

    def run(self, dispatcher, tracker, domain):
        department = next(tracker.get_latest_entity_values("department"), None)
        with open('./data/people.csv') as file:
            reader = csv.DictReader(file)

            dpt_people = []
            for row in reader:
                if row['DEPARTMENT'].lower().strip() == department.lower().strip():
                    dpt_people.append(row['NAME'].lower().strip().title(
                    ) + ' ' + row['SURNAME'].lower().strip().title())

            if dpt_people:  # there is at least one value
                # build your reply according to the output
                reply = f"Here is the list of people in the " + \
                    department.title() + \
                    " department:"
                reply += "\n- " + \
                    "\n- ".join([person for person in dpt_people])
                # utter the message
                dispatcher.utter_message(reply)

            else:  # the list is empty
                dispatcher.utter_message(
                    f"The department does not exist or we could't find anyone :/")

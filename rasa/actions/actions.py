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


class ActionDticDegrees(Action):
    def name(self) -> Text:
        return "action_dtic_degrees"

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

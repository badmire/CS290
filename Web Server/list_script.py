"""
Takes in a list of magic cards from web form and returns shopping list file.

"""

# Import statements
import json
import requests
import time
import sys


def buildCache():
    """Build cached json to speed process"""
    with open("./json_cache/manual_cache.json", "w+") as target:
        output = []
        request = requests.get("https://api.scryfall.com/cards")
        # x_counter = 0
        # y_counter = 0
        while True:
            # for i in range(10):
            # print(f"Next page is: {request.json()['next_page']}")
            for card in request.json()["data"]:
                if card["lang"] != "en":
                    continue
                else:
                    if card["prices"]["usd"] is None:
                        # x_counter += 1
                        # card["prices"]["usd"] = 0.00
                        continue
                    else:
                        card["prices"]["usd"] = float(card["prices"]["usd"])
                # y_counter += 1
                output.append(card)

            if request.json()["has_more"]:
                time.sleep(0.1)
                request = requests.get(request.json()["next_page"])
            else:
                break

        # print(f"The number of cards with None price: {x_counter}")
        # print(f"The number of cards processed: {y_counter}")
        target.write(json.dumps(output))


def getBulk(url):
    """
    Get bulk file from scryfall.

    url: https://archive.scryfall.com/json/scryfall-default-cards.json
    """
    download = requests.get(url, allow_redirects=True)
    with open("./json_cache/bulk_cache.json", "w") as target:
        target.write(json.dumps(download.json()))


def loadJson(target):
    """
    Load target json, return python json object.
    """
    with open(target, "r") as thing:
        output = json.load(thing)
    return output


def getDuplicates(card_name, bulk_json):
    """Search bulk for cards by name, return all printings."""
    output = []
    for card in bulk_json:

        if "card_faces" in card:
            for face in card["card_faces"]:
                if face["name"] == card_name:
                    output.append(card["id"])
                    break
        else:
            if card["name"] == card_name and card["lang"] == "en":
                output.append(card["id"])
    return output


def getPrices(id_list):
    """Get high and low prices from all printings, high/low"""
    high = -1
    low = 100000000
    for UUID in id_list:
        current = requests.get(f"https://api.scryfall.com/cards/{UUID}")
        if "Basic Land" in current.json()["type_line"]:
            high = 0.0
            low = 0.0
            return high, low
        time.sleep(0.12)
        current_price = current.json()["prices"]["usd"]

        if current_price == None:
            continue
        current_price = float(current_price)
        if current_price > high:
            high = current_price
        if current_price < low:
            low = current_price

    return high, low


def getLocalPrices(id_list):
    """Get high and low prices from all printings, high/low"""
    high = -1
    low = 100000000
    local = loadJson("./json_cache/manual_cache.json")

    counter = 0

    for card in local:
        if card["id"] in id_list:
            if "Basic Land" in card["type_line"]:
                high = 0.0
                low = 0.0
                return high, low

            current_price = card["prices"]["usd"]
            counter += 1
            if current_price == None:
                continue
            current_price = float(current_price)
            if current_price > high:
                high = current_price
            if current_price < low:
                low = current_price

        if counter == len(id_list):
            break

    return high, low


class Card:
    """Card class for organizing prices and ids"""

    def __init__(self, num, name):
        self.name = name
        self.UUID = getDuplicates(name, loadJson("./json_cache/manual_cache.json"))
        self.high_price, self.low_price = getLocalPrices(self.UUID)
        self.quantity = num


def shoppingList(card_list):
    """Take list of card from website input, return txt shopping list"""
    # print(card_list)

    output_list = []
    for line in card_list:
        # Format should be in "1 Arbor Elf"
        split_list = line.split(" ", 1)
        print(f"{split_list[1]} is being processed.")
        # print(split_list)
        num = split_list[0]
        name = split_list[1]
        output_list.append(Card(num, name))

    with open("./shopping_list.txt", "w") as output:
        output.write("Shopping List!\n")
        output.write("-" * 80 + "\n")
        running_high = 0
        running_low = 0
        for card in output_list:
            output.write(
                f"{card.quantity} {card.name} High: {card.high_price} Low: {card.low_price}\n"
            )
            running_high += card.high_price * float(card.quantity)
            running_low += card.low_price * float(card.quantity)
        output.write("\n")
        output.write(
            f"The total high end is: {running_high} and total low end is: {running_low}"
        )
    return 0


if __name__ == "__main__":
    print("It made it into the python.")
    shoppingList(sys.argv[1].replace("\r", "").split("\n"))

    # for i in range(len(sys.argv)):
    #     print(f"Argument {i} is :")
    #     print()
    #     print(sys.argv[i])
    #     print()


from bs4 import BeautifulSoup
import requests

search = input("Hello, what are you shopping for today? ")

url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search

response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

for product in soup.findAll("div", attrs={"class": "pslires"}):
    count = 0
    for element in product:
        if count == 1:
            print("Price: " + element.find("div").text)
        elif count == 2:
            print("Product: " + element.find("div").text)
        count += 1

    print("\n")

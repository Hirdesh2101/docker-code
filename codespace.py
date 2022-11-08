import json
import requests
from bs4 import BeautifulSoup


def convert24(str1):

    if str1[-2:] == "AM" and str1[:2] == "12":
        return "00" + str1[2:-3]
          
    elif str1[-2:] == "AM":
        return str1[:-3]
      
    elif str1[-2:] == "PM" and str1[:2] == "12":
        return str1[:-3]
          
    else:
        return str(int(str1[:2]) + 12) + str1[2:8]
  
source = requests.get("https://dpboss.net/").text

soup = BeautifulSoup(source, 'lxml')

li = soup.find('div', {'class': 'satta-result'})
li2 = soup.find('div', {'class': 'matka-card live-box'})
children = li.findChildren('h4')
children2 = li.findChildren('h5')
children3 = li.findChildren('h6')
children4 = li2.findChildren('h6')
children5 = li2.findChildren('h5')
temp_list = []
temp_list2 = []
temp_list3 = []
temp_list4 = []
temp_list5 = []
temp_list6 = []
for child in children:
	temp_list.append(child.text)
for child in children2:
	temp_list2.append(child.text)
for child in children4:
	temp_list5.append(child.text)
for child in children5:
	temp_list6.append(child.text)
for child in children3:
	x = child.text.split(" ")
	x1 = [x[0]+":00 "+x[1]]
	x2 = [x[3]+":00 "+x[4]]
	finalx1 = convert24(x1[0])
	finalx2 = convert24(x2[0])
	temp_list3.append(finalx1[:-3])
	temp_list4.append(finalx2[:-3])
data = {
	"name": temp_list,
	"results": temp_list2,
	"opentiming":temp_list3,
	"closetiming":temp_list4,
	"livenames":temp_list5
}
jsson = json.dumps(data)
print(jsson)
# -*- coding: utf-8 -*-
"""
Created on Fri Aug 30 08:25:44 2019

@author: user
"""

from bs4 import BeautifulSoup
import csv
import os

d = 'D:/D/Patrick/Purdue/Senior/CGT 470/data'
for file in [f for f in os.listdir(d) if os.path.isfile(d+'/'+f)]:
    
    a = open(d+'/'+file, encoding='utf-8')
    soup = BeautifulSoup(a, 'html.parser')
    title = soup.find("span", {"id": "product-name"}).getText()
    subtitle = soup.find("span", {"id": "product-dataset"}).getText()
    geo = soup.find("th", {"id": "c1"}).getText()
    x = soup.select("#data > thead > tr")[1]
    gender = [th.getText() for th in soup.select("#data > thead > tr")[1]]
    est_moe = [th.getText() for th in soup.select("#data > thead > tr")[2]]
    data = [['Subject', 'Total Estimate', 'Total MoE', 'Percent Estimate', 'Percent MoE', 'Male Estimate', 'Male MoE', 'Percent Male Estimate', 'Percent Male MoE', 'Female Estimate', 'Female MoE', 'Percent Female Estimate', 'Percent Female MoE']]
    for tr in soup.find(id="data").find("tbody").find_all("tr"):
        if tr.find("th").getText().isspace(): continue
        row = [tr.find("th").getText()]
        for td in tr.find_all("td"):
            row.append(td.getText())
        data.append(row)
    
    #data = [','.join(i) for i in raw_data]
    #for i in data: i += ',\n'
    
    filename = file.split('_')
    
    # educational attainment
    with open(d+'/parsed/'+filename[0]+'_'+filename[1][0:4]+'_edu.csv', encoding='utf8', mode='w', newline='') as file:
        writedata = csv.writer(file)
        for i in range(28): writedata.writerow(data[i])
        
    # race
    with open(d+'/parsed/'+filename[0]+'_'+filename[1][0:4]+'_race.csv', encoding='utf8', mode='w', newline='') as file:
        writedata = csv.writer(file)
        writedata.writerow([data[28][0]] + data[0][1:])
        for i in range(29, 56): writedata.writerow(data[i])
        
    # poverty
    with open(d+'/parsed/'+filename[0]+'_'+filename[1][0:4]+'_poverty.csv', encoding='utf8', mode='w', newline='') as file:
        writedata = csv.writer(file)
        writedata.writerow([data[56][0]] + data[0][1:])
        for i in range(57, 61): writedata.writerow(data[i])
    
    # median earning
    with open(d+'/parsed/'+filename[0]+'_'+filename[1][0:4]+'_earning.csv', encoding='utf8', mode='w', newline='') as file:
        writedata = csv.writer(file)
        writedata.writerow([data[61][0]] + data[0][1:])
        for i in range(62, 68): writedata.writerow(data[i])

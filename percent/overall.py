# -*- coding: utf-8 -*-
"""
Created on Wed Sep 18 17:18:34 2019

@author: user
"""

import os
import csv
import pandas as pd

p_2017 = [['County', 'Percent']]
p_2016 = [['County', 'Percent']]
p_2015 = [['County', 'Percent']]

for folder in os.listdir('D:/C/MAMP/htdocs/data'):
    path = 'D:/C/MAMP/htdocs/data/' + folder + '/'
    for f in sorted([i for i in sorted(os.listdir(path)) if '_edu.csv' in i]):
        filename = f.split('_')
        if filename[0] == "US" or filename[0] == "IN": continue
        with open(path+f, mode='r', encoding='utf-8') as file:
            df = pd.read_csv(file)
            percent = df["Percent Estimate"][14][:-1]
        if '2015' in filename[1]: p_2015.append([filename[0], percent])
        elif '2016' in filename[1]: p_2016.append([filename[0], percent])
        elif '2017' in filename[1]: p_2017.append([filename[0], percent])

with open('D:/C/MAMP/htdocs/percent/p_2015.csv', mode='w', encoding='utf-8', newline='') as writefile:
    writedata = csv.writer(writefile)
    for i in p_2015: writedata.writerow(i)
    
with open('D:/C/MAMP/htdocs/percent/p_2016.csv', mode='w', encoding='utf-8', newline='') as writefile:
    writedata = csv.writer(writefile)
    for i in p_2016: writedata.writerow(i)

with open('D:/C/MAMP/htdocs/percent/p_2017.csv', mode='w', encoding='utf-8', newline='') as writefile:
    writedata = csv.writer(writefile)
    for i in p_2017: writedata.writerow(i)
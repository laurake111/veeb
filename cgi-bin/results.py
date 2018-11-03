#!/usr/bin/python3
# -*- coding: utf-8 -*- 
import cgi
import cgitb
from datetime import datetime
cgitb.enable()

print ("Content-type: text/html")
print()

# print ("<html><head><title>test2.py</title></head><body><h1>Battleship results</h1><p>name1 oli ")
title = "<html><head><title>server.py</title></head><body><h1>Battleship results</h1>"
table = "<table border = '1'><tr><th>Player</th><th>Opponent</th><th>Game started</th><th>Your shots</th><th>opponent shots</th><th>Game time</th><tr>"

print(title + table)

formdata = cgi.FieldStorage()



if "name1" in formdata:
  # print (formdata['name1'].value + "</td>")
  # print("<td>" + formdata["name2"].value + "</td>")
  # print("<td>" + formdata["timeStart"].value + "</td>")
  # print("<td>" + formdata["playerShots"].value + "</td>")
  # print("<td>" + formdata["opponentShots"].value + "</td>")
  # print("<td>" + formdata["time"].value)
  print("ok")

  with open("table.txt", "a") as f:
      f.write(formdata["name1"].value + ",")
      f.write(formdata["name2"].value + ",")
      f.write(formdata["timeStart"].value + ",")
      f.write(formdata["playerShots"].value + ",")
      f.write(formdata["opponentShots"].value + ",")
      f.write(formdata["time"].value)

      f.write( '\n');
else:
  with open("table.txt") as f:
    for line in f.readlines():
      values = (line.split(","))
      for i, value in enumerate(values):
        if not value.strip():
          continue
        if i == 2:
          value = datetime.utcfromtimestamp(int(value) / 1000).strftime('%Y-%m-%d %H:%M:%S')
        print("<td>" + value + "</td>")
        
      print("</tr>")

print (".</tr></td></body></html>")
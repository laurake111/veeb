#!/usr/bin/python3
# -*- coding: utf-8 -*- 
import cgi
import cgitb
from datetime import datetime
cgitb.enable()

print ("Content-type: text/html")
print()

html = """<html>
<head>
  <title>game results</title>
</head>
<body>
  <h1>Battleship results</h1>
  <form>
    <input type=text name=q>
    <input type=submit value='Search'>
  </form>
  <table border=1>
    <tr>
      <th><a href=?sort=0> Player</a></th>
      <th><a href=?sort=1>Opponent</a></th>
      <th><a href=?sort=2>Game started</a></th>
      <th><a href=?sort=3>Your shots</a></th>
      <th><a href=?sort=4>opponent shots</a></th>
      <th><a href=?sort=5>Game time</a></th>
    </tr>"""

print(html)

formdata = cgi.FieldStorage()


if "name1" in formdata:
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
    listValues = []

    def getKey(item):
      if "sort" in formdata:
        return item[int(formdata["sort"].value)]
      else:
        return item

    for line in f.readlines():
      values = (line.split(","))
      if "q" in formdata:
        if formdata["q"].value in line:
          listValues.append(values)
        else:
          continue
      else:
        listValues.append(values)


    for values in sorted(listValues, key = getKey):
      for i, value in enumerate(values):
        if not value.strip():
          continue
        if i == 2:
          value = datetime.utcfromtimestamp(int(value) / 1000).strftime('%Y-%m-%d %H:%M:%S')
        print("<td>" + value + "</td>")
        
      print("</tr>")

print ("</tr></td></body></html>")
import csv
import json

with open('Aztec Game Data Dev - Role Info.csv') as csv_file:
    csv_text = csv_file.readlines()
    csv_reader = csv.DictReader(csv_text, delimiter=',')
    next(csv_reader)
    line_count = 0
    # print(csv_reader)
    # json.dumps(csv_reader)
    for row in csv_reader:
        print(json.dumps(row))
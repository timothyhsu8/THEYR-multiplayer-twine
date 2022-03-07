import sys
import re

replacements = [{'regex': '\$role', 'replace': '$users[$userId]["role"]'},
                {'regex': '\$faction', 'replace': '$users[$userId]["faction"]'},
                {'regex': '<<run[ ]*counter\(([^,]*),"([^"]*)"\)', 'replace': r'<<set $\2 = $\2 + \1'},
                {'regex': '<<run[ ]*changeStats\(([^,]*),"([^"]*)"\)', 'replace': r'<<set $\2 = $\2 + \1'}
                ]
# changestats()

#  <<run changeStats("Tlacaelel",{"Wisdom":0,"Loyalty":0,"Strength":-1})>>

with open(sys.argv[1], encoding="utf-8") as twee: twee_text = twee.read()
for replacement in replacements:
    twee = re.sub(replacement['regex'], replacement['replace'], twee_text)

# Replace header
with open(sys.argv[2], encoding="utf-8") as twee_header: twee_header_text = twee_header.read()
regex = re.compile('(:: Story JavaScript).*(:: PassageHeader.*?\n)',re.DOTALL)
replace = regex.sub(twee_header_text, twee_text)

# twee = re.sub(r':: Story JavaScript.*:: PassageHeader', "REPLACE", twee_text, re.DOTALL)

print(replace)
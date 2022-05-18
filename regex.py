# This program takes 2 command line arguments: The original file and the replacement header.
# It writes to regex_output.twee
# Example Usage) python3 .\regex.py .\Twine\aztec_original.twee .\aztec_header.twee

import sys
import re

replacements = [{'regex': '\$role', 'replace': '$users[$userId]["role"]'},
                {'regex': '\$faction', 'replace': '$users[$userId]["faction"]'},
                {'regex': '<<run[ ]*counter\(([^,]*),"([^"]*)"\)', 'replace': r'<<set $\2 = $\2 + \1'},
                {'regex': '<<run[ ]*changeStats\(([^,]*),"([^"]*)"\)', 'replace': r'<<set $\2 = $\2 + \1'},
                {'regex': '(\$\w+)_sum', 'replace': r'\1'},
                {'regex': 'images\/', 'replace': 'Twine/images/'}
                ]
# Opens file
twee_in_file = open(sys.argv[1], encoding="utf-8")
new_twee = twee_in_file.read()

# Removes any <<theyr>> or <</theyr>> tags
tags_to_remove = ['<<theyr>>', '<</theyr>>']
for tag in tags_to_remove:
    new_twee = new_twee.replace(tag, "")


# Iterates through replacement array and makes replacements
for replacement in replacements:
    new_twee = re.sub(replacement['regex'], replacement['replace'], new_twee)


# Replaces the header
header_in_file = open(sys.argv[2], encoding="utf-8")
twee_header = header_in_file.read()

regex = re.compile('(:: Story Stylesheet).*(:: Act 1 Scene 1.*?\n)', re.DOTALL)
new_twee = regex.sub(twee_header, new_twee)


## LIVEBLOCK TAGS ##
whitelist = ["Character Identification"]

# Whitelist all passages with textboxes in them
expression = r'(:: ([^\n]+) {"position".*?}.*?)(?:(?=::)|(?=\Z))'
m = re.findall(expression, new_twee, re.DOTALL)
for match in m:
    if "<<textbox " in match[0]:
        passage = match[1]
        passage = passage.replace('[Done Breaks]', '')
        passage = passage.replace('[Done]', '')
        whitelist.append(passage)

# Add liveblock to all passages
expression = r'(:: .*?{"position".*?})'
output = re.sub(expression, r'<</theyr>>\n\n\1\n<<theyr>>', new_twee, flags=re.DOTALL)

# Find whitelisted passages and remove their liveblocks
for item in whitelist:
    expression = r'(:: ' + item + r'.*?{"position".*?)\n<<theyr>>(.*?)<</theyr>>\n\n'
    output = re.sub(expression, r'\1\2', output, flags=re.DOTALL)
new_twee = output


# Remove first <</theyr>> and append <</theyr>> to the end (fixes edge cases)
new_twee = new_twee.replace("<</theyr>>", "", 1)
new_twee += "<</theyr>>"


# Write to output file 
out_file = open("regex_output.twee", "w", encoding="utf-8")
out_file.write(new_twee)
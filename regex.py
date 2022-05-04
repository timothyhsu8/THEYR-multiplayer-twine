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

# Iterates through replacement array and makes replacements
twee_in_file = open(sys.argv[1], encoding="utf-8")
new_twee = twee_in_file.read()

for replacement in replacements:
    new_twee = re.sub(replacement['regex'], replacement['replace'], new_twee)


# Replaces the header
# header_in_file = open(sys.argv[2],  encoding="utf-8")
# twee_header = header_in_file.read()

# regex = re.compile('(:: Story JavaScript).*(:: PassageHeader.*?\n)',re.DOTALL)
# new_twee = regex.sub(twee_header, new_twee)


# Write to output file 
out_file = open("regex_output.twee", "w", encoding="utf-8")
out_file.write(new_twee)
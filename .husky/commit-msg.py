#!/usr/bin/env python

import sys, os, re
from subprocess import check_output

MAX_BODY_LINE_LENGTH = 72

# Collect the parameters
commit_msg_filepath = sys.argv[1]


# Figure out which branch we're on
branch = check_output(['git', 'symbolic-ref', '--short', 'HEAD']).strip()
print("commit-msg: On branch '%s'" % branch)

# Defines rule for Subject line based on
# https://cbea.ms/git-commit/
sub_pattern = r'^[A-Z][^\.\n]{2,49}'
required_message = r'{0}$|{0}'.format(sub_pattern) + r'\n{2}.+'

with open(commit_msg_filepath, 'r') as f:
    content = f.read()
    if not re.match(required_message, content):
        print('commit-msg: ERROR! The commit must have a header and it must be between 3 and 50 characters long')
        print('The informed commit message does not fit this criteria')
        sys.exit(1)
# TODO Wrap body longer than 72 automatically
with open(commit_msg_filepath, 'r') as f:
  for line in f:
    if not line.startswith('#') and len(line) >= MAX_BODY_LINE_LENGTH:
      print(f'Line {line} is longer than {MAX_BODY_LINE_LENGTH}')
      sys.exit(1)

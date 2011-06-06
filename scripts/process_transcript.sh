#!/bin/bash

# TO RUN: Pipe a transcript into this script, such as:
#    cat ../transcripts/551432-june-5-2011.html | ./process_transcript.sh > ../processed_transcripts/551423-june-5-2011.html

php strip_tags.php | sed 's/.*:$/<br>&/' | sed 's/.* [PA]M//g'


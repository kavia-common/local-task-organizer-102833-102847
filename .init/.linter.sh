#!/bin/bash
cd /home/kavia/workspace/code-generation/local-task-organizer-102833-102847/todo_react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


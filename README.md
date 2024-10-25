Welcome to the test Asset Management app. 

To run the application the following needs to be done: 
    Backend:
      - in terminal go to the backend folder
      - install venv or Pipenv: python3 -m venv venv
      - go to venv: source venv/bin/activate
      - install requirements: pip3 install -r requirements.txt
      - create env inside the backend and insert all necessary keys that config.py refers to. That is database credentials to establish connection.
      - run in the terminal alembic commands to sync database with the repo
        - alembic upgrade head
        - alembic revision --autogenerate -m "Make migration"
        - alembic upgrade head
      - run backend: fastapi dev main.py

    Frontend:
      - go to frontend folder
      - run: npm install to install all the project packages
      - run: npm run start

    Database: 
      - install pgadmin
      - create a database with the name of your choice
      - insert database credentials to the env
  After performing all those steps, you should be able to have the application running. You should be able to access the app via localhost:3000

  This project has: 
    - set up of the web framework 
    - congiguered database
    - all asset management endpoints and crud ops 
    - user endpoints and crud ops 
    - jwt authorization
    - ui interface with React and Tailwid
    - search by asset category
    - input valiadtion with Pydantic
    - documentation (some xD)
    - written deployment file docker-compose (it launches, but did not configuered the backend frontend api calls) 
  Project lacks/imporovements:
    - fully working deployment file in docker
    - auth checks for each api calls 
    - caching
    - state machine in the frontend
    - better documentation
    - unit testing 
  

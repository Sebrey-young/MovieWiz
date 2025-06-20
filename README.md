# MovieWiz <img width="40" alt="MovieWiz" src="https://github.com/user-attachments/assets/95733888-2ff6-4f88-be5c-0b5f754974e5">

<img width="1200" alt="MoviWiz Screenshot" src="https://github.com/user-attachments/assets/84620e1b-9ddb-4065-82ab-0eb66ec8db08">

MovieWiz is a comprehensive project designed to predict movie ratings, discover trending films, and provide intelligent movie recommendations using the TMDB API. The project combines modern web technologies with machine learning to deliver accurate IMDb rating predictions based on movie metadata including genre, runtime, and release year.

Go to the project website [ here! ](https://moviewiz-fcwpzr82i-sebrey-youngs-projects.vercel.app/)

Note: If the predictor does not work at the time of usage its probably because cron was not ran properly in Actions(since its kind of buggy).....

## Components
- **Frontend**: Seamless and fast integration of all Components using a Next.js UI.
- **Backend**: Dynamic manipulation of the collected data from the TMDB API and presented via a Spring Boot Application.
- **Machine Learning**: Created a Random Forest Regessor Model using sci-kit learn and trained it on the top 20 most popular movies since the early 1990s and their metadata for the Predict Score function.
- **Database**: Managed PostgreSQL instance storing movie metadata and genre information, configured via environment variables.
- **API's**: Uses the TMDB API to populate the Database used to train the ML model and also used for the Next.js frontend component.

## Hosting Services
- **Vercel**: Hosts the Frontend.
- **Render**: Hosts the Backend as well as a Postgres instance for the database.

## Extra Info
Since I am using the Render free tier the services go to sleep after 15 minutes of inactivity, so I set up a Git workflow that uses CRON to keep them active every 10 minute. If the Predictor is not working properly it is most likely due to these services fallin asleep, to wake them up manually visit these links and wait for the projects to load:

[ -ML Service ](https://mwscraper.onrender.com)

[ -Backend ](https://mwbackend-ydam.onrender.com)

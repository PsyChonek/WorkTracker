# Work Tracker

Simple web app to track this month's work hours. To be used by freelancers or people who work on a project basis.

## Goals

- Track work hours for the current month.
- Log multiple months.
- Export data to CSV.
- Import data from CSV.
- Calculate total hours worked.
- Connect to other services like Google Calendar, Toggl, etc.

## Technologies Used

- bun
- nextjs
- docker
- node

## Installation

Automated CI/CD pipeline is in place. The app is deployed to self-hosted server.

## Development

```bash
# Clone the repository
git clone

# Install dependencies
bun install

# Run the app
bun dev
```

or use Docker

```bash
# Build the image
docker build -t worktracker .

# Run the container
docker run -p 3000:3000 worktracker

# or 
docker-compose up
```
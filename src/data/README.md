# Projects Data Management

This folder contains JSON files that manage the projects displayed in your portfolio website.

## File Structure

- `projects.json` - Basic project data with minimal properties
- `projectsWithCategories.json` - Enhanced project data with categories and dates for advanced filtering

## How to Add a New Project

1. Open the relevant JSON file
2. Add a new project object with the required properties:

```json
{
  "id": 9,  // Make sure to use a unique ID
  "title": "Your New Project",
  "description": "A detailed description of your project.",
  "technologies": ["React", "Firebase", "CSS"],  // List all technologies used
  "image": "https://via.placeholder.com/600x400",  // URL to your project image
  "githubLink": "https://github.com/username/your-project",
  "liveLink": "https://your-project.netlify.app",
  "featured": true,  // Set to true to highlight this project
  "category": "frontend",  // Choose from: fullstack, frontend, backend, mobile, etc.
  "date": "2024-04-15"  // Add the completion date for sorting
}
```

## Project Properties

| Property | Description | Required |
|----------|-------------|----------|
| id | Unique identifier for the project | Yes |
| title | Project name | Yes |
| description | Brief description of the project | Yes |
| technologies | Array of technologies used | Yes |
| image | URL to project screenshot or image | Yes |
| githubLink | Link to GitHub repository | Yes |
| liveLink | Link to live demo | Yes |
| featured | Boolean to indicate featured status | Yes |
| category | Project category (frontend, backend, fullstack, etc.) | For advanced filtering |
| date | Project completion date (YYYY-MM-DD) | For advanced sorting |

## Available Categories

You can use any categories you want, but here are some common ones:

- `frontend` - Client-side projects
- `backend` - Server-side and API projects
- `fullstack` - Complete applications with front and back end
- `mobile` - Mobile applications
- `design` - UI/UX and design projects
- `game` - Game development projects

## Using with Components

### Basic Projects Component
```jsx
import projectsData from '../data/projects.json';
```

### Advanced Projects Component with Categories and Sorting
```jsx
import projectsData from '../data/projectsWithCategories.json';
```

## Tips for Project Images

- Use consistent image aspect ratios (16:9 or 4:3 recommended)
- Optimize images for web to keep file sizes small
- Consider using a CDN like Cloudinary for image hosting
- Use high-quality screenshots that showcase your project 
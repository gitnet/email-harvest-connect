# Welcome to your Lovable project

## Project info

**Tools Name**: Emails Scraper Tool using serApi service from Google

## How To install the project?

Go to github link and follow the instruction below.

 

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <https://github.com/gitnet/email-harvest-connect.git>

# Step 2: Navigate to the project directory.
cd <Emails Scraper Tool>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

 
 * Supabase connect instructions *
        Open foler called integrations/supabase then go to file client.ts and put your supabase information inside the variables below 

        SUPABASE_URL = "<YOUR_SUPABASE_URL>";
        SUPABASE_PUBLISHABLE_KEY =  "<YOUR_SUPABASE_PUBLISHABLE_KEY>";

        then 
       Run these commands: 
        1- npm install -g supabase
        2- supabase login
        3- supabase link --project-ref your-project-ref
                ## your-project-ref => e.g, supabase.com/dashboard/project/gvlsqbccnancbzgeohwp## 
                gvlsqbccnancbzgeohwp  this is the project-ref so you will put yours 
        3- Finaly run the deploy command: 
            supabase functions deploy getresponse-api

    Note if you need any help you can contact me on whatsapp 
     +46727753891
    

    Support us on 
      https://buymeacoffee.com/devismail



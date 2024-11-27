# Step 1: Use an official Node.js runtime as the base image
FROM node:22.9.0-alpine  
#Consider using alpine version for a smaller image

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock for Yarn)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Copy Prisma schema files and generate the Prisma client
COPY prisma ./prisma/
# COPY dist ./dist
COPY .env ./.env
RUN npx prisma generate

# Step 5: Copy the application code
COPY . .

# Step 6: Expose the application port (assuming your app runs on 3000)
EXPOSE 3000

# Step 7: Run the application (replace 'start' with your entry command)
CMD ["npm", "run", "start"]

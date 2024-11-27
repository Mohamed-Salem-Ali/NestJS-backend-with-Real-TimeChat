# Stage 1: Base
FROM node:18-alpine AS base
WORKDIR /src/app
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm install

# Stage 3: Build 
FROM base AS build 
COPY --from=dependencies /src/app/node_modules ./node_modules 
COPY . . 
# ignore node modules
# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build 

# Stage 4: Release 
FROM base AS release 
COPY --from=build /src/app/dist ./dist 
COPY --from=build /src/app/prisma ./prisma 
COPY --from=build /src/app/node_modules ./node_modules
#COPY --from=build /src/app/.env ./.env 



# Expose the port
EXPOSE 8000

# Start the app
CMD ["npm", "run", "start:prod"]

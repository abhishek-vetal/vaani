# VAANI — AI Voice Cloning Platform

VAANI is a full-stack AI voice platform that allows users to create custom voices and generate speech from text using AI-powered text-to-speech technology.

The platform provides built-in voices as well as custom voice creation, configurable speech generation, audio storage, organization-based access, and subscription-based usage.

## Live Demo

[Visit VAANI](https://vaani-ai-voice.vercel.app/)

## Features

- Browse built-in voices
- Create custom voices from uploaded audio
- Generate speech from text
- Select different voices for speech generation
- Configure text-to-speech generation parameters
- Preview generated audio
- Download generated audio
- Search and browse voice libraries
- Store generated audio files securely
- Organization-based authentication and data isolation
- Subscription-based billing and usage tracking
- Responsive user interface

## AI Voice Generation

VAANI uses **Chatterbox TTS** for text-to-speech generation.

Users can configure several generation parameters, including:

- Voice
- Temperature
- Top-p
- Top-k
- Repetition penalty

These settings allow users to control different aspects of the generated speech.

## Custom Voice Creation

Users can create custom voices by providing their own voice recordings.

The application:

1. Accepts the uploaded voice recording.
2. Stores the audio file in Cloudflare R2.
3. Stores the associated voice metadata in PostgreSQL.
4. Makes the custom voice available for speech generation.
5. Restricts access based on the user's organization.

## Audio Storage

Generated audio files and custom voice recordings are stored using **Cloudflare R2**.

Voice and generation metadata is stored in **PostgreSQL** and managed through **Prisma**.

## Authentication & Data Isolation

VAANI uses **Clerk** for authentication and organization management.

Backend operations use **tRPC** to provide type-safe communication between the client and server.

Organization-based access ensures that users can only access the voice and generation data associated with their organization.

## Subscription & Usage

VAANI uses **Polar** for subscription billing and usage management.

The application tracks usage based on:

- Text-to-speech character usage
- Custom voice creation

The current usage pricing implemented in the application is:

- ₹0.002 per TTS character
- ₹2 per custom voice creation

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js
- tRPC
- Prisma
- PostgreSQL

### Authentication

- Clerk

### AI & Voice

- Chatterbox TTS

### Storage

- Cloudflare R2

### Billing

- Polar

### Deployment

- Vercel

## What I Practiced

This project helped me practice:

- Building a full-stack AI application
- Integrating text-to-speech models
- Building custom voice workflows
- Working with audio files
- Uploading and managing files with object storage
- Designing relational database schemas with Prisma and PostgreSQL
- Implementing organization-based authentication and data isolation
- Building type-safe APIs with tRPC
- Implementing subscription billing and usage tracking
- Building configurable AI generation workflows
- Creating responsive interfaces with Next.js and React
- Deploying and maintaining a production web application

## Getting Started

Install the project dependencies:

```bash
npm install

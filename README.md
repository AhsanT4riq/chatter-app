# 📱 Chatter App

A cross-platform chat application built with [Expo](https://expo.dev), using **Clerk** for authentication and **Supabase** for real-time messaging and database management.

Authentication is handled by [Clerk](https://clerk.com).

- Sign in with Passkeys (Clerk Passkeys)
- Sign in with Google (Clerk SSO)

User can create Passkeys in the profile screen.

## 🚀 Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Start the development server

```bash
bunx expo start
```

Then, choose to run on:

- 📱 iOS Simulator
- 🤖 Android Emulator
- 📦 [Expo Go](https://expo.dev/go) (limited support for native modules)
- 🔧 [Development build](https://docs.expo.dev/develop/development-builds/introduction/)

### 3. Authentication

This app uses [Clerk](https://clerk.com) for user authentication.

- Configure your Clerk frontend API and secret keys in `.env.local` files:
  ```
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
  ```

### 4. Supabase Setup

We use [Supabase](https://supabase.com) for:

- Realtime subscriptions (new messages)
- Database storage
- Optional user data persistence

Make sure to add your Supabase project keys:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🗂️ Project Structure

```
/app              -> Routes and screens (Expo Router)
/components       -> Shared UI components
/utils            -> colors, test data, cache and types
/hooks            -> Custom hooks (e.g. useSupabaseClient)
/types            -> TypeScript type definitions
```

## 📚 Resources

- [Expo Docs](https://docs.expo.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Router](https://expo.github.io/router/docs)

## 💬 Join the Community

- [Expo GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
- [Supabase Discord](https://discord.supabase.com)
- [Clerk Community](https://clerk.dev/community)

---

Built with ❤️ using Expo, Clerk, and Supabase.

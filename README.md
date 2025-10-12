# AI Chat Bot - Authentication & User Management System

A modern Next.js application with Supabase authentication, featuring Google OAuth and email/password authentication with a clean, responsive UI.

## 🚀 Features

- **Authentication System**
  - Google OAuth integration
  - Email/password sign-up and sign-in
  - Secure session management
  - User profile synchronization with database

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Custom UI components with Radix UI
  - Loading states and error handling
  - Clean, professional interface

- **State Management**
  - Zustand for global state management
  - Real-time authentication state updates
  - Persistent user sessions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## 📁 Project Structure

```
├── app/                                                    # Next.js App Router
│   ├── SignIn/                                             # Sign-in page components
│   │   └── SignIn.tsx                                      # Main sign-in page layout
│   ├── SignUp/                                             # Sign-up page components
│   │   └── page.tsx                                        # Sign-up page
├── assets/                                                 # Static assets
│   └── images/                                             # Image assets
│       └── index.ts                                        # Image exports
├── components/                                             # Reusable UI components
│   └── ui/                                                 # Base UI components
│       └── index.ts                                        # UI exports
├── lib/                                                    # Utility libraries
│   ├── supabase.ts                                         # Supabase client configuration
│   └── utils.ts                                            # Utility functions (cn helper)
├── Services/                                               # Business logic services
│   └── Auth.ts                                             # Authentication service with Zustand
├── Templates/                                              # Page templates
│   ├── SignIn.tsx                                          # Sign-in form template
│   └── SignUp.tsx                                          # Sign-up form template
```

## 🔧 Key Components

### Authentication Service (`Services/Auth.ts`)
- **Zustand Store**: Manages global authentication state
- **Supabase Integration**: Handles OAuth and email/password auth
- **User Synchronization**: Syncs user data with database
- **Session Management**: Real-time auth state changes

### UI Components (`components/ui/`)
- **Button**: Customizable button with multiple variants
- **Field**: Form field components with labels and validation
- **Input**: Styled input component
- **Loading**: Spinner component for loading states

### Templates (`Templates/`)
- **SignIn**: Complete sign-in form with Google OAuth
- **SignUp**: Registration form with validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aidatatry
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## 📝 Code Standards

### TypeScript Conventions

**Use `type` instead of `interface`**
```typescript
// good
interface Result {}

// better
type Result = {};
```

**Use appropriate types instead of `any`**
```typescript
// bad
type Result = {
  auth: any;
};

// good
type Result = {
  auth: unknown;
};

// better
type Result = {
  auth: {token: string};
};
```

### JavaScript Best Practices

**Strict comparison**
```typescript
// bad
const isSame = a == b;

// good
const isSame = a === b;
```

**De-structuring on scope level**
```typescript
// bad
export default function Button({type, name, onClick}: ButtonProps) {}

// good
export default function Button(props: ButtonProps) {
  const {type, name, onClick} = props;
}
```

**Use array functions instead of loops**
```typescript
// good
let sum = 0;
for (let i = 0; i < 10; i++) {
  sum += i;
}

// better
const sum = Array(10)
  .fill('')
  .reduce((acc, index) => {
    return acc + index;
  }, 0);
```

**Use async/await instead of promises**
```typescript
// good
const getPosts = () => {
  return fetch('/posts')
    .then(response => response.json())
    .catch();
};

// better
const getPosts = async () => {
  try {
    const request = await fetch('/posts');
    const data = await request.json();
    return data;
  } catch {
    // error logic
  }
};
```

**Use fully-qualified names**
```typescript
// good
const getIdx = () => {
  return 0;
};
const getMsg = () => {};

// better
const getIdNumber = () => {
  return 0;
};
const getMessage = () => {};
```

### React Best Practices

**Fix warnings, never bypass ESLint**
```typescript
// bad
const isLoggedIn = useMemo(() => {
  return false;
}, []);

useEffect(() => {
  if (!isLoggedIn) {
    // logic
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// good
const isLoggedIn = useMemo(() => {
  return false;
}, []);

useEffect(() => {
  if (!isLoggedIn) {
    // logic
  }
}, [isLoggedIn]);
```

**Use named imports**
```typescript
// bad
import * as lodash from 'lodash';
const name = lodash.capitalize('name');

// good
import {capitalize} from 'lodash';
const name = capitalize('name');
```

**Always assume null/undefined**
```typescript
// bad
const firstName = result.name.data.firstName;

// good
const firstName = result.data?.name?.firstName;

// better
import {get} from 'lodash';
const firstName = get(result, ['data', 'name', 'firstName'], '');
```

**Negate when short-circuiting**
```typescript
// bad
const variable = 0;
const result = variable && <View>Hello</View>;

// good
return variable ? <View>Hello</View> : null;

// preferred
return !!variable && <View>Hello</View>;
```

**Never add inline events**
```typescript
// bad
<Pressable
  onPress={() => {
    // logic
  }}>
  Action
</Pressable>;

// good
const onPress = () => {
  // logic
};

<Pressable onPress={onPress}>Action</Pressable>;
```

**Never add inline styles**
```typescript
// bad
<View style={{position: "absolute"}}>
  // contents
</View>

// good
<View style={styles.absoluteView}>
  // contents
</View>
```

**Pass props by importance**
```typescript
// bad
<FormInput
  onChangeText={() => {}}
  value={true}
  name={''}
  onFocus={() => {}}
  onBlur={() => {}}
  readOnly={true}
/>

// good
<FormInput
  value={true}
  name={''}
  readOnly={true}
  onChangeText={() => {}}
  onFocus={() => {}}
  onBlur={() => {}}
/>
```

**Follow CSS property ordering**
```typescript
// bad
const styles = {
  absoluteView: {
    top: 0,
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
  },
};

// good
const styles = {
  absoluteView: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
  },
};
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with custom configuration for:
- Component variants
- Dark mode support
- Custom color schemes

## 📦 Dependencies

### Core Dependencies
- `next`: Next.js framework
- `react`: React library
- `@supabase/supabase-js`: Supabase client
- `zustand`: State management
- `tailwindcss`: CSS framework

### UI Dependencies
- `@radix-ui/*`: Accessible UI primitives
- `lucide-react`: Icon library
- `class-variance-authority`: Component variants

## 🤝 Contributing
---

**Note**: This is a development project. Ensure all environment variables are properly configured before deployment.
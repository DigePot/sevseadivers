// import { z as zod } from 'zod';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from "react"

// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Alert from '@mui/material/Alert';
// import IconButton from '@mui/material/IconButton';
// import LoadingButton from '@mui/lab/LoadingButton';
// import InputAdornment from '@mui/material/InputAdornment';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

// import { Iconify } from 'src/components/iconify';
// import { Form, Field } from 'src/components/hook-form';

// import { useAuthContext } from '../../hooks';
// import { getErrorMessage } from '../../utils';
// import { FormHead } from '../../components/form-head';
// import { signInWithPassword } from '../../context/jwt';

// // ----------------------------------------------------------------------

// export type SignInSchemaType = zod.infer<typeof SignInSchema>;

// export const SignInSchema = zod.object({
//   email: zod
//     .string()
//     .min(1, { message: 'Email is required!' })
//     .email({ message: 'Email must be a valid email address!' }),
//   password: zod
//     .string()
//     .min(1, { message: 'Password is required!' })
//     .min(6, { message: 'Password must be at least 6 characters!' }),
// });

// // ----------------------------------------------------------------------

// export function JwtSignInView() {
//   const router = useRouter();

//   const showPassword = useBoolean();

//   const { checkUserSession } = useAuthContext();

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const defaultValues: SignInSchemaType = {
//     email: 'demo@minimals.cc',
//     password: '@demo1',
//   };

//   const methods = useForm<SignInSchemaType>({
//     resolver: zodResolver(SignInSchema),
//     defaultValues,
//   });

// const {
//   handleSubmit,
//   formState: { isSubmitting },
// } = methods;

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       await signInWithPassword({ email: data.email, password: data.password });
//       await checkUserSession?.();

//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       const feedbackMessage = getErrorMessage(error);
//       setErrorMessage(feedbackMessage);
//     }
//   });

//   const renderForm = () => (
//     <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
//       <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />

//       <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
//         <Link
//           component={RouterLink}
//           href="#"
//           variant="body2"
//           color="inherit"
//           sx={{ alignSelf: 'flex-end' }}
//         >
//           Forgot password?
//         </Link>

//         <Field.Text
//           name="password"
//           label="Password"
//           placeholder="6+ characters"
//           type={showPassword.value ? 'text' : 'password'}
//           slotProps={{
//             inputLabel: { shrink: true },
//             input: {
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={showPassword.onToggle} edge="end">
//                     <Iconify
//                       icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
//                     />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             },
//           }}
//         />
//       </Box>

//       <LoadingButton
//         fullWidth
//         color="inherit"
//         size="large"
//         type="submit"
//         variant="contained"
//         loading={isSubmitting}
//         loadingIndicator="Sign in..."
//       >
//         Sign in
//       </LoadingButton>
//     </Box>
//   );

//   return (
//     <>
//       <FormHead
//         title="Sign in to your account"
//         description={
//           <>
//             {`Don’t have an account? `}
//             <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
//               Get started
//             </Link>
//           </>
//         }
//         sx={{ textAlign: { xs: 'center', md: 'left' } }}
//       />

//       <Alert severity="info" sx={{ mb: 3 }}>
//         Use <strong>{defaultValues.email}</strong>
//         {' with password '}
//         <strong>{defaultValues.password}</strong>
//       </Alert>

//       {!!errorMessage && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {errorMessage}
//         </Alert>
//       )}

//       <Form methods={methods} onSubmit={onSubmit}>
//         {renderForm()}
//       </Form>
//     </>
//   );
// }

// export function JwtSignInView() {
//   const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn")

//   // Handle tab switching
//   const handleTabChange = (tab: "signIn" | "signUp") => {
//     setActiveTab(tab)
//   }
//   return (
//     <div className="flex items-center justify-center bg-[#19b2e5] px-16 py-5 rounded-2xl">
//       <div className="w-full bg-transparent">
//         {/* Tab Headers */}
//         <div>
//           <h1 className="text-[#121717] text-2xl font-bold">
//             Welcome to SEVSEA DIVERS
//           </h1>

//           <div className="flex space-x-4 mb-6 border-b-2 border-[#DBE3E5]">
//             <button
//               onClick={() => handleTabChange("signIn")}
//               className={`w-full py-2 text-center font-semibold ${
//                 activeTab === "signIn"
//                   ? "border-b-2 border-[#DBE3E5]  text-[#121717]"
//                   : "text-white"
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => handleTabChange("signUp")}
//               className={`w-full py-2 text-center font-semibold ${
//                 activeTab === "signUp"
//                   ? "border-b-2 border-[#DBE3E5] text-[#121717] "
//                   : "text-white"
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
//         </div>

//         {/* Form Content */}
//         {activeTab === "signIn" ? <SignInForm /> : <SignUpForm />}
//       </div>
//     </div>
//   )
// }

// const SignInForm: React.FC = () => {
//   return (
//     <form className="space-y-4">
//       <div>
//         <label
//           htmlFor="email"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter your email"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter your password"
//         />
//       </div>
//       <div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
//         >
//           Sign In
//         </button>
//       </div>
//     </form>
//   )
// }

// const SignUpForm: React.FC = () => {
//   return (
//     <form className="space-y-4">
//       <div>
//         <label
//           htmlFor="email"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter your email"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           placeholder="Create a password"
//         />
//       </div>
//       <div>
//         <label
//           htmlFor="confirmPassword"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Confirm Password
//         </label>
//         <input
//           type="password"
//           id="confirmPassword"
//           className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           placeholder="Confirm your password"
//         />
//       </div>
//       <div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
//         >
//           Sign Up
//         </button>
//       </div>
//     </form>
//   )
// }

// JwtSignInView.tsx
import React from "react"

// JwtSignInView.tsx
import AuthWrapper from "../../components/auth-wrapper"
import { SignInForm } from "../../components/sign-in-form"
import { SignUpForm } from "../../components/sign-up-form"

export const JwtSignInView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn")

  // Handle tab switching
  const handleTabChange = (tab: "signIn" | "signUp") => {
    setActiveTab(tab)
  }

  return (
    <AuthWrapper
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      signInContent={<SignInForm />}
      signUpContent={<SignUpForm />}
    />
  )
}

// src/utils/auth.js
import { users } from "../data/users.json";

// Get users from the array
const getUsers = () => {
  return users || [];
};

// Login function using local users
export const login = async (email, password) => {
  try {
    console.log("Attempting login for:", email);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userList = getUsers();
    
    // Find user by email and password
    const user = userList.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && 
           u.password === password.trim()
    );
    
    if (user) {
      console.log("Login successful:", user);
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    console.log("User not found or password incorrect");
    throw new Error("Invalid login credentials");
    
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Signup function
export const signup = async (name, email, password, role = "Employee") => {
  try {
    console.log("Attempting signup for:", email);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userList = getUsers();
    
    // Check if user already exists
    const existingUser = userList.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    
    // Create new user
    const newUser = {
      id: String(userList.length + 1),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: role
    };
    
    // Add to users array
    userList.push(newUser);
    
    console.log("Signup successful:", newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
    
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    localStorage.removeItem("currentUser");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

// Check if user exists
export const checkUserExists = (email) => {
  try {
    const userList = getUsers();
    return userList.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  } catch (error) {
    console.error("Check user error:", error);
    return false;
  }
};

// Get all users (for debugging)
export const getAllUsers = () => {
  return getUsers();
};
// // src/utils/auth.js
// import { supabase } from "../supabase";

// // Login function with better error handling
// export const login = async (email, password) => {
//   try {
//     console.log("Attempting login for:", email);
    
//     const cleanEmail = email.trim().toLowerCase();
//     const cleanPassword = password.trim();
    
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: cleanEmail,
//       password: cleanPassword,
//     });

//     if (error) {
//       console.error("Login error details:", error);
      
//       if (error.message.includes("Email not confirmed")) {
//         throw new Error("Please verify your email before logging in.");
//       } else if (error.message.includes("Invalid login credentials")) {
//         throw new Error("Invalid email or password. Please try again.");
//       } else if (error.message.includes("rate limit")) {
//         throw new Error("Too many login attempts. Please wait a moment.");
//       } else {
//         throw error;
//       }
//     }

//     console.log("Login successful:", data);

//     if (data.user) {
//       // Try to get user profile from users table
//       let userData = null;
//       let profileError = null;
      
//       try {
//         const result = await supabase
//           .from("users")
//           .select("*")
//           .eq("id", data.user.id)
//           .maybeSingle(); // Changed from .single() to .maybeSingle()
        
//         userData = result.data;
//         profileError = result.error;
        
//         console.log("Profile query result:", { userData, profileError });
//       } catch (err) {
//         console.warn("Profile query failed:", err);
//       }

//       // If profile doesn't exist, create it
//       if (!userData) {
//         console.log("Profile not found, creating one...");
//         try {
//           const { data: newProfile, error: insertError } = await supabase
//             .from("users")
//             .insert([
//               {
//                 id: data.user.id,
//                 name: data.user.user_metadata?.name || "User",
//                 email: data.user.email,
//                 role: data.user.user_metadata?.role || "Employee",
//                 created_at: new Date().toISOString(),
//               },
//             ])
//             .select()
//             .maybeSingle();
          
//           if (insertError) {
//             console.warn("Could not create profile:", insertError);
//             // Return basic user data from auth
//             return {
//               id: data.user.id,
//               email: data.user.email,
//               name: data.user.user_metadata?.name || "User",
//               role: data.user.user_metadata?.role || "Employee"
//             };
//             console.log("Returning from login:", result);
//             return result;
//           }
          
//           userData = newProfile;
//           console.log("Profile created successfully:", userData);
//         } catch (insertErr) {
//           console.warn("Profile creation failed:", insertErr);
//         }
//       }

//       // Return user data (either from profile or auth)
//       return {
//         id: data.user.id,
//         email: data.user.email,
//         name: userData?.name || data.user.user_metadata?.name || "User",
//         role: userData?.role || data.user.user_metadata?.role || "Employee"
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error("Login error:", error.message);
//     throw error;
//   }
// };

// // Signup function
// export const signup = async (name, email, password, role = "Employee") => {
//   try {
//     console.log("Attempting signup for:", email);
    
//     const { data, error } = await supabase.auth.signUp({
//       email: email.trim().toLowerCase(),
//       password: password.trim(),
//       options: {
//         data: {
//           name: name.trim(),
//           role: role,
//         },
//       },
//     });

//     if (error) {
//       console.error("Signup error:", error);
//       throw error;
//     }

//     console.log("Signup successful:", data);

//     if (data.user) {
//       // Try to insert into users table
//       try {
//         const { error: insertError } = await supabase
//           .from("users")
//           .insert([
//             {
//               id: data.user.id,
//               name: name.trim(),
//               email: email.trim().toLowerCase(),
//               role: role,
//               created_at: new Date().toISOString(),
//             },
//           ]);

//         if (insertError) {
//           console.error("Profile insert error:", insertError);
//           // Don't throw - user can still login
//         } else {
//           console.log("Profile created successfully!");
//         }
//       } catch (insertErr) {
//         console.warn("Profile insert failed:", insertErr);
//       }

//       return {
//         id: data.user.id,
//         email: data.user.email,
//         name: name.trim(),
//         role: role
//       };
//     }

//     return null;
//   } catch (error) {
//     console.error("Signup error:", error.message);
//     throw error;
//   }
// };

// // Logout function
// export const logout = async () => {
//   try {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//     localStorage.removeItem("currentUser");
//     return true;
//   } catch (error) {
//     console.error("Logout error:", error);
//     return false;
//   }
// };
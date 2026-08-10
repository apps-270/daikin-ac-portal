// // src/components/Snowflakes.jsx
// import React from 'react';

// export default function Snowflakes() {
//   // Generate random positions and sizes
//   const flakes = Array.from({ length: 30 }, (_, i) => ({
//     id: i,
//     left: Math.random() * 100,
//     size: Math.random() * 1.5 + 0.5,
//     duration: Math.random() * 10 + 10,
//     delay: Math.random() * 10,
//     spinDuration: Math.random() * 10 + 5,
//     opacity: Math.random() * 0.5 + 0.3,
//   }));

//   return (
//     <div className="snowflakes-container">
//       {flakes.map((flake) => (
//         <div
//           key={flake.id}
//           className="snowflake"
//           style={{
//             left: `${flake.left}%`,
//             fontSize: `${flake.size}em`,
//             animationDuration: `${flake.duration}s, ${flake.spinDuration}s`,
//             animationDelay: `${flake.delay}s, 0s`,
//             opacity: flake.opacity,
//           }}
//         >
//           ❄
//         </div>
//       ))}
//     </div>
//   );
// }